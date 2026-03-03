import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/farmer", "/supplier", "/lender", "/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const ROLE_ROUTES: Record<string, string> = {
  FARMER: "/farmer",
  SUPPLIER: "/supplier",
  LENDER: "/lender",
  ADMIN: "/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isAuthenticated = !!session?.user;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Redirect authenticated users away from auth pages to their dashboard
  if (isAuthRoute && isAuthenticated) {
    const role =
      (session!.user as { role?: string }).role ?? "FARMER";
    return NextResponse.redirect(
      new URL(ROLE_ROUTES[role] ?? "/farmer", req.url)
    );
  }

  // Redirect unauthenticated users to login with callbackUrl
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for authenticated users
  if (isProtected && isAuthenticated) {
    const role =
      (session!.user as { role?: string }).role ?? "FARMER";

    // Admin can access everything
    if (role === "ADMIN") return NextResponse.next();

    const allowedPrefix = ROLE_ROUTES[role] ?? "/farmer";

    // Prevent non-admins from accessing the admin area
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(allowedPrefix, req.url));
    }

    // Redirect to the correct role dashboard if mismatched
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals, static assets, API routes, and public uploads
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.ico|.*\\.jpeg|.*\\.jpg|.*\\.png|.*\\.svg|uploads).*)",
  ],
};
