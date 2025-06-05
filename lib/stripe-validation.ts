import { SUBSCRIPTION_PLANS } from "./stripe-config"

export interface StripeValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  debug?: any
}

export function validateStripeConfiguration(): StripeValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const debug: any = {}

  // Debug: Show what we can access
  debug.serverSide = typeof window === "undefined"
  debug.stripeSecretKeyExists = !!process.env.STRIPE_SECRET_KEY
  debug.stripeSecretKeyPrefix = process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.substring(0, 8) + "..."
    : "not found"
  debug.allStripeVars = Object.keys(process.env).filter((key) => key.includes("STRIPE"))
  debug.processEnvKeys = Object.keys(process.env)
    .filter((key) => key.startsWith("STRIPE"))
    .sort()

  // Check environment variables
  if (typeof window === "undefined") {
    // Server-side checks
    console.log("=== Stripe Validation Debug ===")
    console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY)
    console.log(
      "STRIPE_SECRET_KEY value:",
      process.env.STRIPE_SECRET_KEY ? "***" + process.env.STRIPE_SECRET_KEY.slice(-4) : "undefined",
    )
    console.log(
      "All STRIPE env vars:",
      Object.keys(process.env).filter((key) => key.includes("STRIPE")),
    )

    if (!process.env.STRIPE_SECRET_KEY) {
      errors.push("STRIPE_SECRET_KEY environment variable is missing")
    } else if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
      errors.push("STRIPE_SECRET_KEY must start with 'sk_'")
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      errors.push("STRIPE_WEBHOOK_SECRET environment variable is missing")
    } else if (!process.env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")) {
      errors.push("STRIPE_WEBHOOK_SECRET must start with 'whsec_'")
    }
  }

  // Client-side checks
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing")
  } else if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
    errors.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'")
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    errors.push("NEXT_PUBLIC_APP_URL environment variable is missing")
  }

  // Check subscription plans
  if (SUBSCRIPTION_PLANS.length === 0) {
    errors.push("No subscription plans configured")
  }

  for (const plan of SUBSCRIPTION_PLANS) {
    if (!plan.stripePriceId) {
      errors.push(`Plan '${plan.id}' is missing stripePriceId`)
    } else if (!plan.stripePriceId.startsWith("price_")) {
      errors.push(`Plan '${plan.id}' has invalid stripePriceId format (must start with 'price_')`)
    }

    if (plan.price <= 0 && plan.id !== "free") {
      warnings.push(`Plan '${plan.id}' has zero or negative price`)
    }
  }

  // Check for test vs live key consistency
  if (typeof window === "undefined") {
    if (process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      const secretIsTest = process.env.STRIPE_SECRET_KEY.includes("test")
      const publishableIsTest = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("test")

      if (secretIsTest !== publishableIsTest) {
        errors.push("Stripe secret key and publishable key environment mismatch (test vs live)")
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    debug,
  }
}

export async function testStripeConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      return { success: false, error: "Stripe connection test must run on server" }
    }

    const { stripe } = await import("./stripe-server")
    if (!stripe) {
      return { success: false, error: "Stripe not initialized" }
    }

    // Test connection by retrieving account info
    await stripe.accounts.retrieve()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
