"use client"

import { useState } from "react"
import { SUBSCRIPTION_PLANS, FREE_TIER, formatPrice, type SubscriptionPlan } from "@/lib/stripe-config"
import { isStripeConfiguredClient } from "@/lib/env-client"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  userId: string
}

export default function SubscriptionModal({ isOpen, onClose, currentPlan, userId }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  if (!isOpen) return null

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setIsLoading(true)
      setSelectedPlan(plan)

      if (!isStripeConfiguredClient) {
        alert("Payment system is not configured. Please contact support.")
        return
      }

      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id, // Use plan.id instead of plan.stripePriceId
          userId: userId,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/dashboard?subscription=canceled`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        // Redirect to Stripe Checkout using the URL
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert(`Failed to process subscription: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
            ✕
          </button>
        </div>

        {!isStripeConfiguredClient && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Payment System Not Configured:</strong> Stripe integration is not set up. Please contact support.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Free Tier */}
          <div
            className={`border rounded-lg p-6 ${currentPlan === "free" ? "border-primary ring-1 ring-primary" : ""}`}
          >
            <h3 className="text-xl font-semibold mb-2">{FREE_TIER.name}</h3>
            <p className="text-muted-foreground mb-4">{FREE_TIER.description}</p>
            <p className="text-2xl font-bold mb-4">Free</p>

            <ul className="space-y-2 mb-6">
              {FREE_TIER.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={currentPlan === "free"}
              className="w-full py-2 px-4 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
            >
              {currentPlan === "free" ? "Current Plan" : "Downgrade"}
            </button>
          </div>

          {/* Paid Plans */}
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${plan.popular ? "border-primary ring-1 ring-primary relative" : ""} ${currentPlan === plan.id ? "border-primary" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <p className="text-2xl font-bold mb-1">{formatPrice(plan.price)}</p>
              <p className="text-sm text-muted-foreground mb-4">per {plan.interval}</p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || currentPlan === plan.id || !isStripeConfiguredClient}
                className={`w-full py-2 px-4 rounded-md ${
                  currentPlan === plan.id
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                } disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isLoading && selectedPlan?.id === plan.id && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                )}
                {isLoading && selectedPlan?.id === plan.id ? "Processing..." : ""}
                {!isLoading && currentPlan === plan.id ? "Current Plan" : ""}
                {!isLoading && currentPlan !== plan.id ? "Subscribe" : ""}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Secure payment processing by Stripe</p>
          <p className="mt-1">Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  )
}
