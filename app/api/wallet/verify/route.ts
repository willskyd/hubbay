import { NextResponse } from "next/server";
import { z } from "zod";

import { isDatabaseConfigured } from "@/lib/env";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  reference: z.string().min(6),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Wallet verification is unavailable in demo mode." },
      { status: 503 },
    );
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reference." }, { status: 400 });
  }

  const txn = await prisma.walletTransaction.findUnique({
    where: { reference: parsed.data.reference },
    include: { wallet: true },
  });

  if (!txn) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  if (txn.status === "SUCCESS") {
    return NextResponse.json({ message: "Deposit already verified." });
  }

  try {
    const verification = await verifyPaystackTransaction(parsed.data.reference);
    if (verification.data.status !== "success") {
      await prisma.walletTransaction.update({
        where: { reference: parsed.data.reference },
        data: {
          status: "FAILED",
          description: verification.data.gateway_response || "Payment failed",
        },
      });
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: txn.walletId },
        data: { balanceKobo: { increment: verification.data.amount } },
      }),
      prisma.walletTransaction.update({
        where: { reference: parsed.data.reference },
        data: {
          status: "SUCCESS",
          description: "Wallet credited via Paystack",
        },
      }),
    ]);

    return NextResponse.json({ message: "Wallet funded successfully." });
  } catch {
    return NextResponse.json({ error: "Could not verify transaction." }, { status: 500 });
  }
}
