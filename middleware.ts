import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPrefixes = ["/farmer", "/supplier", "/lender", "/admin"];

// Routes accessible only for non-authenticated users
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    const role = session.user.role ?? "FARMER";
    const redirectMap: Record<string, string> = {
      FARMER: "/farmer",
      SUPPLIER: "/supplier",
      LENDER: "/lender",
      ADMIN: "/admin",
    };
    return NextResponse.redirect(new URL(redirectMap[role] ?? "/farmer", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isProtected && session) {
    const role = session.user.role;
    const roleRouteMap: Record<string, string> = {
      FARMER: "/farmer",
      SUPPLIER: "/supplier",
      LENDER: "/lender",
      ADMIN: "/admin",
    };

    const allowedPrefix = roleRouteMap[role ?? "FARMER"];
    const isAdminRoute = pathname.startsWith("/admin");

    // Admin can access everything
    if (role === "ADMIN") return NextResponse.next();

    // Non-admin trying to access admin route
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }

    // Role mismatch — redirect to correct dashboard
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
