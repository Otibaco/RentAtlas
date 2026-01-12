import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Runs on all dashboard/protected pages
export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  // If no token, redirect to login
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If token exists and user is on /login, redirect to dashboard
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Continue request normally
  return NextResponse.next()
}

// Run proxy only on these paths
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
