"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Plus, Search, Download } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useProperties } from "@/contexts/property-context"
import { Property, PropertyStatus } from "@/lib/mock-data"
import { getComputedStatus } from "@/lib/get-computed-status"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyTable } from "@/components/properties/property-table"
import { UpdateStatusModal } from "@/components/properties/update-status-modal"
import { PaginationControlled } from "@/components/ui/paginationcontrolled"

const ITEMS_PER_PAGE = 10

export default function PropertiesPage() {
  const { user } = useAuth()
  const { properties } = useProperties()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "All">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [updateStatusProperty, setUpdateStatusProperty] = useState<Property | null>(null)

  // Filter and search
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const computedStatus = getComputedStatus(property)
      const matchesSearch =
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "All" || computedStatus.displayStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [properties, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(properties, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rentops-properties-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Properties exported successfully")
  }

  return (
    <ProtectedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Properties</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Manage your rental properties</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button onClick={handleExportJSON} variant="outline" className="w-full sm:w-auto bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            {user?.role === "admin" && (
              <Link href="/properties/add" className="w-full sm:w-auto">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </Link>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as PropertyStatus | "All")
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedProperties.length} of {filteredProperties.length} properties
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <PropertyTable properties={paginatedProperties} onUpdateStatus={setUpdateStatusProperty} />
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <PaginationControlled
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <UpdateStatusModal property={updateStatusProperty} onClose={() => setUpdateStatusProperty(null)} />
    </ProtectedLayout>
  )
}
