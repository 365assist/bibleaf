import { type NextRequest, NextResponse } from "next/server"
import { clientEnv } from "../../../../lib/env-client"
import { serverEnv, debugServerEnv } from "../../../../lib/env-server"
import { SUBSCRIPTION_PLANS } from "../../../../lib/stripe-config"
import { stripeInstance } from "../../../../lib/stripe-server"

export async function POST(request: NextRequest) {
  console.log("=== Checkout API Route Called ===")

  try {
    // Debug environment variables first
    debugServerEnv()

    // Check environment variables with better error messages
    console.log("Checking environment variables...")
    console.log("Direct process.env.STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY)
    console.log("serverEnv.STRIPE_SECRET_KEY exists:", !!serverEnv.STRIPE_SECRET_KEY)

    // Use direct process.env access as fallback
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || serverEnv.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is missing from both process.env and serverEnv")
      return NextResponse.json(
        {
          error: "Stripe configuration error",
          message: "STRIPE_SECRET_KEY environment variable is not set",
          success: false,
        },
        { status: 500 },
      )
    }

    if (!stripeSecretKey.startsWith("sk_")) {
      console.error("STRIPE_SECRET_KEY has invalid format:", stripeSecretKey.substring(0, 10))
      return NextResponse.json(
        {
          error: "Stripe configuration error",
          message: "STRIPE_SECRET_KEY must start with 'sk_'",
          success: false,
        },
        { status: 500 },
      )
    }

    if (!clientEnv.NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL is missing")
      return NextResponse.json(
        {
          error: "Configuration error",
          message: "NEXT_PUBLIC_APP_URL environment variable is not set",
          success: false,
        },
        { status: 500 },
      )
    }

    console.log("Environment variables OK")

    // Get the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Request body must be valid JSON",
          success: false,
        },
        { status: 400 },
      )
    }

    const { planId, userId, successUrl, cancelUrl } = body

    console.log("Received checkout request:", { planId, userId })

    // Validate the required fields
    if (!planId) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Plan ID is required",
          success: false,
        },
        { status: 400 },
      )
    }

    // Check if plan exists
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
    if (!plan) {
      console.error(`Plan not found: ${planId}`)
      console.log(
        "Available plans:",
        SUBSCRIPTION_PLANS.map((p) => ({ id: p.id, name: p.name, stripePriceId: p.stripePriceId })),
      )
      return NextResponse.json(
        {
          error: "Plan not found",
          message: `Plan '${planId}' does not exist. Available plans: ${SUBSCRIPTION_PLANS.map((p) => p.id).join(", ")}`,
          success: false,
        },
        { status: 400 },
      )
    }

    console.log(`Plan found: ${plan.name} (${plan.id}) with price ID: ${plan.stripePriceId}`)

    // Check if plan has price ID
    if (!plan.stripePriceId) {
      console.error(`Plan ${planId} has no price ID`)
      return NextResponse.json(
        {
          error: "Plan configuration error",
          message: `Plan '${planId}' does not have a Stripe price ID configured`,
          success: false,
        },
        { status: 500 },
      )
    }

    // Validate price ID format
    if (!plan.stripePriceId.startsWith("price_")) {
      console.error(`Invalid price ID format: ${plan.stripePriceId}`)
      return NextResponse.json(
        {
          error: "Price ID error",
          message: `Invalid price ID format: ${plan.stripePriceId}. Must start with 'price_'`,
          success: false,
        },
        { status: 500 },
      )
    }

    // Check if Stripe is initialized
    if (!stripeInstance) {
      console.error("Stripe instance is not initialized")
      return NextResponse.json(
        {
          error: "Stripe configuration error",
          message: "Stripe is not properly initialized",
          success: false,
        },
        { status: 500 },
      )
    }

    // Validate the price exists and is recurring
    try {
      console.log(`Validating price ID: ${plan.stripePriceId}`)
      const price = await stripeInstance.prices.retrieve(plan.stripePriceId)

      console.log("Price details:", {
        id: price.id,
        type: price.type,
        recurring: price.recurring,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
      })

      if (!price.active) {
        console.error(`Price ${plan.stripePriceId} is not active`)
        return NextResponse.json(
          {
            error: "Price configuration error",
            message: `Price '${plan.stripePriceId}' is not active in Stripe. Please activate it in your Stripe dashboard.`,
            success: false,
          },
          { status: 400 },
        )
      }

      if (price.type !== "recurring") {
        console.error(`Price ${plan.stripePriceId} is not recurring. Type: ${price.type}`)
        return NextResponse.json(
          {
            error: "Price configuration error",
            message: `Price '${plan.stripePriceId}' must be a recurring price for subscriptions. Current type: ${price.type}. Please create a recurring price in your Stripe dashboard.`,
            success: false,
          },
          { status: 400 },
        )
      }

      if (!price.recurring) {
        console.error(`Price ${plan.stripePriceId} has no recurring configuration`)
        return NextResponse.json(
          {
            error: "Price configuration error",
            message: `Price '${plan.stripePriceId}' is missing recurring configuration. Please set up recurring billing in your Stripe dashboard.`,
            success: false,
          },
          { status: 400 },
        )
      }

      // Validate the interval matches our plan
      const expectedInterval = plan.interval === "year" ? "year" : "month"
      if (price.recurring.interval !== expectedInterval) {
        console.error(`Price interval mismatch. Expected: ${expectedInterval}, Got: ${price.recurring.interval}`)
        return NextResponse.json(
          {
            error: "Price configuration error",
            message: `Price '${plan.stripePriceId}' has interval '${price.recurring.interval}' but plan expects '${expectedInterval}'. Please create a price with the correct interval.`,
            success: false,
          },
          { status: 400 },
        )
      }

      console.log(`✅ Price validation successful for ${plan.stripePriceId}`)
    } catch (priceError) {
      console.error("Price validation failed:", priceError)

      if (priceError instanceof Error) {
        if (priceError.message.includes("No such price")) {
          return NextResponse.json(
            {
              error: "Price not found",
              message: `Price '${plan.stripePriceId}' does not exist in your Stripe account. Please create it in your Stripe dashboard.`,
              success: false,
            },
            { status: 400 },
          )
        }
        if (priceError.message.includes("Invalid API Key")) {
          return NextResponse.json(
            {
              error: "Stripe configuration error",
              message: "Invalid Stripe API key. Please check your STRIPE_SECRET_KEY environment variable.",
              success: false,
            },
            { status: 500 },
          )
        }
      }

      return NextResponse.json(
        {
          error: "Price validation error",
          message: `Failed to validate price: ${priceError instanceof Error ? priceError.message : "Unknown error"}`,
          success: false,
        },
        { status: 500 },
      )
    }

    // Use provided userId or generate a test one
    const userIdToUse = userId || `test-user-${Date.now()}`

    // Use provided URLs or generate default ones
    const defaultSuccessUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const defaultCancelUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/payment/cancel`

    const finalSuccessUrl = successUrl || defaultSuccessUrl
    const finalCancelUrl = cancelUrl || defaultCancelUrl

    console.log("Creating checkout session with:", {
      planId,
      userId: userIdToUse,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      priceId: plan.stripePriceId,
    })

    // Create a checkout session with proper error handling
    try {
      const session = await stripeInstance.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
        client_reference_id: userIdToUse,
        metadata: {
          userId: userIdToUse,
          planId: plan.id,
          planName: plan.name,
          planInterval: plan.interval,
          planPrice: plan.price.toString(),
        },
        allow_promotion_codes: true,
        billing_address_collection: "required",
        subscription_data: {
          metadata: {
            userId: userIdToUse,
            planId: plan.id,
            planInterval: plan.interval,
          },
        },
      })

      const url = session.url
      const sessionId = session.id

      console.log("Checkout session created successfully:", { sessionId, url })

      // Return the checkout URL
      return NextResponse.json({
        url,
        sessionId,
        success: true,
      })
    } catch (stripeError) {
      console.error("Stripe checkout session creation error:", stripeError)

      // Handle specific Stripe errors
      if (stripeError instanceof Error) {
        if (stripeError.message.includes("recurring price")) {
          return NextResponse.json(
            {
              error: "Price configuration error",
              message: `The price '${plan.stripePriceId}' must be configured as a recurring price in Stripe. Please go to your Stripe dashboard and create a recurring price for $${(plan.price / 100).toFixed(2)}/${plan.interval}.`,
              success: false,
            },
            { status: 400 },
          )
        }
      }

      // Ensure we return a proper JSON response
      return NextResponse.json(
        {
          error: "Stripe error",
          message: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("=== Checkout API Error ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Always return a valid JSON response
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
