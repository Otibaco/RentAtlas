"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { decodeJwt } from "@/lib/jwt"

export type UserRole = "ADMIN" | "STAFF"

interface User {
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  /**
   * Restore session from cookie (client-side UX only)
   */
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1]

    if (!token) return

    const decoded = decodeJwt(token)

    if (decoded.exp * 1000 < Date.now()) {
      logout()
      return
    }

    setUser({
      email: decoded.sub,
      role: decoded.role,
    })
  }, [])

  /**
   * Login → backend → set cookie
   */
  const login = async (email: string, password: string, role: UserRole) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    })

    if (!res.ok) {
      throw new Error("Invalid credentials")
    }

    const { token } = await res.json()
    const decoded = decodeJwt(token)

    // Store token in cookie (Proxy-readable)
    document.cookie = `token=${token}; path=/; SameSite=Lax`

    setUser({
      email: decoded.sub,
      role: decoded.role,
    })
  }

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/"
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
