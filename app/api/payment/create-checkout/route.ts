import { type NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "../../../../lib/stripe-server"
import { clientEnv } from "../../../../lib/env-client"
import { serverEnv } from "../../../../lib/env-server"
import { SUBSCRIPTION_PLANS } from "../../../../lib/stripe-config"

export async function POST(request: NextRequest) {
  console.log("=== Checkout API Route Called ===")

  try {
    // Check environment variables first
    console.log("Checking environment variables...")

    if (!serverEnv.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing")
      return NextResponse.json(
        {
          error: "Stripe configuration error",
          message: "STRIPE_SECRET_KEY environment variable is not set",
          success: false,
        },
        { status: 500 },
      )
    }

    if (!serverEnv.STRIPE_SECRET_KEY.startsWith("sk_")) {
      console.error("STRIPE_SECRET_KEY has invalid format:", serverEnv.STRIPE_SECRET_KEY.substring(0, 10))
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
        SUBSCRIPTION_PLANS.map((p) => p.id),
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

    console.log(`Plan found: ${plan.name} with price ID: ${plan.stripePriceId}`)

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

    // Create a checkout session
    const { url, sessionId } = await createCheckoutSession({
      planId,
      userId: userIdToUse,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
    })

    console.log("Checkout session created successfully:", { sessionId, url })

    // Return the checkout URL
    return NextResponse.json({
      url,
      sessionId,
      success: true,
    })
  } catch (error) {
    console.error("=== Checkout API Error ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Handle specific Stripe errors
    let errorMessage = "Unknown error occurred"
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Handle specific Stripe API errors
      if (error.message.includes("No such price")) {
        errorMessage = `Stripe price not found. Please check your Stripe dashboard for the price ID.`
        statusCode = 400
      } else if (error.message.includes("Invalid API Key")) {
        errorMessage = "Invalid Stripe API key. Please check your STRIPE_SECRET_KEY."
        statusCode = 500
      } else if (error.message.includes("testmode")) {
        errorMessage = "Stripe key/price ID mismatch. Ensure you're using test keys with test prices."
        statusCode = 400
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: errorMessage,
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode },
    )
  }
}
