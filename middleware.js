import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.cookies.get("token")?.value;

  if (!authToken && request.nextUrl.pathname != "/auth/login") {
    const absoluteURL = new URL("/auth/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/about",
    "/reports/:path*",
    "/api/detail/:path*",
    "/api/summary/:path*",
  ],
};
// "/reports/detail/energymeter",
    // "/reports/detail/production",
    // "/reports/summary/energymeter",
    // "/reports/summary/production",