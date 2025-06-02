import { NextResponse } from "next/server"
import { validateStripeConfiguration, testStripeConnection } from "@/lib/stripe-validation"

export async function GET() {
  try {
    console.log("=== Testing Stripe Connection ===")

    // First validate configuration
    const validation = validateStripeConfiguration()
    console.log("Validation result:", validation)

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: "Stripe configuration invalid",
        validation,
      })
    }

    // Test actual connection
    const connectionTest = await testStripeConnection()
    console.log("Connection test result:", connectionTest)

    // Test price retrieval
    let priceTest = null
    try {
      const { stripe } = await import("@/lib/stripe-server")
      if (stripe) {
        // Test retrieving one of our price IDs
        const testPrice = await stripe.prices.retrieve("price_1RUrjRBiT317Uae5TiLEGTsD")
        priceTest = {
          success: true,
          priceId: testPrice.id,
          amount: testPrice.unit_amount,
          currency: testPrice.currency,
        }
      }
    } catch (error) {
      priceTest = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json({
      success: true,
      validation,
      connection: connectionTest,
      priceTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stripe test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
