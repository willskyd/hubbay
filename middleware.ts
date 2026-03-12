import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { defaultAuthSecret } from "@/lib/env";

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/auth/signin", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: defaultAuthSecret,
  });

  if (!token) {
    return redirectToSignIn(request);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const tokenRole = typeof token.role === "string" ? token.role : "";
    const tokenEmail = typeof token.email === "string" ? token.email : "";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@hubbay.com").toLowerCase();
    const isAdmin =
      tokenRole === "ADMIN" || tokenEmail.toLowerCase() === adminEmail;

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/admin/:path*"],
};
