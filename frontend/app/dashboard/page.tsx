"use client"


import { PropertyChart } from "@/components/dashboard/property-chart"
import { RecentProperties } from "@/components/dashboard/recent-properties"
import { StatCard } from "@/components/dashboard/stat-card"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { useProperties } from "@/contexts/property-context"
import { getComputedStatus } from "@/lib/get-computed-status"
import { Home, CheckCircle, Key, AlertCircle } from "lucide-react"
import { Snowfall } from "react-snowfall/lib/Snowfall"

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
    { total: 0, available: 0, rented: 0, expired: 0, expiringSoon: 0 },
  )

  return (
    <ProtectedLayout>
      <Snowfall />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Overview of your rental properties</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <StatCard title="Total Properties" value={stats.total} icon={Home} color="bg-chart-1 text-white" delay={0} />
          <StatCard
            title="Available"
            value={stats.available}
            icon={CheckCircle}
            color="bg-success text-success-foreground"
            delay={0.1}
          />
          <StatCard title="Rented" value={stats.rented} icon={Key} color="bg-chart-1 text-white" delay={0.2} />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={AlertCircle}
            color="bg-warning text-warning-foreground"
            delay={0.3}
          />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <RecentProperties />
          <PropertyChart />
        </div>
      </div>
    </ProtectedLayout>
  )
}
