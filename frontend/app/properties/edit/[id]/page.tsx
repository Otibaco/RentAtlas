"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useProperties } from "@/contexts/property-context"
import { PropertyForm } from "@/components/forms/property-form"
import { ProtectedLayout } from "@/components/layout/protected-layout"


export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { getPropertyById } = useProperties()
  const property = getPropertyById(id)

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/properties")
    } else if (!property) {
      router.push("/properties")
    }
  }, [user, property, router])

  if (user?.role !== "admin" || !property) {
    return null
  }

  return (
    <ProtectedLayout >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Property</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Update property details</p>
        </div>

        <div className="max-w-4xl">
          <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm">
            <PropertyForm mode="edit" property={property} />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
