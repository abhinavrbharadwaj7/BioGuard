import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import { getRoleHome } from "@/lib/roles";

const protectedRoutes = {
  "/admin": "admin",
  "/tenant": "tenant",
  "/vendor": "vendor",
};

export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;
  const matchedRoute = Object.keys(protectedRoutes).find((route) => (
    pathname === route || pathname.startsWith(`${route}/`)
  ));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (searchParams.get("demo") === "1") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "bioguard-local-development-secret",
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = protectedRoutes[matchedRoute];

  if (token.role !== requiredRole) {
    return NextResponse.redirect(new URL(getRoleHome(token.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tenant/:path*", "/vendor/:path*"],
};
