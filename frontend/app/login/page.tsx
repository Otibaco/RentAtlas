"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Building2, Sparkles } from "lucide-react"



export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Minimum 6 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Email and password required")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      toast.success("Login successful")
      router.push("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* <Snowfall /> */}
      <Toaster />

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-105 w-105 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-130 w-130 rounded-full bg-chart-2/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_65%_55%_at_50%_45%,#000_60%,transparent_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 px-6 py-7 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary to-chart-1 shadow-md">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">RentOps</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure property management access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full font-medium"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {/* Demo Access (RESTORED) */}
            <div className="relative mt-4 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs backdrop-blur-sm">
              <Sparkles className="absolute right-3 top-3 h-5 w-5 opacity-10" />
              <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ℹ
                </span>
                Demo Access
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Use any valid email and password (6+ characters). Choose your role to explore different permission
                levels.
              </p>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Enterprise-grade property management
        </p>
      </motion.div>
    </div>
  )
}
