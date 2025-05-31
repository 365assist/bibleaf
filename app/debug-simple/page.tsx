"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SimpleDebugPage() {
  const [healthCheck, setHealthCheck] = useState<any>(null)
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [debugCheck, setDebugCheck] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runHealthCheck = async () => {
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthCheck({ status: response.status, data })
    } catch (error) {
      setHealthCheck({ status: "error", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const runEnvCheck = async () => {
    try {
      const response = await fetch("/api/env-check")
      const data = await response.json()
      setEnvCheck({ status: response.status, data })
    } catch (error) {
      setEnvCheck({ status: "error", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const runDebugCheck = async () => {
    try {
      const response = await fetch("/api/system/debug")
      const data = await response.json()
      setDebugCheck({ status: response.status, data })
    } catch (error) {
      setDebugCheck({ status: "error", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  const runAllChecks = async () => {
    setLoading(true)
    await Promise.all([runHealthCheck(), runEnvCheck(), runDebugCheck()])
    setLoading(false)
  }

  useEffect(() => {
    runAllChecks()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Simple Debug Dashboard</h1>
        <Button onClick={runAllChecks} disabled={loading}>
          {loading ? "Running Checks..." : "Refresh All Checks"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API Health Check
              {healthCheck?.status === 200 ? "✅" : healthCheck?.status === "error" ? "❌" : "⏳"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runHealthCheck} size="sm" className="mb-4">
              Test Health
            </Button>
            {healthCheck && (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(healthCheck, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Environment Variables
              {envCheck?.status === 200 ? "✅" : envCheck?.status === "error" ? "❌" : "⏳"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runEnvCheck} size="sm" className="mb-4">
              Check Environment
            </Button>
            {envCheck && (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(envCheck, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Debug Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Full Debug Info
              {debugCheck?.status === 200 ? "✅" : debugCheck?.status === "error" ? "❌" : "⏳"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runDebugCheck} size="sm" className="mb-4">
              Run Debug
            </Button>
            {debugCheck && (
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(debugCheck, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Environment Summary */}
      {envCheck?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span>Stripe Secret Key:</span>
                <span className={envCheck.data.variables.STRIPE_SECRET_KEY.exists ? "text-green-600" : "text-red-600"}>
                  {envCheck.data.variables.STRIPE_SECRET_KEY.exists ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stripe Publishable Key:</span>
                <span
                  className={
                    envCheck.data.variables.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.exists
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {envCheck.data.variables.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.exists ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>App URL:</span>
                <span
                  className={envCheck.data.variables.NEXT_PUBLIC_APP_URL.exists ? "text-green-600" : "text-red-600"}
                >
                  {envCheck.data.variables.NEXT_PUBLIC_APP_URL.exists ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
