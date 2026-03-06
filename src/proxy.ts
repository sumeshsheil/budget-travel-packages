import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy — Landing & User Dashboard Route Protection
 *
 * Domain: budgettravelpackages.in
 * Focus: Public landing, blogs, and Customer Dashboard.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";
  const adminUrl = isProduction
    ? process.env.ADMIN_URL
    : process.env.LOCAL_ADMIN_URL;

  // 1. LEGACY REDIRECTS
  // Redirect /travel-blogs to /blogs
  if (url.pathname.startsWith("/travel-blogs")) {
    const newPath = url.pathname.replace("/travel-blogs", "/blogs");
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // Redirect legacy policy paths to /legal
  const legacyPaths = ["/privacy-policy", "/terms-and-conditions"];
  if (legacyPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/legal", request.url), 301);
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isProduction,
  });

  // 2. If Admin or Agent is logged into the landing page, send them to the admin portal
  if (token && (token.role === "admin" || token.role === "agent")) {
    // Only redirect if they are trying to access dashboard or login, keep landing page accessible
    if (url.pathname.startsWith("/dashboard") || url.pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", adminUrl));
    }
  }

  // 3. PROTECTED: /dashboard/*
  if (url.pathname.startsWith("/dashboard")) {
    // Note: Customer auth redirects are also handled by requireCustomerAuth guard in components,
    // but we can add proxy protection here for faster redirects.
    if (!token) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("callbackUrl", url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: Only customers should access the main dashboard
    if (token.role !== "customer") {
      return NextResponse.redirect(new URL("/admin", adminUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/travel-blogs/:path*",
    "/privacy-policy",
    "/terms-and-conditions",
  ],
};
