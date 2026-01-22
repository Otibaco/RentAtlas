import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL + "/auth/login"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" }))
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  const data = await res.json()

  const response = NextResponse.json({
    message: "Login successful",
  })

  // 🔐 JWT (HttpOnly)
  response.cookies.set({
    name: "token",
    value: data.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  // 👤 User identity (non-sensitive)
  response.cookies.set({
    name: "user",
    value: JSON.stringify({
      email: data.email,
      role: data.role,
    }),
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return response
}
