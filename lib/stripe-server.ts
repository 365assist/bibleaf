import Stripe from "stripe"
import { serverEnv } from "./env-server"
import { SUBSCRIPTION_PLANS } from "./stripe-config"

// Initialize Stripe with better error handling
let stripe: Stripe | null = null

try {
  if (!serverEnv.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set")
  } else if (!serverEnv.STRIPE_SECRET_KEY.startsWith("sk_")) {
    console.error("STRIPE_SECRET_KEY appears to be invalid (should start with 'sk_')")
    console.error("Current key starts with:", serverEnv.STRIPE_SECRET_KEY.substring(0, 10))
  } else {
    stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
    console.log("Stripe initialized successfully with key:", serverEnv.STRIPE_SECRET_KEY.substring(0, 7) + "...")
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error)
}

// Helper function to create a checkout session
export async function createCheckoutSession({
  planId,
  userId,
  successUrl,
  cancelUrl,
}: {
  planId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  console.log("=== Creating Stripe Checkout Session ===")

  try {
    // Check if Stripe is initialized
    if (!stripe) {
      throw new Error("Stripe is not properly configured. Check your STRIPE_SECRET_KEY environment variable.")
    }

    // Get the plan configuration
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
    if (!plan) {
      throw new Error(`Plan not found: ${planId}. Available plans: ${SUBSCRIPTION_PLANS.map((p) => p.id).join(", ")}`)
    }

    if (!plan.stripePriceId) {
      throw new Error(`Plan ${planId} does not have a Stripe price ID configured`)
    }

    console.log(`Creating checkout session for plan: ${plan.name} (${plan.stripePriceId})`)

    // Validate the price ID format
    if (!plan.stripePriceId.startsWith("price_")) {
      throw new Error(`Invalid Stripe price ID format: ${plan.stripePriceId} (should start with 'price_')`)
    }

    // Test Stripe connection first
    console.log("Testing Stripe connection...")
    try {
      await stripe.prices.retrieve(plan.stripePriceId)
      console.log("Price ID exists in Stripe:", plan.stripePriceId)
    } catch (priceError) {
      console.error("Price ID validation failed:", priceError)
      if (priceError instanceof Error) {
        if (priceError.message.includes("No such price")) {
          throw new Error(
            `Price ID '${plan.stripePriceId}' does not exist in your Stripe account. Please create it in your Stripe dashboard.`,
          )
        }
        if (priceError.message.includes("Invalid API Key")) {
          throw new Error("Invalid Stripe API key. Please check your STRIPE_SECRET_KEY environment variable.")
        }
      }
      throw priceError
    }

    // Create checkout session with the actual Stripe price ID
    console.log("Creating checkout session...")
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        planId: plan.id,
        planName: plan.name,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    })

    console.log(`Checkout session created successfully: ${session.id}`)
    console.log(`Checkout URL: ${session.url}`)

    return { url: session.url, sessionId: session.id }
  } catch (error) {
    console.error("=== Stripe Checkout Session Error ===")
    console.error("Error details:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("No such price")) {
        throw new Error(
          `Stripe price ID not found: ${SUBSCRIPTION_PLANS.find((p) => p.id === planId)?.stripePriceId}. Please check your Stripe dashboard.`,
        )
      }
      if (error.message.includes("Invalid API Key")) {
        throw new Error("Invalid Stripe API key. Please check your STRIPE_SECRET_KEY environment variable.")
      }
      if (error.message.includes("testmode")) {
        throw new Error(
          "Stripe key mismatch. Make sure you're using test keys with test price IDs or live keys with live price IDs.",
        )
      }
    }

    throw error
  }
}

// Helper function to create a billing portal session
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  try {
    if (!stripe) {
      throw new Error("Stripe is not properly configured")
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating billing portal session:", error)
    throw error
  }
}

// Export stripe instance for other uses
export { stripe }
