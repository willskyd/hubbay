import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ orders: [], demoMode: true });
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
      timeline: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
