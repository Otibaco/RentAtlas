// proxy.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decodeJwt } from "@/lib/jwt"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  /**
   * Public routes
   */
  if (pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  /**
   * No token → force login
   */
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decoded = decodeJwt(token)

    /**
     * Expired JWT
     */
    if (decoded.exp * 1000 < Date.now()) {
      const res = NextResponse.redirect(new URL("/login", request.url))
      res.cookies.delete("token")
      return res
    }

    /**
     * Role-based protection
     */
    if (
      pathname.startsWith("/dashboard/admin") &&
      decoded.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url))
    }

    if (
      pathname.startsWith("/dashboard/staff") &&
      decoded.role !== "STAFF"
    ) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
}
