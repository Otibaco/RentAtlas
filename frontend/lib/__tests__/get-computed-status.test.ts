import { getComputedStatus } from "../get-computed-status"
import type { Property } from "../mock-data"

describe("getComputedStatus", () => {
  const mockProperty: Property = {
    id: "TEST-001",
    name: "Test Property",
    type: "House",
    location: "Test City",
    price: 2000,
    description: "Test description",
    status: "Rented",
    tenant: "Test Tenant",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  }

  it("should mark property as expired when end date is in the past", () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const property: Property = {
      ...mockProperty,
      endDate: yesterday.toISOString().split("T")[0],
    }

    const result = getComputedStatus(property)

    expect(result.displayStatus).toBe("Expired")
    expect(result.isExpired).toBe(true)
    expect(result.isExpiringSoon).toBe(false)
  })

  it("should mark property as expiring soon when within 7 days", () => {
    const inFiveDays = new Date()
    inFiveDays.setDate(inFiveDays.getDate() + 5)

    const property: Property = {
      ...mockProperty,
      endDate: inFiveDays.toISOString().split("T")[0],
    }

    const result = getComputedStatus(property)

    expect(result.displayStatus).toBe("Rented")
    expect(result.isExpiringSoon).toBe(true)
    expect(result.isExpired).toBe(false)
    expect(result.daysUntilExpiration).toBeLessThanOrEqual(7)
  })

  it("should not mark property as expiring soon when more than 7 days away", () => {
    const inTenDays = new Date()
    inTenDays.setDate(inTenDays.getDate() + 10)

    const property: Property = {
      ...mockProperty,
      endDate: inTenDays.toISOString().split("T")[0],
    }

    const result = getComputedStatus(property)

    expect(result.displayStatus).toBe("Rented")
    expect(result.isExpiringSoon).toBe(false)
    expect(result.isExpired).toBe(false)
  })

  it("should return original status for Available properties", () => {
    const property: Property = {
      ...mockProperty,
      status: "Available",
      tenant: undefined,
      startDate: undefined,
      endDate: undefined,
    }

    const result = getComputedStatus(property)

    expect(result.displayStatus).toBe("Available")
    expect(result.isExpiringSoon).toBe(false)
    expect(result.isExpired).toBe(false)
  })
})
