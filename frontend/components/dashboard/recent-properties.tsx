"use client"

import { motion } from "framer-motion"
import { useProperties } from "@/contexts/property-context"
import { Badge } from "@/components/ui/badge"
import { getComputedStatus } from "@/lib/get-computed-status"

import { AlertCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils2"

export function RecentProperties() {
  const { properties } = useProperties()
  const recentProperties = properties.slice(0, 5)

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  switch (status) {
    case "Available":
      return "default"     // use default for Available (green-like)
    case "Rented":
      return "secondary"   // blue/amber
    case "Expired":
      return "destructive" // red
    default:
      return "outline"
  }
}


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border border-border/50 bg-card shadow-sm"
    >
      <div className="border-b border-border/50 p-4 sm:p-6">
        <h2 className="text-base font-semibold sm:text-lg">Recent Properties</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">Latest property updates</p>
      </div>
      <div className="divide-y divide-border/40">
        {recentProperties.map((property, index) => {
          const computedStatus = getComputedStatus(property)
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="p-3 sm:p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{property.name}</h3>
                    {computedStatus.isExpiringSoon && !computedStatus.isExpired && (
                      <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm truncate">
                    {property.type} • {property.location}
                  </p>
                  {property.tenant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tenant: {property.tenant} • Ends {formatDate(property.endDate)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <Badge variant={getStatusVariant(computedStatus.displayStatus)} className="shrink-0">
                    {computedStatus.displayStatus}
                  </Badge>
                  <p className="text-sm font-semibold">{formatCurrency(property.price)}/mo</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
