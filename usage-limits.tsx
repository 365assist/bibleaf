"use client"

import { useState, useEffect } from "react"

interface UsageLimitsProps {
  userId: string
  subscriptionTier: string
}

export default function UsageLimits({ userId, subscriptionTier = "free" }: UsageLimitsProps) {
  const [usage, setUsage] = useState({
    searches: 0,
    guidance: 0,
    searchLimit: 5,
    guidanceLimit: 3,
    lastReset: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)

  // Get limits based on subscription tier
  const limits = (() => {
    switch (subscriptionTier) {
      case "premium":
      case "annual":
        return {
          searches: Number.POSITIVE_INFINITY,
          guidance: Number.POSITIVE_INFINITY,
        }
      case "basic":
        return {
          searches: 50,
          guidance: 25,
        }
      case "free":
      default:
        return {
          searches: 5,
          guidance: 5,
        }
    }
  })()

  // Fetch usage data
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/usage/track?userId=${userId}`)
        const data = await response.json()

        if (data.usage) {
          setUsage({
            searches: data.usage.searches || 0,
            guidance: data.usage.guidance || 0,
            searchLimit: data.usage.searchLimit || limits.searches,
            guidanceLimit: data.usage.guidanceLimit || limits.guidance,
            lastReset: new Date(),
          })
        }
      } catch (error) {
        console.error("Error fetching usage data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsage()

    // Refresh usage data every minute
    const interval = setInterval(fetchUsage, 60000)
    return () => clearInterval(interval)
  }, [userId, limits.searches, limits.guidance])

  // Format usage display
  const formatUsage = (used: number, limit: number) => {
    if (limit === Number.POSITIVE_INFINITY) {
      return "Unlimited"
    }
    return `${used} / ${limit}`
  }

  // Calculate percentage for progress bars
  const calculatePercentage = (used: number, limit: number) => {
    if (limit === Number.POSITIVE_INFINITY || limit === 0) return 0
    const percentage = (used / limit) * 100
    return Math.min(percentage, 100)
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Daily Usage</h3>

      {isLoading ? (
        <div className="py-4 text-center text-muted-foreground">Loading usage data...</div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Bible Searches</span>
              <span className="text-sm font-medium">{formatUsage(usage.searches, usage.searchLimit)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${calculatePercentage(usage.searches, usage.searchLimit)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Life Guidance Requests</span>
              <span className="text-sm font-medium">{formatUsage(usage.guidance, usage.guidanceLimit)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${calculatePercentage(usage.guidance, usage.guidanceLimit)}%`,
                }}
              />
            </div>
          </div>

          {subscriptionTier === "free" && (
            <div className="pt-3 text-sm">
              <p className="text-muted-foreground">You're on the Free plan with 5 daily searches.</p>
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="text-primary hover:text-primary/80 text-sm mt-1"
              >
                Upgrade for unlimited access →
              </button>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2">Usage limits reset daily at midnight UTC.</div>
        </div>
      )}
    </div>
  )
}
