import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS, getAnnualSavings } from "@/lib/stripe-config"
import { stripe } from "@/lib/stripe-server"

export async function GET() {
  try {
    console.log("=== Testing Annual Subscription Configuration ===")

    // Find the annual plan
    const annualPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "annual")

    if (!annualPlan) {
      return NextResponse.json(
        {
          error: "Annual plan not found",
          availablePlans: SUBSCRIPTION_PLANS.map((p) => p.id),
        },
        { status: 404 },
      )
    }

    console.log("Annual plan found:", annualPlan)

    // Check if Stripe is available
    if (!stripe) {
      return NextResponse.json(
        {
          error: "Stripe not configured",
          plan: annualPlan,
          stripeAvailable: false,
        },
        { status: 500 },
      )
    }

    // Test the price ID in Stripe
    let stripePrice = null
    let stripePriceError = null

    if (annualPlan.stripePriceId) {
      try {
        stripePrice = await stripe.prices.retrieve(annualPlan.stripePriceId)
        console.log("Stripe price retrieved successfully:", stripePrice.id)
      } catch (error) {
        stripePriceError = error instanceof Error ? error.message : "Unknown error"
        console.error("Error retrieving Stripe price:", stripePriceError)
      }
    }

    // Calculate savings
    const savings = getAnnualSavings()

    return NextResponse.json({
      success: true,
      annualPlan,
      stripePrice: stripePrice
        ? {
            id: stripePrice.id,
            amount: stripePrice.unit_amount,
            currency: stripePrice.currency,
            interval: stripePrice.recurring?.interval,
            active: stripePrice.active,
          }
        : null,
      stripePriceError,
      savings,
      debug: {
        stripePriceId: annualPlan.stripePriceId,
        stripeConfigured: !!stripe,
        priceIdFormat: annualPlan.stripePriceId?.startsWith("price_"),
      },
    })
  } catch (error) {
    console.error("Error testing annual subscription:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
