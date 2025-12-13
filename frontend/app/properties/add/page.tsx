"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { useAuth } from "@/contexts/auth-context"
import { PropertyForm } from "@/components/forms/property-form"

export default function AddPropertyPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/properties")
    }
  }, [user, router])

  if (user?.role !== "admin") {
    return null
  }

  return (
    <ProtectedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Add Property</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Create a new rental property</p>
        </div>

        <div className="max-w-4xl">
          <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm">
            <PropertyForm mode="add" />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
