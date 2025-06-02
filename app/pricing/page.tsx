"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap, AlertCircle } from "lucide-react"
import { SUBSCRIPTION_PLANS, formatPrice, getAnnualSavings } from "@/lib/stripe-config"
import SubscriptionModal from "@/components/subscription/subscription-modal"
import { useState, useEffect } from "react"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [stripeAvailable, setStripeAvailable] = useState<boolean | null>(null)
  const annualSavings = getAnnualSavings()

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

  return (
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
              Most Popular: Premium Plan
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SUBSCRIPTION_PLANS.map((plan) => (
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
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                {plan.interval === "year" && (
                  <div className="mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <Zap size={12} className="mr-1" />
                      {formatPrice(plan.price / 12)}/month
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : ""}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={stripeAvailable === false}
                >
                  {stripeAvailable === false ? "Unavailable" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Tier Promotion */}
        <Card className="divine-light-card mb-16">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Start with Our Free Tier!</h3>
            <p className="text-muted-foreground mb-6">Experience BibleAF with our generous free features:</p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>5 AI-powered searches per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>3 Life guidance requests per day</span>
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
              <a href="/auth/login">Get Started Free</a>
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
                    <td className="text-center py-3 px-4">5/day</td>
                    <td className="text-center py-3 px-4">50/day</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Life Guidance</td>
                    <td className="text-center py-3 px-4">3/day</td>
                    <td className="text-center py-3 px-4">25/day</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Saved Verses</td>
                    <td className="text-center py-3 px-4">10</td>
                    <td className="text-center py-3 px-4">500</td>
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
                    <td className="py-3 px-4">Commentary Access</td>
                    <td className="text-center py-3 px-4">✗</td>
                    <td className="text-center py-3 px-4">✗</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Monthly Cost</td>
                    <td className="text-center py-3 px-4">Free</td>
                    <td className="text-center py-3 px-4">$4.99</td>
                    <td className="text-center py-3 px-4">$9.99</td>
                    <td className="text-center py-3 px-4">$10.00</td>
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
  )
}
