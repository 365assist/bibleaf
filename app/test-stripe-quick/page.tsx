"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Loader2, Play, CreditCard } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: any
}

export default function QuickStripeTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Environment Variables", status: "pending", message: "" },
    { name: "Stripe Configuration", status: "pending", message: "" },
    { name: "Stripe Connection", status: "pending", message: "" },
    { name: "Price ID Validation", status: "pending", message: "" },
    { name: "Checkout Session Creation", status: "pending", message: "" },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const updateTest = (index: number, status: TestResult["status"], message: string, details?: any) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message, details } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)
    setCheckoutUrl(null)

    // Test 1: Environment Variables
    try {
      const response = await fetch("/api/debug/env")
      const data = await response.json()

      const hasStripeKey = data.STRIPE_SECRET_KEY === "exists"
      const hasWebhookSecret = data.STRIPE_WEBHOOK_SECRET === "exists"
      const hasPublishableKey = !!data.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

      if (hasStripeKey && hasWebhookSecret && hasPublishableKey) {
        updateTest(0, "success", "All Stripe environment variables found", data)
      } else {
        const missing = []
        if (!hasStripeKey) missing.push("STRIPE_SECRET_KEY")
        if (!hasWebhookSecret) missing.push("STRIPE_WEBHOOK_SECRET")
        if (!hasPublishableKey) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
        updateTest(0, "error", `Missing: ${missing.join(", ")}`, data)
      }
    } catch (error) {
      updateTest(0, "error", `Environment check failed: ${error}`)
    }

    // Test 2: Stripe Configuration
    try {
      const response = await fetch("/api/stripe/validate")
      const data = await response.json()

      if (data.configuration?.isValid) {
        updateTest(1, "success", "Stripe configuration is valid", data.configuration)
      } else {
        updateTest(
          1,
          "error",
          `Configuration errors: ${data.configuration?.errors?.join(", ") || "Unknown"}`,
          data.configuration,
        )
      }
    } catch (error) {
      updateTest(1, "error", `Configuration check failed: ${error}`)
    }

    // Test 3: Stripe Connection
    try {
      const response = await fetch("/api/stripe/test-connection")
      const data = await response.json()

      if (data.connection?.success) {
        updateTest(2, "success", "Stripe connection successful", data.connection)
      } else {
        updateTest(2, "error", `Connection failed: ${data.connection?.error || "Unknown"}`, data.connection)
      }
    } catch (error) {
      updateTest(2, "error", `Connection test failed: ${error}`)
    }

    // Test 4: Price ID Validation
    try {
      const response = await fetch("/api/stripe/test-connection")
      const data = await response.json()

      if (data.priceTest?.success) {
        updateTest(
          3,
          "success",
          `Price ID valid: ${data.priceTest.priceId} ($${(data.priceTest.amount / 100).toFixed(2)})`,
          data.priceTest,
        )
      } else {
        updateTest(3, "error", `Price validation failed: ${data.priceTest?.error || "Unknown"}`, data.priceTest)
      }
    } catch (error) {
      updateTest(3, "error", `Price validation failed: ${error}`)
    }

    // Test 5: Checkout Session Creation
    try {
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "basic",
          userId: "test-user-" + Date.now(),
          successUrl: window.location.origin + "/payment/success",
          cancelUrl: window.location.origin + "/payment/cancel",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          updateTest(4, "success", "Checkout session created successfully", data)
          setCheckoutUrl(data.url)
        } else {
          updateTest(4, "error", "No checkout URL returned", data)
        }
      } else {
        const errorData = await response.json()
        updateTest(4, "error", `Checkout creation failed: ${errorData.error || response.statusText}`, errorData)
      }
    } catch (error) {
      updateTest(4, "error", `Checkout creation failed: ${error}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "pending":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }

  const allPassed = tests.every((test) => test.status === "success")
  const anyFailed = tests.some((test) => test.status === "error")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 font-bold text-3xl mb-4">
            <span className="text-amber-600">Bible</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
              AF
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Quick Stripe Integration Test</h1>
          <p className="text-gray-600 dark:text-gray-400">Testing Stripe configuration and payment processing</p>
        </div>

        {/* Test Controls */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Stripe Tests</h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              {isRunning ? "Running Tests..." : "Run Stripe Tests"}
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={test.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium text-gray-800 dark:text-gray-200">{test.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{test.message}</span>
              </div>
            ))}
          </div>

          {/* Results Summary */}
          {!isRunning && tests.some((t) => t.status !== "pending") && (
            <div className="mt-6 p-4 rounded-lg">
              {allPassed ? (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle size={20} />
                    <span className="font-medium">🎉 All Stripe tests passed!</span>
                  </div>
                  <p className="text-green-700 dark:text-green-300 mt-2">
                    Your Stripe integration is fully configured and ready for production.
                  </p>
                </div>
              ) : anyFailed ? (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <XCircle size={20} />
                    <span className="font-medium">❌ Some tests failed</span>
                  </div>
                  <p className="text-red-700 dark:text-red-300 mt-2">
                    Please review the failed tests and fix the issues before proceeding.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle size={20} />
                    <span className="font-medium">⚠️ Tests in progress</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Checkout Button */}
          {checkoutUrl && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">Test Checkout Session Created!</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Click the button to test the actual payment flow
                  </p>
                </div>
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CreditCard size={16} />
                  Test Payment
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Next Steps</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>1. ✅ Run the Stripe tests above</p>
            <p>2. 🧪 Test the checkout flow if all tests pass</p>
            <p>
              3. 🚀 Run the comprehensive test suite at <code>/test-comprehensive</code>
            </p>
            <p>4. 🌐 Deploy to production when all tests pass</p>
          </div>
        </div>
      </div>
    </div>
  )
}
