"use client"

import { PropertyChart } from "@/components/dashboard/property-chart"
import { RecentProperties } from "@/components/dashboard/recent-properties"
import { StatCard } from "@/components/dashboard/stat-card"
import { SidebarClient } from "@/components/layout/sidebar"
import { useProperties } from "@/contexts/property-context"
import { getComputedStatus } from "@/lib/get-computed-status"
import { Home, CheckCircle, Key, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { properties } = useProperties()

  const stats = properties.reduce(
    (acc, property) => {
      const computedStatus = getComputedStatus(property)
      acc.total++
      if (computedStatus.displayStatus === "Available") acc.available++
      if (computedStatus.displayStatus === "Rented" && !computedStatus.isExpiringSoon) acc.rented++
      if (computedStatus.displayStatus === "Expired") acc.expired++
      if (computedStatus.isExpiringSoon && !computedStatus.isExpired) acc.expiringSoon++
      return acc
    },
    { total: 0, available: 0, rented: 0, expired: 0, expiringSoon: 0 }
  )

  return (
    <div className="flex min-h-screen">
      <SidebarClient />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Overview of your rental properties
        </p>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <StatCard title="Total Properties" value={stats.total} icon={Home} color="bg-chart-1 text-white" />
          <StatCard title="Available" value={stats.available} icon={CheckCircle} color="bg-success text-success-foreground" />
          <StatCard title="Rented" value={stats.rented} icon={Key} color="bg-chart-1 text-white" />
          <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={AlertCircle} color="bg-warning text-warning-foreground" />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <RecentProperties />
          <PropertyChart />
        </div>
      </main>
    </div>
  )
}


