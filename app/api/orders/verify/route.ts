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
      { error: "Payment verification is unavailable in demo mode." },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { paymentRef: parsed.data.reference },
  });

  if (!order) {
    return NextResponse.json({ error: "Order payment not found." }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ message: "Payment already confirmed.", orderId: order.id });
  }

  try {
    const verification = await verifyPaystackTransaction(parsed.data.reference);
    if (verification.data.status !== "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID" },
      }),
      prisma.orderTimeline.create({
        data: {
          orderId: order.id,
          status: "PENDING",
          note: "Paystack payment confirmed.",
        },
      }),
    ]);

    return NextResponse.json({ message: "Payment confirmed.", orderId: order.id });
  } catch {
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
