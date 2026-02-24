import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPrefixes = ["/farmer", "/supplier", "/lender", "/admin"];

// Routes accessible only for non-authenticated users
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Lightweight edge-safe session detection: check NextAuth session cookies.
  // Full session verification (and role resolution) is server-side only and
  // shouldn't import Node-only modules into the edge runtime.
  const sessionCookie =
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("next-auth.callback-url")?.value ||
    null;
  const isAuthenticated = Boolean(sessionCookie);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Redirect authenticated users away from auth pages (default to /farmer)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/farmer", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: Role-based redirects require server-verified session data (e.g. via
  // `auth()` from next-auth) which imports Node-only modules and cannot run
  // in the edge runtime. Keep middleware lightweight: only guard protected
  // routes by authentication presence, and let server-side handlers enforce
  // role-based access and redirects when needed.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
