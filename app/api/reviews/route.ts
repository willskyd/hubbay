import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

const schema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Reviews are unavailable in demo mode." },
      { status: 503 },
    );
  }

  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUserId = await resolveSessionUserId(session.user);
  if (!dbUserId) {
    return NextResponse.json({ error: "Invalid user session. Please sign in again." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review payload." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
  });
  if (!order || order.userId !== dbUserId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.status !== OrderStatus.DELIVERED) {
    return NextResponse.json(
      { error: "Reviews are available only after delivery." },
      { status: 400 },
    );
  }

  await prisma.review.upsert({
    where: { orderId: order.id },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment?.trim() || null,
    },
    create: {
      orderId: order.id,
      userId: dbUserId,
      rating: parsed.data.rating,
      comment: parsed.data.comment?.trim() || null,
    },
  });

  return NextResponse.json({ message: "Review submitted. Thank you!" });
}
