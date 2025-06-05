import { NextResponse } from "next/server"
import { validateStripeConfiguration, testStripeConnection } from "@/lib/stripe-validation"

export async function GET() {
  try {
    console.log("=== Stripe Validation API Called ===")

    // Debug environment access
    console.log("Direct STRIPE_SECRET_KEY check:", !!process.env.STRIPE_SECRET_KEY)
    console.log(
      "Available STRIPE vars:",
      Object.keys(process.env).filter((key) => key.includes("STRIPE")),
    )

    // Validate configuration
    const configuration = validateStripeConfiguration()
    console.log("Configuration validation result:", configuration)

    // Test connection (only if configuration is valid)
    let connection = { success: false, error: "Configuration invalid" }
    if (configuration.isValid) {
      connection = await testStripeConnection()
      console.log("Connection test result:", connection)
    }

    // Test a specific price ID
    let priceTest = { success: false, error: "Skipped due to configuration issues" }
    if (connection.success) {
      try {
        const { stripe } = await import("@/lib/stripe-server")
        if (stripe) {
          // Test the basic plan price ID
          const price = await stripe.prices.retrieve("price_1RUrjRBiT317Uae5TiLEGTsD")
          priceTest = {
            success: true,
            priceId: price.id,
            amount: price.unit_amount || 0,
            currency: price.currency,
            interval: price.recurring?.interval || "unknown",
          }
        }
      } catch (error) {
        priceTest = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    return NextResponse.json({
      configuration,
      connection,
      priceTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stripe validation error:", error)
    return NextResponse.json(
      {
        error: "Stripe validation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
