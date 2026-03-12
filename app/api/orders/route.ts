import {
  OrderType,
  PaymentStatus,
  WalletTxnStatus,
  WalletTxnType,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { allowMockPayments, isDatabaseConfigured } from "@/lib/env";
import { DELIVERY_FEE_KOBO, estimateEtaMinutes } from "@/lib/orders";
import { initializePaystackTransaction } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

const objectIdPattern = /^[a-f\d]{24}$/i;

const createOrderSchema = z.object({
  orderType: z.nativeEnum(OrderType),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        dishId: z.string().regex(objectIdPattern, "Invalid dish id"),
        quantity: z.number().int().min(1).max(20),
        specialInstructions: z.string().max(300).optional(),
      }),
    )
    .min(1),
});

function buildOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `HBY-${y}${m}${d}-${suffix}`;
}

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ orders: [], demoMode: true });
  }

  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUserId = await resolveSessionUserId(session.user);
  if (!dbUserId) {
    return NextResponse.json({ error: "Invalid user session. Please sign in again." }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: dbUserId },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Order checkout is unavailable in demo mode. Configure DATABASE_URL." },
      { status: 503 },
    );
  }

  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUserId = await resolveSessionUserId(session.user);
  if (!dbUserId) {
    return NextResponse.json({ error: "Invalid user session. Please sign in again." }, { status: 401 });
  }

  const parsed = createOrderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Some items in your cart are outdated. Please remove and re-add them from the menu.",
      },
      { status: 400 },
    );
  }

  if (
    parsed.data.orderType === OrderType.DELIVERY &&
    (!parsed.data.deliveryAddress || parsed.data.deliveryAddress.trim().length < 8)
  ) {
    return NextResponse.json(
      { error: "Delivery address is required for delivery orders." },
      { status: 400 },
    );
  }

  const dishIds = [...new Set(parsed.data.items.map((item) => item.dishId))];
  const dishes = await prisma.dish.findMany({
    where: { id: { in: dishIds }, isAvailable: true },
  });

  if (dishes.length !== dishIds.length) {
    return NextResponse.json({ error: "Some dishes are unavailable." }, { status: 400 });
  }

  const items = parsed.data.items.map((item) => {
    const dish = dishes.find((d) => d.id === item.dishId)!;
    return {
      dishId: dish.id,
      dishName: dish.name,
      dishImageUrl: dish.imageUrl,
      unitPriceKobo: dish.priceKobo,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions?.trim() || null,
      lineTotalKobo: dish.priceKobo * item.quantity,
    };
  });

  const subtotalKobo = items.reduce((acc, item) => acc + item.lineTotalKobo, 0);
  const deliveryFeeKobo =
    parsed.data.orderType === OrderType.DELIVERY ? DELIVERY_FEE_KOBO : 0;
  const totalKobo = subtotalKobo + deliveryFeeKobo;
  const etaMinutes = estimateEtaMinutes(parsed.data.orderType, items.length);

  const wallet = await prisma.wallet.upsert({
    where: { userId: dbUserId },
    update: {},
    create: { userId: dbUserId },
  });

  const walletUsedKobo = Math.min(wallet.balanceKobo, totalKobo);
  const paystackKobo = totalKobo - walletUsedKobo;
  const paymentStatus =
    paystackKobo === 0
      ? PaymentStatus.PAID
      : walletUsedKobo > 0
        ? PaymentStatus.PARTIALLY_PAID
        : PaymentStatus.UNPAID;

  const orderNumber = buildOrderNumber();
  let paymentRef: string | undefined;
  let authorizationUrl: string | undefined;
  let requiresPaystack = paystackKobo > 0;
  let finalPaymentStatus = paymentStatus;
  let initialTimelineNote = "Order received by HubBay.";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";

  if (paystackKobo > 0) {
    const hasPaystackSecret = Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
    paymentRef = `ORD-${Date.now()}-${Math.round(Math.random() * 99999)}`;

    if (!hasPaystackSecret && allowMockPayments) {
      paymentRef = `MOCK-ORD-${Date.now()}-${Math.round(Math.random() * 99999)}`;
      requiresPaystack = false;
      finalPaymentStatus = PaymentStatus.PAID;
      initialTimelineNote = "Order received. Test payment auto-confirmed.";
    } else if (!hasPaystackSecret) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY is missing on the server." },
        { status: 500 },
      );
    } else {
      try {
        const initialized = await initializePaystackTransaction({
          email: session.user.email,
          amountKobo: paystackKobo,
          reference: paymentRef,
          callbackUrl: `${baseUrl}/checkout/callback`,
          metadata: {
            type: "order-payment",
            userId: dbUserId,
          },
        });
        authorizationUrl = initialized.data.authorization_url;
      } catch (error) {
        if (allowMockPayments) {
          paymentRef = `MOCK-ORD-${Date.now()}-${Math.round(Math.random() * 99999)}`;
          requiresPaystack = false;
          finalPaymentStatus = PaymentStatus.PAID;
          initialTimelineNote = "Order received. Test payment auto-confirmed.";
        } else {
          const reason = error instanceof Error ? error.message : "Paystack request failed.";
          return NextResponse.json(
            { error: `Unable to initialize Paystack payment: ${reason}` },
            { status: 500 },
          );
        }
      }
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: dbUserId,
        orderType: parsed.data.orderType,
        deliveryAddress:
          parsed.data.orderType === OrderType.DELIVERY
            ? parsed.data.deliveryAddress?.trim()
            : null,
        notes: parsed.data.notes?.trim() || null,
        subtotalKobo,
        deliveryFeeKobo,
        totalKobo,
        walletUsedKobo,
        paystackKobo,
        paymentStatus: finalPaymentStatus,
        paymentRef: paymentRef || null,
        etaMinutes,
        items: { create: items },
        timeline: {
          create: {
            status: "PENDING",
            note: initialTimelineNote,
          },
        },
      },
    });

    if (walletUsedKobo > 0) {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balanceKobo: { decrement: walletUsedKobo } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          userId: dbUserId,
          orderId: created.id,
          type: WalletTxnType.DEBIT,
          status: WalletTxnStatus.SUCCESS,
          amountKobo: walletUsedKobo,
          reference: `WALLET-ORDER-${created.id}`,
          description: "Wallet used for order checkout",
        },
      });
    }

    return created;
  });

  return NextResponse.json({
    orderId: order.id,
    requiresPaystack,
    authorizationUrl,
  });
}
