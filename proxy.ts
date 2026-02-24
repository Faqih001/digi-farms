import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/farmer", "/supplier", "/lender", "/admin"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    const role = (token.role as string) ?? "FARMER";
    const redirectMap: Record<string, string> = {
      FARMER: "/farmer",
      SUPPLIER: "/supplier",
      LENDER: "/lender",
      ADMIN: "/admin",
    };
    return NextResponse.redirect(new URL(redirectMap[role] ?? "/farmer", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isProtected && token) {
    const role = token.role as string;
    const roleRouteMap: Record<string, string> = {
      FARMER: "/farmer",
      SUPPLIER: "/supplier",
      LENDER: "/lender",
      ADMIN: "/admin",
    };

    // Admin can access everything
    if (role === "ADMIN") return NextResponse.next();

    const allowedPrefix = roleRouteMap[role ?? "FARMER"];
    const isAdminRoute = pathname.startsWith("/admin");

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
