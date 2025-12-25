// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = decodeJwt(token);

    // Expired token → redirect to login and delete cookie
    if (decoded.exp * 1000 < Date.now()) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }

    // Role-based routing
    if (pathname.startsWith("/dashboard/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url));
    }

    if (pathname.startsWith("/dashboard/staff") && decoded.role !== "STAFF") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token → redirect
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Match all dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
