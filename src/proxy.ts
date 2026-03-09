import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";
  const adminUrl = isProduction
    ? process.env.ADMIN_URL
    : process.env.LOCAL_ADMIN_URL;

  if (url.pathname.startsWith("/travel-blogs")) {
    const newPath = url.pathname.replace("/travel-blogs", "/blogs");
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  const legacyPaths = ["/privacy-policy", "/terms-and-conditions"];
  if (legacyPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/legal", request.url), 301);
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isProduction,
  });

  if (token && (token.role === "admin" || token.role === "agent")) {
    if (url.pathname.startsWith("/dashboard") || url.pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", adminUrl));
    }
  }

  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "true");
      return NextResponse.redirect(loginUrl);
    }

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
