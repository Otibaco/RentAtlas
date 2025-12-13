import type { Property, PropertyStatus } from "./mock-data"

export interface ComputedStatus {
  displayStatus: PropertyStatus
  isExpiringSoon: boolean
  isExpired: boolean
  daysUntilExpiration?: number
}

/**
 * Computes the actual status of a property based on rental dates
 * Handles expiration logic and "expiring soon" warnings
 */
export function getComputedStatus(property: Property): ComputedStatus {
  const result: ComputedStatus = {
    displayStatus: property.status,
    isExpiringSoon: false,
    isExpired: false,
  }

  // Only check expiration for rented properties with end dates
  if (property.status === "Rented" && property.endDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day

    const endDate = new Date(property.endDate)
    endDate.setHours(0, 0, 0, 0) // Normalize to start of day

    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    result.daysUntilExpiration = diffDays

    // Check if expired (past end date)
    if (diffDays < 0) {
      result.displayStatus = "Expired"
      result.isExpired = true
    }
    // Check if expiring soon (within 7 days)
    else if (diffDays <= 7) {
      result.isExpiringSoon = true
    }
  }

  return result
}
