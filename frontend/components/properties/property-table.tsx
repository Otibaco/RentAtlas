"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useProperties } from "@/contexts/property-context"
import type { Property } from "@/lib/mock-data"
import { getComputedStatus } from "@/lib/get-computed-status"
import { formatCurrency, formatDate, cn } from "@/lib/utils2"

import { Edit, Trash2, RotateCw, AlertCircle, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { Modal } from "../ui/modal"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface PropertyTableProps {
  properties: Property[]
  onUpdateStatus: (property: Property) => void
}

type SortField = "name" | "type" | "location" | "price" | "status"
type SortOrder = "asc" | "desc"

export function PropertyTable({ properties, onUpdateStatus }: PropertyTableProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { deleteProperty } = useProperties()
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; property: Property | null }>({
    isOpen: false,
    property: null,
  })
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Available":
        return "default"
      case "Rented":
        return "default"
      case "Expired":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedProperties = [...properties].sort((a, b) => {
    let aValue: string | number = ""
    let bValue: string | number = ""

    switch (sortField) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "type":
        aValue = a.type
        bValue = b.type
        break
      case "location":
        aValue = a.location
        bValue = b.location
        break
      case "price":
        aValue = a.price
        bValue = b.price
        break
      case "status":
        aValue = getComputedStatus(a).displayStatus
        bValue = getComputedStatus(b).displayStatus
        break
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const handleDelete = () => {
    if (deleteModal.property) {
      deleteProperty(deleteModal.property.id)
      toast.success(`${deleteModal.property.name} has been deleted`)
      setDeleteModal({ isOpen: false, property: null })
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={cn("h-3 w-3", sortField === field && "text-foreground")} />
    </button>
  )

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">No properties found</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">
                  <SortButton field="name">Name</SortButton>
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">
                  <SortButton field="type">Type</SortButton>
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">
                  <SortButton field="location">Location</SortButton>
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">
                  <SortButton field="price">Price</SortButton>
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">Tenant</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">End Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {sortedProperties.map((property, index) => {
                const computedStatus = getComputedStatus(property)
                return (
                  <motion.tr
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="group transition-colors hover:bg-accent/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{property.name}</span>
                        {computedStatus.isExpiringSoon && !computedStatus.isExpired && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <AlertCircle
                              className="h-4 w-4 text-warning"
                              aria-label="Expiring soon"
                            />
                          </motion.div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{property.type}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{property.location}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{formatCurrency(property.price)}/mo</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{property.tenant || "—"}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {property.endDate ? formatDate(property.endDate) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={getStatusVariant(computedStatus.displayStatus)}>
                        {computedStatus.displayStatus}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => onUpdateStatus(property)}
                          variant="ghost"
                          size="sm"
                          title="Update Status"
                          className="h-8 w-8 p-0 opacity-0 transition-all group-hover:opacity-100"
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        {user?.role === "admin" && (
                          <>
                            <Button
                              onClick={() => router.push(`/properties/edit/${property.id}`)}
                              variant="ghost"
                              size="sm"
                              title="Edit"
                              className="h-8 w-8 p-0 opacity-0 transition-all group-hover:opacity-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => setDeleteModal({ isOpen: true, property })}
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              className="h-8 w-8 p-0 text-destructive opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {sortedProperties.map((property, index) => {
          const computedStatus = getComputedStatus(property)
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{property.name}</h3>
                    {computedStatus.isExpiringSoon && !computedStatus.isExpired && (
                      <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {property.type} • {property.location}
                  </p>
                </div>
                <Badge variant={getStatusVariant(computedStatus.displayStatus)} className="ml-2 flex-shrink-0">
                  {computedStatus.displayStatus}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">{formatCurrency(property.price)}/mo</span>
                </div>
                {property.tenant && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tenant:</span>
                      <span>{property.tenant}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date:</span>
                      <span>{formatDate(property.endDate)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-border/50">
                <Button onClick={() => onUpdateStatus(property)} variant="outline" size="sm" className="flex-1">
                  <RotateCw className="mr-2 h-3.5 w-3.5" />
                  Update
                </Button>
                {user?.role === "admin" && (
                  <>
                    <Button
                      onClick={() => router.push(`/properties/edit/${property.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteModal({ isOpen: true, property })}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, property: null })}
        title="Delete Property"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteModal.property?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, property: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
