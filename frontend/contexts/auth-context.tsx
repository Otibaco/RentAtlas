"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "admin" | "staff"

interface User {
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock login - simulate async
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email format")
    }

    setUser({
      email,
      role,
      name: email.split("@")[0],
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
