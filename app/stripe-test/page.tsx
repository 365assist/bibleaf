"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, CreditCard, AlertCircle } from "lucide-react"
import { stripeConfig, SUBSCRIPTION_PLANS } from "@/lib/stripe-config"
import { clientEnv } from "@/lib/env-client"

export default function StripeTestPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true)
    try {
      const result = await testFn()
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: true, data: result },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: { success: false, error: error.message },
      }))
    }
    setIsLoading(false)
  }

  const testStripeConfig = async () => {
    return {
      clientSide: {
        publishableKey: clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        publishableKeyExists: !!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        publishableKeyPrefix: clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 12) + "...",
      },
      stripeConfig: {
        isConfigured: stripeConfig.isConfigured,
        hasPublishableKey: !!stripeConfig.publishableKey,
      },
    }
  }

  const testSystemStatus = async () => {
    const response = await fetch("/api/system/status")
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  }

  const testCreateCheckout = async () => {
    try {
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_test_demo",
          userId: "test-user-123",
        }),
      })

      const responseText = await response.text()
      console.log("Response status:", response.status)
      console.log("Response text:", responseText)

      if (!response.ok) {
        let errorDetails = responseText
        try {
          const errorJson = JSON.parse(responseText)
          errorDetails = errorJson.error || errorJson.details || responseText
        } catch {
          // Keep original response text if not JSON
        }
        throw new Error(`HTTP ${response.status}: ${errorDetails}`)
      }

      try {
        return JSON.parse(responseText)
      } catch {
        return { rawResponse: responseText }
      }
    } catch (error) {
      console.error("Test checkout error:", error)
      throw error
    }
  }

  const TestResult = ({ testName, result }: { testName: string; result: any }) => (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        {result?.success ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : (
          <XCircle className="text-red-500" size={20} />
        )}
        <h3 className="font-medium">{testName}</h3>
        <Badge variant={result?.success ? "default" : "destructive"}>{result?.success ? "PASS" : "FAIL"}</Badge>
      </div>

      {result?.success ? (
        <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      ) : (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {result?.error}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 p-4">
      <div className="container max-w-4xl mx-auto space-y-6">
        <Card className="divine-light-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="text-amber-600" />
              Stripe Integration Test Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => runTest("Environment Variables", testStripeConfig)}
                disabled={isLoading}
                className="w-full"
              >
                Test Environment Variables
              </Button>

              <Button
                onClick={() => runTest("System Status", testSystemStatus)}
                disabled={isLoading}
                className="w-full"
              >
                Test System Status
              </Button>

              <Button
                onClick={() => runTest("Create Checkout Session", testCreateCheckout)}
                disabled={isLoading}
                className="w-full"
              >
                Test Checkout API
              </Button>

              <Button
                onClick={async () => {
                  const plan = SUBSCRIPTION_PLANS[0]
                  const demoUrl = `/payment/demo?plan=${plan.id}&amount=${plan.price}`
                  window.open(demoUrl, "_blank")
                }}
                className="w-full"
              >
                Test Demo Payment
              </Button>
            </div>

            <Button
              onClick={async () => {
                setTestResults({})
                await runTest("Environment Variables", testStripeConfig)
                await runTest("System Status", testSystemStatus)
              }}
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? "Running Tests..." : "Run All Tests"}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <TestResult key={testName} testName={testName} result={result} />
          ))}
        </div>

        {/* Environment Debug Info */}
        <Card className="divine-light-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="text-amber-600" />
              Environment Debug Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Client-Side Environment Variables:</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="flex justify-between">
                    <span>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</span>
                    <Badge variant={clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                      {clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Missing"}
                    </Badge>
                  </div>
                  {clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                    <div className="text-xs text-gray-600 mt-1">
                      {clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Stripe Configuration Status:</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="flex justify-between">
                    <span>Stripe Configured:</span>
                    <Badge variant={stripeConfig.isConfigured ? "default" : "destructive"}>
                      {stripeConfig.isConfigured ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
