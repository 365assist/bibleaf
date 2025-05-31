import { NextResponse } from "next/server"
import { validateStripeConfiguration, testStripeConnection } from "@/lib/stripe-validation"

export async function GET() {
  try {
    const validation = validateStripeConfiguration()
    const connectionTest = await testStripeConnection()

    return NextResponse.json({
      configuration: validation,
      connection: connectionTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stripe validation error:", error)
    return NextResponse.json(
      {
        error: "Failed to validate Stripe configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
