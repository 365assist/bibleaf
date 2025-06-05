"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tests = [
  {
    name: "Create Payment Intent",
    endpoint: "/api/test-stripe/payment-intent",
    method: "POST",
  },
  {
    name: "Create Customer",
    endpoint: "/api/test-stripe/customer",
    method: "POST",
  },
  {
    name: "Create Subscription",
    endpoint: "/api/test-stripe/subscription",
    method: "POST",
  },
  {
    name: "Create Checkout Session",
    endpoint: "/api/test-stripe/checkout-session",
    method: "POST",
  },
]

export default function StripeTestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Add this new section after the existing tests array initialization
  const [envStatus, setEnvStatus] = useState<any>(null)

  // Add this new function before runTests
  const checkEnvironmentStatus = async () => {
    try {
      const response = await fetch("/api/debug/env")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      setEnvStatus({ error: "Failed to check environment" })
    }
  }

  // Add this useEffect after the existing state declarations
  useEffect(() => {
    checkEnvironmentStatus()
  }, [])

  const runTests = async () => {
    setLoading(true)
    const newResults: any = {}
    for (const test of tests) {
      try {
        const res = await fetch(test.endpoint, { method: test.method })
        const data = await res.json()
        newResults[test.name] = data
      } catch (error: any) {
        newResults[test.name] = { error: error.message }
      }
    }
    setResults(newResults)
    setLoading(false)
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Stripe Quick Tests</h1>

      {/* Environment Status */}
      {envStatus && (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Current Environment Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Stripe Secret Key</span>
                <Badge variant={envStatus.STRIPE_SECRET_KEY === "exists" ? "default" : "destructive"}>
                  {envStatus.STRIPE_SECRET_KEY === "exists" ? "✓ Set" : "✗ Missing"}
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Webhook Secret</span>
                <Badge variant={envStatus.STRIPE_WEBHOOK_SECRET === "exists" ? "default" : "destructive"}>
                  {envStatus.STRIPE_WEBHOOK_SECRET === "exists" ? "✓ Set" : "✗ Missing"}
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Publishable Key</span>
                <Badge variant={envStatus.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                  {envStatus.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✓ Set" : "✗ Missing"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
        <Button onClick={runTests} disabled={loading}>
          {loading ? "Running Tests..." : "Run Tests"}
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
        {tests.map((test) => (
          <div key={test.name} className="mb-4">
            <h3 className="text-xl font-medium">{test.name}</h3>
            {results[test.name] ? (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(results[test.name], null, 2)}
              </pre>
            ) : (
              <p>No result yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
