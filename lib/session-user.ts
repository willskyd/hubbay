import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const objectIdPattern = /^[a-f\d]{24}$/i;

export function isMongoObjectId(value?: string | null) {
  return Boolean(value && objectIdPattern.test(value));
}

export async function resolveSessionUserId(user?: {
  id?: string | null;
  email?: string | null;
}) {
  if (!user) return null;
  if (!isDatabaseConfigured) return user.id ?? null;

  if (isMongoObjectId(user.id)) {
    return user.id!;
  }

  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return dbUser?.id ?? null;
}
