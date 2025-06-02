import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe-config"
import Stripe from "stripe"

export async function GET() {
  // Basic response structure
  const response = {
    success: false,
    timestamp: new Date().toISOString(),
    annualPlan: null,
    stripeStatus: "not_initialized",
    priceStatus: "not_checked",
    error: null,
    details: {},
    recommendations: [],
  }

  try {
    // Step 1: Check if annual plan exists in configuration
    const annualPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "annual")

    if (!annualPlan) {
      response.error = "Annual plan not found in configuration"
      response.recommendations.push("Check SUBSCRIPTION_PLANS in lib/stripe-config.ts")
      return NextResponse.json(response, { status: 404 })
    }

    // Add plan to response
    response.annualPlan = {
      id: annualPlan.id,
      name: annualPlan.name,
      price: annualPlan.price,
      interval: annualPlan.interval,
      stripePriceId: annualPlan.stripePriceId || "not_set",
    }

    // Step 2: Check if Stripe secret key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      response.error = "STRIPE_SECRET_KEY environment variable is not set"
      response.stripeStatus = "missing_key"
      response.recommendations.push("Add STRIPE_SECRET_KEY to environment variables")
      return NextResponse.json(response, { status: 500 })
    }

    // Step 3: Check if price ID exists
    if (!annualPlan.stripePriceId) {
      response.error = "Annual plan does not have a stripePriceId"
      response.priceStatus = "missing_id"
      response.recommendations.push("Add stripePriceId to annual plan in lib/stripe-config.ts")
      return NextResponse.json(response, { status: 400 })
    }

    // Step 4: Initialize Stripe (simple approach)
    let stripe: Stripe | null = null
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      })
      response.stripeStatus = "initialized"
    } catch (stripeInitError) {
      response.error = "Failed to initialize Stripe"
      response.stripeStatus = "init_failed"
      response.details.stripeInitError =
        stripeInitError instanceof Error ? stripeInitError.message : "Unknown Stripe initialization error"
      response.recommendations.push("Check STRIPE_SECRET_KEY format and validity")
      return NextResponse.json(response, { status: 500 })
    }

    // Step 5: Try to retrieve the price
    try {
      if (!stripe) throw new Error("Stripe not initialized")

      const price = await stripe.prices.retrieve(annualPlan.stripePriceId)

      response.priceStatus = "found"
      response.details.price = {
        id: price.id,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: price.recurring
          ? {
              interval: price.recurring.interval,
              interval_count: price.recurring.interval_count,
            }
          : null,
      }

      // Check if price is correctly configured
      if (price.recurring?.interval !== "year") {
        response.recommendations.push(`Price interval is "${price.recurring?.interval}" but should be "year"`)
      }

      response.success = true
    } catch (priceError) {
      response.error = "Failed to retrieve price from Stripe"
      response.priceStatus = "retrieval_failed"
      response.details.priceError = priceError instanceof Error ? priceError.message : "Unknown price retrieval error"

      if (priceError instanceof Error && priceError.message.includes("No such price")) {
        response.recommendations.push(`Create price "${annualPlan.stripePriceId}" in Stripe dashboard`)
      } else {
        response.recommendations.push("Check Stripe API access and permissions")
      }

      return NextResponse.json(response, { status: 404 })
    }

    return NextResponse.json(response)
  } catch (error) {
    // Catch-all error handler
    response.error = "Test endpoint failed"
    response.details.errorMessage = error instanceof Error ? error.message : "Unknown error"
    response.details.errorType = typeof error

    console.error("Test annual endpoint error:", error)

    return NextResponse.json(response, { status: 500 })
  }
}
