import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS, getAnnualSavings } from "@/lib/stripe-config"

export async function GET() {
  try {
    console.log("=== Testing Annual Subscription Configuration ===")

    // Find the annual plan
    const annualPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "annual")

    if (!annualPlan) {
      return NextResponse.json(
        {
          success: false,
          error: "Annual plan not found in configuration",
          availablePlans: SUBSCRIPTION_PLANS.map((p) => ({ id: p.id, name: p.name })),
        },
        { status: 404 },
      )
    }

    console.log("Annual plan found:", {
      id: annualPlan.id,
      name: annualPlan.name,
      price: annualPlan.price,
      stripePriceId: annualPlan.stripePriceId,
    })

    // Check environment variables
    const envCheck = {
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || "not found",
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
    }

    console.log("Environment check:", envCheck)

    // Try to initialize Stripe
    let stripe = null
    let stripeError = null

    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY environment variable is not set")
      }

      if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
        throw new Error(
          `Invalid STRIPE_SECRET_KEY format. Expected to start with 'sk_', got: ${process.env.STRIPE_SECRET_KEY.substring(0, 10)}...`,
        )
      }

      // Dynamic import to avoid issues
      const Stripe = (await import("stripe")).default
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      })

      console.log("✅ Stripe initialized successfully")
    } catch (error) {
      stripeError = error instanceof Error ? error.message : String(error)
      console.error("❌ Stripe initialization failed:", stripeError)
    }

    // Test the price ID in Stripe if available
    let stripePrice = null
    let stripePriceError = null

    if (stripe && annualPlan.stripePriceId) {
      try {
        console.log(`Testing Stripe price ID: ${annualPlan.stripePriceId}`)
        stripePrice = await stripe.prices.retrieve(annualPlan.stripePriceId)
        console.log("✅ Stripe price retrieved successfully:", {
          id: stripePrice.id,
          amount: stripePrice.unit_amount,
          currency: stripePrice.currency,
          interval: stripePrice.recurring?.interval,
          active: stripePrice.active,
        })
      } catch (error) {
        stripePriceError = error instanceof Error ? error.message : String(error)
        console.error("❌ Error retrieving Stripe price:", stripePriceError)
      }
    }

    // Calculate savings
    let savings = null
    let savingsError = null

    try {
      savings = getAnnualSavings()
      console.log("Savings calculation:", savings)
    } catch (error) {
      savingsError = error instanceof Error ? error.message : String(error)
      console.error("❌ Error calculating savings:", savingsError)
    }

    // Comprehensive response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      annualPlan: {
        id: annualPlan.id,
        name: annualPlan.name,
        description: annualPlan.description,
        price: annualPlan.price,
        interval: annualPlan.interval,
        stripePriceId: annualPlan.stripePriceId,
        features: annualPlan.features,
      },
      stripe: {
        initialized: !!stripe,
        error: stripeError,
        priceRetrieved: !!stripePrice,
        priceError: stripePriceError,
        priceData: stripePrice
          ? {
              id: stripePrice.id,
              amount: stripePrice.unit_amount,
              currency: stripePrice.currency,
              interval: stripePrice.recurring?.interval,
              intervalCount: stripePrice.recurring?.interval_count,
              active: stripePrice.active,
              created: stripePrice.created,
            }
          : null,
      },
      savings: {
        data: savings,
        error: savingsError,
      },
      validation: {
        planExists: !!annualPlan,
        hasPriceId: !!annualPlan.stripePriceId,
        priceIdFormat: annualPlan.stripePriceId?.startsWith("price_"),
        stripeConfigured: !!stripe,
        priceAccessible: !!stripePrice,
      },
      recommendations: [],
    }

    // Add recommendations based on issues found
    if (!stripe) {
      response.recommendations.push("Set up STRIPE_SECRET_KEY environment variable")
    }
    if (!annualPlan.stripePriceId) {
      response.recommendations.push("Add stripePriceId to annual plan configuration")
    }
    if (stripePriceError) {
      response.recommendations.push("Verify the Stripe price ID exists in your Stripe dashboard")
    }
    if (!stripePrice && stripe) {
      response.recommendations.push("Create the annual subscription price in Stripe dashboard")
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("=== Test Annual Endpoint Error ===")
    console.error("Error type:", typeof error)
    console.error("Error constructor:", error?.constructor?.name)
    console.error("Error message:", error instanceof Error ? error.message : "No message")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    console.error("Raw error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Test endpoint failed",
        errorType: typeof error,
        errorConstructor: error?.constructor?.name || "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : null,
        timestamp: new Date().toISOString(),
        debug: {
          nodeVersion: process.version,
          platform: process.platform,
          env: process.env.NODE_ENV,
          vercel: process.env.VERCEL,
        },
      },
      { status: 500 },
    )
  }
}
