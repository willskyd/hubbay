import { OrderStatus, Role } from "@prisma/client";
import { differenceInMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

const statusRank: Record<OrderStatus, number> = {
  PENDING: 0,
  PREPARING: 1,
  READY: 2,
  DELIVERED: 3,
  CANCELLED: 4,
};

const patchSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

type Props = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_: Request, { params }: Props) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Order tracking is unavailable in demo mode." },
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
  const { orderId } = await params;

  let order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      timeline: {
        orderBy: { createdAt: "asc" },
      },
      items: true,
      review: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const isOwner = order.userId === dbUserId;
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@hubbay.com").toLowerCase();
  const isAdmin =
    session.user.role === Role.ADMIN ||
    (session.user.email && session.user.email.toLowerCase() === adminEmail);
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    order.paymentStatus === "PAID" &&
    order.status !== OrderStatus.CANCELLED &&
    order.status !== OrderStatus.DELIVERED
  ) {
    const ageMinutes = differenceInMinutes(new Date(), new Date(order.createdAt));
    let targetStatus: OrderStatus = OrderStatus.PENDING;
    if (ageMinutes >= 8) targetStatus = OrderStatus.PREPARING;
    if (ageMinutes >= 20) targetStatus = OrderStatus.READY;
    if (ageMinutes >= order.etaMinutes) targetStatus = OrderStatus.DELIVERED;

    if (statusRank[targetStatus] > statusRank[order.status]) {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: targetStatus,
            deliveredAt: targetStatus === OrderStatus.DELIVERED ? new Date() : null,
          },
        }),
        prisma.orderTimeline.create({
          data: {
            orderId: order.id,
            status: targetStatus,
            note: `Auto-progressed to ${targetStatus.toLowerCase()}.`,
          },
        }),
      ]);

      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          timeline: { orderBy: { createdAt: "asc" } },
          items: true,
          review: true,
        },
      });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
    }
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: Props) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Order updates are unavailable in demo mode." },
      { status: 503 },
    );
  }

  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@hubbay.com").toLowerCase();
  const isAdmin =
    session.user.role === Role.ADMIN ||
    (session.user.email && session.user.email.toLowerCase() === adminEmail);
  if (!isAdmin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }
  const { orderId } = await params;

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status: parsed.data.status,
        deliveredAt:
          parsed.data.status === OrderStatus.DELIVERED ? new Date() : undefined,
      },
    });

    await tx.orderTimeline.create({
      data: {
        orderId: order.id,
        status: parsed.data.status,
        note: `Status changed to ${parsed.data.status}.`,
      },
    });

    return order;
  });

  return NextResponse.json({ order: updated });
}
