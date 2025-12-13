"use client"

import { mockProperties, Property } from "@/lib/mock-data"
import { createContext, useContext, useState, type ReactNode } from "react"

interface PropertyContextType {
  properties: Property[]
  addProperty: (property: Omit<Property, "id">) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void
  getPropertyById: (id: string) => Property | undefined
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(mockProperties)

  const addProperty = (property: Omit<Property, "id">) => {
    const newProperty: Property = {
      ...property,
      id: `PROP-${Date.now()}`,
    }
    setProperties((prev) => [newProperty, ...prev])
  }

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) => prev.map((prop) => (prop.id === id ? { ...prop, ...updates } : prop)))
  }

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id))
  }

  const getPropertyById = (id: string) => {
    return properties.find((prop) => prop.id === id)
  }

  return (
    <PropertyContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty, getPropertyById }}>
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperties() {
  const context = useContext(PropertyContext)
  if (!context) {
    throw new Error("useProperties must be used within PropertyProvider")
  }
  return context
}
