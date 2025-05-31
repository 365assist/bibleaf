"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react"
import { formatPrice, getPlanById } from "@/lib/stripe-config"

export default function DemoPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const planId = searchParams.get("plan")
  const amount = searchParams.get("amount")

  const plan = planId ? getPlanById(planId) : null

  const handleDemoPayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsComplete(true)

    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push("/dashboard?subscription=success")
    }, 2000)
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Payment Link</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto text-green-500" size={64} />
          <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-muted-foreground">Welcome to {plan.name}! Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-md mx-auto">
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Demo Payment</h1>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{plan.name} Plan</span>
                <span className="font-bold">{formatPrice(plan.price)}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                Billed {plan.interval === "month" ? "monthly" : "annually"}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(plan.price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">What you'll get:</h3>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={handleDemoPayment}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Complete Demo Payment
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            In production, this would redirect to Stripe Checkout for secure payment processing.
          </p>
        </div>
      </div>
    </div>
  )
}
