import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({
      balanceKobo: 0,
      transactions: [],
      demoMode: true,
    });
  }

  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUserId = await resolveSessionUserId(session.user);
  if (!dbUserId) {
    return NextResponse.json({ error: "Invalid user session. Please sign in again." }, { status: 401 });
  }

  const wallet = await prisma.wallet.upsert({
    where: { userId: dbUserId },
    update: {},
    create: { userId: dbUserId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 15,
      },
    },
  });

  return NextResponse.json({
    balanceKobo: wallet.balanceKobo,
    transactions: wallet.transactions,
  });
}
