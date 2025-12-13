"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Property, PropertyStatus } from "@/lib/mock-data"
import { toast } from "sonner"
import { useProperties } from "@/contexts/property-context"
import { Modal } from "../ui/modal"
import { Label } from "../ui/label"
import { Button } from "../ui/button"


interface UpdateStatusModalProps {
  property: Property | null
  onClose: () => void
}

interface FormData {
  status: PropertyStatus
  tenant: string
  startDate: string
  endDate: string
}

interface FormErrors {
  tenant?: string
  endDate?: string
}

export function UpdateStatusModal({ property, onClose }: UpdateStatusModalProps) {
  const { updateProperty } = useProperties()
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<"set-status" | "renew">("set-status")
  const [formData, setFormData] = useState<FormData>({
    status: property?.status || "Available",
    tenant: property?.tenant || "",
    startDate: property?.startDate || "",
    endDate: property?.endDate || "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (property) {
      setFormData({
        status: property.status,
        tenant: property.tenant || "",
        startDate: property.startDate || "",
        endDate: property.endDate || "",
      })
      setAction(property.status === "Rented" ? "renew" : "set-status")
    }
  }, [property])

  // Reset fields based on status
  useEffect(() => {
    if (formData.status === "Available" || formData.status === "Expired") {
      setFormData((prev) => ({ ...prev, tenant: "", startDate: "", endDate: "" }))
    }
  }, [formData.status])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.status === "Rented") {
      if (!formData.tenant.trim()) {
        newErrors.tenant = "Tenant name is required"
      }
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        if (end <= start) {
          newErrors.endDate = "End date must be after start date"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !property) {
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updates: Partial<Property> = {
        status: formData.status,
        ...(formData.status === "Rented" && {
          tenant: formData.tenant.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
        ...((formData.status === "Available" || formData.status === "Expired") && {
          tenant: undefined,
          startDate: undefined,
          endDate: undefined,
        }),
      }

      updateProperty(property.id, updates)
      toast.success(
        action === "renew"
          ? `${property.name} has been renewed`
          : `${property.name} status updated to ${formData.status}`,
      )
      onClose()
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  if (!property) return null

  return (
    <Modal isOpen={!!property} onClose={onClose} title="Update Property Status">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label>Action</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={action === "set-status" ? "default" : "outline"}
              onClick={() => setAction("set-status")}
              className="flex-1 text-sm"
            >
              Set Status
            </Button>
            <Button
              type="button"
              variant={action === "renew" ? "default" : "outline"}
              onClick={() => {
                setAction("renew")
                setFormData((prev) => ({ ...prev, status: "Rented" }))
              }}
              className="flex-1 text-sm"
            >
              Renew
            </Button>
          </div>
        </div>

        {formData.status === "Rented" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2"></div>
          </motion.div>
        )}

        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4 text-xs sm:text-sm">
          <p className="font-medium mb-1">Current Status</p>
          <p className="text-muted-foreground">
            {property.status}
            {property.tenant && ` • Tenant: ${property.tenant}`}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3 sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
