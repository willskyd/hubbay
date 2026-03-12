import { WalletTxnType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { allowMockPayments, isDatabaseConfigured } from "@/lib/env";
import { initializePaystackTransaction } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

const schema = z.object({
  amountNaira: z.number().min(1000),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Wallet deposit is unavailable in demo mode. Configure DATABASE_URL." },
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

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid deposit amount." }, { status: 400 });
  }

  const amountKobo = Math.round(parsed.data.amountNaira * 100);
  const reference = `WLT-${Date.now()}-${Math.round(Math.random() * 99999)}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";

  const wallet = await prisma.wallet.upsert({
    where: { userId: dbUserId },
    update: {},
    create: { userId: dbUserId },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      userId: dbUserId,
      type: WalletTxnType.DEPOSIT,
      amountKobo,
      reference,
      description: "Wallet top-up initialization",
      metadata: {
        source: "wallet-deposit",
      },
    },
  });

  const hasPaystackSecret = Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
  if (!hasPaystackSecret && allowMockPayments) {
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balanceKobo: { increment: amountKobo } },
      }),
      prisma.walletTransaction.update({
        where: { reference },
        data: { status: "SUCCESS", description: "Test wallet deposit auto-confirmed." },
      }),
    ]);

    return NextResponse.json({
      authorizationUrl: `/wallet/callback?reference=${reference}`,
      reference,
    });
  }

  try {
    const initialized = await initializePaystackTransaction({
      email: session.user.email,
      amountKobo,
      reference,
      callbackUrl: `${baseUrl}/wallet/callback`,
      metadata: {
        type: "wallet-deposit",
        userId: dbUserId,
      },
    });

    return NextResponse.json({
      authorizationUrl: initialized.data.authorization_url,
      reference,
    });
  } catch (error) {
    await prisma.walletTransaction.update({
      where: { reference },
      data: { status: "FAILED", description: (error as Error).message },
    });
    return NextResponse.json(
      { error: `Unable to start Paystack deposit: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
