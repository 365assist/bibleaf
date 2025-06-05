import { type NextRequest, NextResponse } from "next/server"
import { stripeInstance } from "../../../../lib/stripe-server"
import { SUBSCRIPTION_PLANS } from "../../../../lib/stripe-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priceId = searchParams.get("priceId")

    if (!stripeInstance) {
      return NextResponse.json(
        {
          error: "Stripe not configured",
          message: "Stripe is not properly initialized",
          success: false,
        },
        { status: 500 },
      )
    }

    // If no specific price ID, validate all plans
    if (!priceId) {
      const results = []

      for (const plan of SUBSCRIPTION_PLANS) {
        if (!plan.stripePriceId) {
          results.push({
            planId: plan.id,
            planName: plan.name,
            priceId: "MISSING",
            status: "error",
            message: "No price ID configured",
          })
          continue
        }

        try {
          const price = await stripeInstance.prices.retrieve(plan.stripePriceId)
          results.push({
            planId: plan.id,
            planName: plan.name,
            priceId: plan.stripePriceId,
            status: "success",
            details: {
              active: price.active,
              type: price.type,
              currency: price.currency,
              unit_amount: price.unit_amount,
              recurring: price.recurring
                ? {
                    interval: price.recurring.interval,
                    interval_count: price.recurring.interval_count,
                  }
                : null,
            },
            issues: [
              !price.active && "Price is not active",
              price.type !== "recurring" && `Price type is '${price.type}', should be 'recurring'`,
              !price.recurring && "Price has no recurring configuration",
              price.recurring &&
                price.recurring.interval !== plan.interval &&
                `Interval mismatch: expected '${plan.interval}', got '${price.recurring.interval}'`,
            ].filter(Boolean),
          })
        } catch (error) {
          results.push({
            planId: plan.id,
            planName: plan.name,
            priceId: plan.stripePriceId,
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: results.length,
          valid: results.filter((r) => r.status === "success" && (!r.issues || r.issues.length === 0)).length,
          withIssues: results.filter((r) => r.status === "success" && r.issues && r.issues.length > 0).length,
          errors: results.filter((r) => r.status === "error").length,
        },
      })
    }

    // Validate specific price ID
    try {
      const price = await stripeInstance.prices.retrieve(priceId)
      return NextResponse.json({
        success: true,
        priceId,
        details: {
          id: price.id,
          active: price.active,
          type: price.type,
          currency: price.currency,
          unit_amount: price.unit_amount,
          recurring: price.recurring,
          created: new Date(price.created * 1000).toISOString(),
        },
        issues: [
          !price.active && "Price is not active",
          price.type !== "recurring" && `Price type is '${price.type}', should be 'recurring'`,
          !price.recurring && "Price has no recurring configuration",
        ].filter(Boolean),
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          priceId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
