"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { PropertyTableSkeleton } from "@/components/properties/loading-skeleton"
import { Skeleton } from "@/components/ui/skeleton"


export default function Loading() {
  return (
    <ProtectedLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>

        <Skeleton className="h-5 w-64 mb-4" />

        <PropertyTableSkeleton />
      </div>
    </ProtectedLayout>
  )
}
