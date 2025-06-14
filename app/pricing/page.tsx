"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap, AlertCircle } from "lucide-react"
import SubscriptionModal from "@/components/subscription/subscription-modal"
import { useState, useEffect } from "react"
import { SEOHead } from "@/components/seo-head"

// Updated pricing plans with correct data
const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    popular: false,
    features: [
      "Daily verse with basic insights",
      "Up to 3 AI searches per day",
      "Basic community forum access",
      "Save up to 10 verses",
      "Full Bible reading access",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 999, // $9.99 in cents
    interval: "month",
    popular: true,
    features: [
      "Unlimited AI verse searches",
      "Daily devotionals with deep insights",
      "Save unlimited verses",
      "Text-to-speech for all content",
      "Community Q&A access",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1999, // $19.99 in cents
    interval: "month",
    popular: false,
    features: [
      "Everything in Basic",
      "1:1 AI spiritual coaching",
      "Advanced Bible study tools",
      "Offline downloads",
      "Commentary access",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    id: "annual",
    name: "Annual Premium",
    price: 12500, // $125 per year ($10.42/month)
    interval: "year",
    popular: false,
    features: [
      "Everything in Premium",
      "2 months free (best value)",
      "Annual spiritual growth report",
      "Exclusive webinars",
      "Direct line to development team",
    ],
  },
]

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [stripeAvailable, setStripeAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if Stripe is available
    fetch("/api/system/status")
      .then((res) => res.json())
      .then((data) => {
        setStripeAvailable(data.services?.stripe || false)
      })
      .catch(() => {
        setStripeAvailable(false)
      })
  }, [])

  const handleSelectPlan = (planId: string) => {
    if (stripeAvailable === false) {
      alert("Payment processing is currently unavailable. Please try again later or contact support.")
      return
    }
    setSelectedPlan(planId)
  }

  const formatPlanPrice = (price: number, interval: string) => {
    if (price === 0) return "Free"
    const dollars = price / 100
    return `$${dollars.toFixed(2)}/${interval === "year" ? "year" : "mo"}`
  }

  return (
    <>
      <SEOHead
        title="BibleAF Pricing – Plans & Features"
        description="Compare BibleAF's Free, Basic, and Premium plans. Start exploring Scripture with AI-driven insights today. Choose the plan that fits your spiritual journey."
        canonical="/pricing"
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Choose Your Spiritual Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Unlock the full power of AI-enhanced Bible study</p>

            {/* Stripe Status Warning */}
            {stripeAvailable === false && (
              <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle size={20} />
                  <span>Payment processing is temporarily unavailable. You can still use the free tier!</span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                <Star size={16} className="mr-2" />
                Most Popular: Basic Plan
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "ring-2 ring-purple-500 scale-105" : ""} divine-light-card hover:shadow-2xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Crown size={14} className="mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{formatPlanPrice(plan.price, plan.interval)}</span>
                    {plan.interval === "year" && plan.price > 0 && (
                      <div className="mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <Zap size={12} className="mr-1" />${(plan.price / 100 / 12).toFixed(2)}/month
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : ""}`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={stripeAvailable === false && plan.price > 0}
                  >
                    {plan.price === 0 ? "Get Started Free" : stripeAvailable === false ? "Unavailable" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Free Tier Promotion */}
          <Card className="divine-light-card mb-16">
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Start with Our Free Tier!</h2>
              <p className="text-muted-foreground mb-6">Experience BibleAF with our generous free features:</p>
              <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Daily verse with insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>3 AI-powered searches per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Save up to 10 verses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Full Bible reading access</span>
                </li>
              </ul>
              <Button asChild className="divine-button">
                <a href="/auth/signup">Get Started Free</a>
              </Button>
            </CardContent>
          </Card>

          {/* Features Comparison */}
          <Card className="divine-light-card">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Basic</th>
                      <th className="text-center py-3 px-4">Premium</th>
                      <th className="text-center py-3 px-4">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">AI Bible Search</td>
                      <td className="text-center py-3 px-4">3/day</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Saved Verses</td>
                      <td className="text-center py-3 px-4">10</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Text-to-Speech</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">AI Coaching</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Commentary Access</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Priority Support</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✗</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Modal */}
          {selectedPlan && stripeAvailable && (
            <SubscriptionModal
              isOpen={!!selectedPlan}
              onClose={() => setSelectedPlan(null)}
              currentPlan="free"
              userId="guest"
            />
          )}
        </div>
      </div>
    </>
  )
}
