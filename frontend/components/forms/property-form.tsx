"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useProperties } from "@/contexts/property-context"
import type { Property, PropertyType, PropertyStatus } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface PropertyFormProps {
  property?: Property
  mode: "add" | "edit"
}

interface FormData {
  name: string
  type: PropertyType
  location: string
  price: string
  description: string
  status: PropertyStatus
  tenant: string
  startDate: string
  endDate: string
}

interface FormErrors {
  name?: string
  location?: string
  price?: string
  tenant?: string
  endDate?: string
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter()
  const { addProperty, updateProperty } = useProperties()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: property?.name || "",
    type: property?.type || "House",
    location: property?.location || "",
    price: property?.price.toString() || "",
    description: property?.description || "",
    status: property?.status || "Available",
    tenant: property?.tenant || "",
    startDate: property?.startDate || "",
    endDate: property?.endDate || "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset tenant fields when status changes to Available
  useEffect(() => {
    if (formData.status === "Available") {
      setFormData((prev) => ({ ...prev, tenant: "", startDate: "", endDate: "" }))
    }
  }, [formData.status])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Property name is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    const price = Number.parseFloat(formData.price)
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Valid price is required"
    }

    if (formData.status === "Rented") {
      if (!formData.tenant.trim()) {
        newErrors.tenant = "Tenant is required for rented properties"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate async

      const propertyData: Omit<Property, "id"> = {
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
        price: Number.parseFloat(formData.price),
        description: formData.description.trim(),
        status: formData.status,
        ...(formData.status === "Rented" && {
          tenant: formData.tenant.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      }

      if (mode === "add") {
        addProperty(propertyData)
        toast.success("Property added successfully!")
      } else if (property) {
        updateProperty(property.id, propertyData)
        toast.success("Property updated successfully!")
      }

      router.push("/properties")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6"
    >
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {/* Property Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Property Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Sunset Villa"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value as PropertyType }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Miami Beach, FL"
            aria-invalid={!!errors.location}
          />
          {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            Monthly Price ($) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="2500"
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value as PropertyStatus }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Tenant (only if Rented) */}
        {formData.status === "Rented" && (
          <div className="space-y-2">
            <Label htmlFor="tenant">
              Tenant Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tenant"
              name="tenant"
              value={formData.tenant}
              onChange={handleChange}
              placeholder="John Smith"
              aria-invalid={!!errors.tenant}
            />
            {errors.tenant && <p className="text-xs text-destructive">{errors.tenant}</p>}
          </div>
        )}

        {/* Start Date (only if Rented) */}
        {formData.status === "Rented" && (
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
          </div>
        )}

        {/* End Date (only if Rented) */}
        {formData.status === "Rented" && (
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              aria-invalid={!!errors.endDate}
            />
            {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Luxury 4-bedroom villa with ocean view..."
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Saving..." : mode === "add" ? "Add Property" : "Update Property"}
        </Button>
      </div>
    </motion.form>
  )
}
