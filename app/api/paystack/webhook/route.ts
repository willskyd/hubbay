import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

function verifySignature(payload: string, signature: string | null) {
  if (!signature) return false;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;
  const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ received: true, demoMode: true });
  }

  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    data: {
      status: string;
      reference: string;
      amount: number;
      metadata?: {
        type?: string;
      };
    };
  };

  if (event.event !== "charge.success" || event.data.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;
  const amount = event.data.amount;
  const type = event.data.metadata?.type;

  if (type === "wallet-deposit") {
    const txn = await prisma.walletTransaction.findUnique({
      where: { reference },
    });
    if (txn && txn.status !== "SUCCESS") {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: txn.walletId },
          data: { balanceKobo: { increment: amount } },
        }),
        prisma.walletTransaction.update({
          where: { reference },
          data: { status: "SUCCESS", description: "Webhook verified deposit" },
        }),
      ]);
    }
  }

  if (type === "order-payment") {
    const order = await prisma.order.findFirst({
      where: { paymentRef: reference },
    });
    if (order && order.paymentStatus !== "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID" },
        }),
        prisma.orderTimeline.create({
          data: {
            orderId: order.id,
            status: "PENDING",
            note: "Paystack webhook confirmed payment.",
          },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
