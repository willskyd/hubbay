import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type AuthRouteContext = {
  params: Promise<{ nextauth: string[] }>;
};

function syncNextAuthUrl(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  if (process.env.NEXTAUTH_URL !== origin) {
    process.env.NEXTAUTH_URL = origin;
  }
}

export async function GET(request: Request, context: AuthRouteContext) {
  syncNextAuthUrl(request);
  return handler(request, context);
}

export async function POST(request: Request, context: AuthRouteContext) {
  syncNextAuthUrl(request);
  return handler(request, context);
}
