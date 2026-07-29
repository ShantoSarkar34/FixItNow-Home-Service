import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NON-AUTHORITATIVE middleware.
 *
 * The backend's real auth cookies (accessToken/refreshToken) are httpOnly
 * and issued from a different origin than this frontend, so middleware
 * structurally cannot read or validate them. This middleware only checks
 * a same-origin "hint" cookie the frontend sets after a successful
 * GET /api/auth/me and clears on logout — purely to bounce an obviously
 * logged-out visitor before the dashboard shell renders.
 *
 * The REAL authorization check is useSession() in
 * src/app/dashboard/layout.tsx, which calls the backend directly on
 * every dashboard load. Do not add business logic here.
 */
const HINT_COOKIE = "fixitnow_hint";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!request.cookies.has(HINT_COOKIE)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};