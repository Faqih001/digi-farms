/**
 * Auth.js v5 middleware via proxy.ts (Next.js 16+).
 *
 * Auth.js v5 encrypts session tokens as JWE (A256CBC-HS512), so the old
 * `getToken` from `next-auth/jwt` cannot decrypt them. The `authorized`
 * callback receives the already-decrypted session via the v5 auth engine.
 */
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const PROTECTED_PREFIXES = ["/farmer", "/supplier", "/lender", "/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const ROLE_ROUTES: Record<string, string> = {
  FARMER: "/farmer",
  SUPPLIER: "/supplier",
  LENDER: "/lender",
  ADMIN: "/admin",
};

export const { auth: proxy } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!session?.user;
      const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
      const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

      // Redirect authenticated users away from auth pages to their dashboard
      if (isAuthRoute && isAuthenticated) {
        const role = (session?.user as { role?: string })?.role ?? "FARMER";
        return NextResponse.redirect(
          new URL(ROLE_ROUTES[role] ?? "/farmer", request.url)
        );
      }

      // Redirect unauthenticated users to login
      if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Role-based access control
      if (isProtected && isAuthenticated) {
        const role = (session?.user as { role?: string })?.role ?? "FARMER";
        if (role === "ADMIN") return true;
        const allowedPrefix = ROLE_ROUTES[role] ?? "/farmer";
        if (
          pathname.startsWith("/admin") ||
          !pathname.startsWith(allowedPrefix)
        ) {
          return NextResponse.redirect(new URL(allowedPrefix, request.url));
        }
      }

      return true;
    },
  },
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
