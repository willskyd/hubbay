import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { defaultAuthSecret, isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { isMongoObjectId } from "@/lib/session-user";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const DEFAULT_ADMIN_EMAIL = "admin@hubbay.com";
const DEFAULT_ADMIN_PASSWORD = "AdminHubBay2025!";

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

async function ensureDefaultAdminAccount() {
  if (!isDatabaseConfigured) return null;

  const adminEmail = getAdminEmail();
  const adminPasswordHash = await hash(DEFAULT_ADMIN_PASSWORD, 10);
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const created = await prisma.user.create({
      data: {
        name: "HubBay Admin",
        email: adminEmail,
        role: Role.ADMIN,
        passwordHash: adminPasswordHash,
      },
    });

    await prisma.wallet.upsert({
      where: { userId: created.id },
      update: {},
      create: { userId: created.id },
    });

    return created;
  }

  if (existing.role !== Role.ADMIN || !existing.passwordHash) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        role: Role.ADMIN,
        passwordHash: existing.passwordHash || adminPasswordHash,
        name: existing.name || "HubBay Admin",
      },
    });
  }

  return existing;
}

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  );
}

providers.push(
  CredentialsProvider({
    id: "customer-login",
    name: "Customer Login",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!isDatabaseConfigured) return null;

      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const email = parsed.data.email.trim().toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.passwordHash) return null;
      if (user.role === Role.ADMIN) return null;

      const validPassword = await compare(parsed.data.password, user.passwordHash);
      if (!validPassword) return null;

      return user;
    },
  }),
);

providers.push(
  CredentialsProvider({
    id: "admin-login",
    name: "Admin Login",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!isDatabaseConfigured) return null;

      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const email = parsed.data.email.trim().toLowerCase();
      if (email !== getAdminEmail()) return null;

      const admin = await ensureDefaultAdminAccount();
      if (!admin?.passwordHash) return null;

      const validPassword = await compare(parsed.data.password, admin.passwordHash);
      if (!validPassword) return null;

      return admin;
    },
  }),
);

export const authOptions: NextAuthOptions = {
  adapter: isDatabaseConfigured ? PrismaAdapter(prisma) : undefined,
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role ?? Role.CUSTOMER;
      }
      if (!token.role) token.role = Role.CUSTOMER;
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        let resolvedId = (token.id as string) ?? user?.id ?? "";
        let resolvedRole =
          (token.role as Role) ?? (user as { role?: Role })?.role ?? Role.CUSTOMER;

        if (
          isDatabaseConfigured &&
          !isMongoObjectId(resolvedId) &&
          typeof session.user.email === "string"
        ) {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, role: true },
          });
          if (dbUser) {
            resolvedId = dbUser.id;
            resolvedRole = dbUser.role;
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        }

        session.user.id = resolvedId;
        session.user.role = resolvedRole;
      }
      return session;
    },
  },
  events: isDatabaseConfigured
    ? {
        async createUser({ user }) {
          await prisma.wallet.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id },
          });
        },
      }
    : undefined,
  secret: defaultAuthSecret,
};

export async function getAuthSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Auth session error:", error);
    return null;
  }
}
