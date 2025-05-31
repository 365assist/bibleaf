"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, CreditCard, AlertTriangle, Loader2 } from "lucide-react"
import { SUBSCRIPTION_PLANS, formatPrice } from "@/lib/stripe-config"
import { redirectToCheckout } from "@/lib/stripe-client"
import { isStripeConfiguredClient } from "@/lib/env-client"

interface TestResult {
  planId: string
  success: boolean
  error?: string
  sessionId?: string
  timestamp: Date
  responseStatus?: number
  responseText?: string
}

export default function TestCheckoutPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const testCheckoutFlow = async (planId: string) => {
    setIsLoading(planId)

    try {
      if (!isStripeConfiguredClient) {
        throw new Error("Stripe is not configured properly")
      }

      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
      if (!plan) {
        throw new Error(`Plan ${planId} not found`)
      }

      console.log(`Testing checkout for ${plan.name} (${plan.stripePriceId})`)

      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: planId,
          userId: `test-user-${Date.now()}`,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
          cancelUrl: `${window.location.origin}/payment/cancel?plan=${planId}`,
        }),
      })

      // Get response text first to handle both JSON and HTML responses
      const responseText = await response.text()

      if (!response.ok) {
        // Try to parse as JSON first, fall back to text
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // If not JSON, use the text response (likely HTML error page)
          errorMessage = `${errorMessage}: ${responseText.substring(0, 200)}...`
        }
        throw new Error(errorMessage)
      }

      // Parse successful response
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
      }

      if (!data.sessionId) {
        throw new Error("No session ID returned from checkout creation")
      }

      // Record successful test
      const testResult: TestResult = {
        planId,
        success: true,
        sessionId: data.sessionId,
        timestamp: new Date(),
        responseStatus: response.status,
      }

      setTestResults((prev) => [testResult, ...prev.filter((r) => r.planId !== planId)])

      // Redirect to Stripe Checkout
      console.log(`Redirecting to Stripe Checkout with session: ${data.sessionId}`)
      await redirectToCheckout(data.sessionId)
    } catch (error) {
      console.error(`Checkout test failed for ${planId}:`, error)

      const testResult: TestResult = {
        planId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      }

      setTestResults((prev) => [testResult, ...prev.filter((r) => r.planId !== planId)])
    } finally {
      setIsLoading(null)
    }
  }

  const getTestResult = (planId: string) => {
    return testResults.find((r) => r.planId === planId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 p-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="divine-light-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="text-amber-600" />
              Subscription Checkout Flow Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Test the checkout flow for all subscription tiers. Each test will create a Stripe checkout session and
                redirect you to the payment page.
              </p>

              {!isStripeConfiguredClient && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="text-red-800 dark:text-red-200">
                    Stripe is not configured properly. Check your environment variables.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertTriangle className="text-blue-600" size={20} />
                <span className="text-blue-800 dark:text-blue-200">
                  <strong>Test Mode:</strong> Use test card number 4242 4242 4242 4242 with any future expiry date and
                  any CVC.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="divine-light-card">
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Stripe Client Configured:</strong> {isStripeConfiguredClient ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>App URL:</strong> {typeof window !== "undefined" ? window.location.origin : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const testResult = getTestResult(plan.id)
            const isCurrentlyLoading = isLoading === plan.id

            return (
              <Card key={plan.id} className={`divine-light-card ${plan.popular ? "ring-2 ring-amber-400" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.popular && <Badge className="bg-amber-500 text-white">Most Popular</Badge>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{formatPrice(plan.price)}</p>
                    <p className="text-sm text-muted-foreground">per {plan.interval}</p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <ul className="space-y-1 text-sm">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-0.5" size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-muted-foreground">+{plan.features.length - 4} more features</li>
                    )}
                  </ul>

                  {/* Stripe Price ID */}
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                    <strong>Price ID:</strong> {plan.stripePriceId}
                  </div>

                  {/* Test Result */}
                  {testResult && (
                    <div
                      className={`p-3 rounded-lg border ${
                        testResult.success
                          ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {testResult.success ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <XCircle className="text-red-600" size={16} />
                        )}
                        <span className="text-sm font-medium">
                          {testResult.success ? "Test Passed" : "Test Failed"}
                        </span>
                      </div>

                      {testResult.success && testResult.sessionId && (
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Session: {testResult.sessionId.substring(0, 20)}...
                        </p>
                      )}

                      {testResult.error && (
                        <div className="text-xs text-red-700 dark:text-red-300">
                          <p>
                            <strong>Error:</strong>
                          </p>
                          <p className="mt-1 font-mono bg-red-100 dark:bg-red-900/50 p-2 rounded">{testResult.error}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">{testResult.timestamp.toLocaleTimeString()}</p>
                    </div>
                  )}

                  {/* Test Button */}
                  <Button
                    onClick={() => testCheckoutFlow(plan.id)}
                    disabled={isCurrentlyLoading || !isStripeConfiguredClient}
                    className="w-full"
                  >
                    {isCurrentlyLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Session...
                      </>
                    ) : (
                      `Test ${plan.name} Checkout`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <Card className="divine-light-card">
            <CardHeader>
              <CardTitle>Test Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => {
                  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === result.planId)
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        <div>
                          <p className="font-medium">{plan?.name}</p>
                          <p className="text-sm text-muted-foreground">{result.timestamp.toLocaleString()}</p>
                          {result.error && (
                            <p className="text-xs text-red-600 mt-1 font-mono">{result.error.substring(0, 100)}...</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "PASS" : "FAIL"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
