import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";

const complaintSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  orderId: z.string().trim().max(100).optional(),
  message: z.string().trim().min(12).max(1000),
});

export async function POST(request: Request) {
  const parsed = complaintSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid complaint details." }, { status: 400 });
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "Complaints are unavailable in demo mode. Configure DATABASE_URL." },
      { status: 503 },
    );
  }

  const session = await getAuthSession();
  const dbUserId = await resolveSessionUserId(session?.user);

  await prisma.complaint.create({
    data: {
      userId: dbUserId || null,
      name: parsed.data.name,
      email: parsed.data.email,
      orderId: parsed.data.orderId || null,
      message: parsed.data.message,
      status: "OPEN",
    },
  });

  return NextResponse.json({ message: "Complaint submitted. Support will reach out shortly." });
}
