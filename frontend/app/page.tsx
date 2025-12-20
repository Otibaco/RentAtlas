"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    } else if (user.role === "ADMIN") {
      router.replace("/dashboard/admin")
    } else {
      router.replace("/dashboard/staff")
    }
  }, [user, router])

  return null
}
