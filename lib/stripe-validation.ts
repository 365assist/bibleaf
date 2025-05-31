// Helper to validate Stripe configuration
export function validateStripeConfig() {
  const issues: string[] = []

  if (!process.env.STRIPE_SECRET_KEY) {
    issues.push("STRIPE_SECRET_KEY environment variable is missing")
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    issues.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing")
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    issues.push("STRIPE_WEBHOOK_SECRET environment variable is missing")
  }

  // Check if price IDs are still placeholder values
  const { SUBSCRIPTION_PLANS } = require("./stripe-config")

  SUBSCRIPTION_PLANS.forEach((plan: any) => {
    if (!plan.stripePriceId || plan.stripePriceId.includes("YOUR_") || plan.stripePriceId.startsWith("price_test_")) {
      issues.push(`${plan.name} plan needs a real Stripe price ID`)
    }
  })

  return {
    isValid: issues.length === 0,
    issues,
  }
}

export function logStripeStatus() {
  const validation = validateStripeConfig()

  if (validation.isValid) {
    console.log("✅ Stripe configuration is valid")
  } else {
    console.log("❌ Stripe configuration issues:")
    validation.issues.forEach((issue) => console.log(`  - ${issue}`))
  }

  return validation
}
