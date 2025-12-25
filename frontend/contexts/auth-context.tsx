"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

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
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL not defined")

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // console.log("API BASE URL =",API_BASE_URL);


  // Restore session
  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then(res => (res.ok ? res.json() : null))
      .then(user => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);


  const login = async (email: string, password: string, role: UserRole) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    })

    if (!res.ok) throw new Error("Invalid credentials")

    // Fetch user info after login
    const me = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    }).then(r => r.json())

    setUser(me)
  }

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
  }



  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
