"use client"

import type React from "react"
import { useState } from "react"

interface SubscriptionModalProps {
  userId: string
  onClose: () => void
}

type SubscriptionPlan = {
  id: string
  name: string
  interval: string
  stripePriceId: string
}

const isStripeConfiguredClient = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? true : false

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ userId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setIsLoading(true)
      setSelectedPlan(plan)

      console.log("Starting subscription for plan:", {
        id: plan.id,
        name: plan.name,
        interval: plan.interval,
        stripePriceId: plan.stripePriceId,
      })

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
          planId: plan.id, // This should be "annual" for the annual plan
          userId: userId,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      })

      const data = await response.json()
      console.log("Checkout response:", data)

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create checkout session")
      }

      if (data.url) {
        console.log("Redirecting to Stripe checkout:", data.url)
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

  const monthlyPlan: SubscriptionPlan = {
    id: "monthly",
    name: "Monthly",
    interval: "month",
    stripePriceId: "price_123", // Replace with your actual Stripe price ID
  }

  const annualPlan: SubscriptionPlan = {
    id: "annual",
    name: "Annual",
    interval: "year",
    stripePriceId: "price_456", // Replace with your actual Stripe price ID
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Choose a Subscription Plan</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">Select the plan that best suits your needs.</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => handleSubscribe(monthlyPlan)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Subscribe Monthly"}
            </button>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => handleSubscribe(annualPlan)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Subscribe Annually"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
