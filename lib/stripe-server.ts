import Stripe from "stripe"
import { serverEnv } from "./env-server"
import { SUBSCRIPTION_PLANS } from "./stripe-config"

// Initialize Stripe with better error handling
let stripe: Stripe | null = null
let stripeInitialized = false

function initializeStripe() {
  if (stripeInitialized) return stripe

  try {
    if (!serverEnv.STRIPE_SECRET_KEY) {
      console.log("Stripe not configured: STRIPE_SECRET_KEY is not set")
      stripe = null
    } else if (!serverEnv.STRIPE_SECRET_KEY.startsWith("sk_")) {
      console.warn("STRIPE_SECRET_KEY appears to be invalid (should start with 'sk_')")
      console.warn("Current key starts with:", serverEnv.STRIPE_SECRET_KEY.substring(0, 10))
      stripe = null
    } else {
      stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      })
      console.log("Stripe initialized successfully")
    }
  } catch (error) {
    console.warn("Failed to initialize Stripe:", error)
    stripe = null
  }

  stripeInitialized = true
  return stripe
}

// Helper function to check if Stripe is available
export function isStripeAvailable(): boolean {
  const stripeInstance = initializeStripe()
  return stripeInstance !== null
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
    // Check if Stripe is available
    const stripeInstance = initializeStripe()
    if (!stripeInstance) {
      throw new Error("Stripe is not configured. Please set up your Stripe environment variables.")
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
      await stripeInstance.prices.retrieve(plan.stripePriceId)
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
    const session = await stripeInstance.checkout.sessions.create({
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
    const stripeInstance = initializeStripe()
    if (!stripeInstance) {
      throw new Error("Stripe is not configured")
    }

    const session = await stripeInstance.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating billing portal session:", error)
    throw error
  }
}

// Export stripe instance for other uses (can be null)
export { stripe }

// Initialize on module load
initializeStripe()
