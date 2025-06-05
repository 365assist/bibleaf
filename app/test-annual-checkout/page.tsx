"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAnnualCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testAnnualCheckout = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log("Testing annual checkout...")

      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "annual",
          userId: "test-user-annual",
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      })

      const data = await response.json()
      console.log("Response:", data)

      setResult({
        success: response.ok,
        status: response.status,
        data: data,
      })

      if (response.ok && data.url) {
        // Don't redirect automatically, just show the URL
        console.log("Checkout URL:", data.url)
      }
    } catch (error) {
      console.error("Error:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Annual Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAnnualCheckout} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Annual Plan Checkout"}
          </Button>

          {result && (
            <div className="mt-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>

              {result.success && result.data?.url && (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold">✅ Checkout URL generated successfully!</p>
                  <Button onClick={() => window.open(result.data.url, "_blank")} className="mt-2">
                    Open Checkout in New Tab
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>
              <strong>Expected Price ID:</strong> price_1RUrlCBiT317Uae5W9CKifrf
            </p>
            <p>
              <strong>Plan ID:</strong> annual
            </p>
            <p>
              <strong>Amount:</strong> $99.99/year
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
