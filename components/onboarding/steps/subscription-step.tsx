"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/lib/onboarding-context"
import { ArrowLeft, Check } from "lucide-react"

export default function SubscriptionStep() {
  const { setCurrentStep } = useOnboarding()

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Basic access to Bible study tools",
      features: [
        "5 AI searches per day",
        "Daily verse with basic insights",
        "Standard text-to-speech",
        "Basic guidance responses",
      ],
      buttonText: "Continue with Free",
      buttonVariant: "outline" as const,
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "per month",
      description: "Enhanced Bible study experience",
      features: [
        "Unlimited AI searches",
        "Advanced verse insights and commentary",
        "Premium voice options for text-to-speech",
        "In-depth spiritual guidance",
        "Original language word studies",
        "Cross-reference explorer",
      ],
      buttonText: "Try Premium",
      buttonVariant: "default" as const,
      highlight: true,
    },
    {
      name: "Annual",
      price: "$39.99",
      period: "per year",
      description: "Best value for dedicated study",
      features: [
        "All Premium features",
        "Save 33% compared to monthly",
        "Offline access to saved content",
        "Priority support",
      ],
      buttonText: "Choose Annual",
      buttonVariant: "outline" as const,
    },
  ]

  const handleSelectPlan = (plan: string) => {
    // In a real implementation, you might redirect to checkout or mark the selection
    // For now, we'll just continue to the completion step
    setCurrentStep("complete")
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Select the plan that best fits your spiritual journey</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${
                plan.highlight ? "border-amber-500 shadow-lg shadow-amber-100 dark:shadow-amber-900/20" : ""
              }`}
            >
              {plan.highlight && (
                <div className="bg-amber-500 text-white text-center py-1 text-sm font-medium">MOST POPULAR</div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-baseline">
                  <span>{plan.name}</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.highlight
                      ? "bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white"
                      : ""
                  }`}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can always upgrade or change your plan later from your account settings.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep("features")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => setCurrentStep("complete")}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
