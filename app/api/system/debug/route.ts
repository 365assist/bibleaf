import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic environment check without importing complex modules
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      server: {
        stripe: {
          secretKeyExists: !!process.env.STRIPE_SECRET_KEY,
          secretKeyPrefix: process.env.STRIPE_SECRET_KEY
            ? `${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...`
            : "undefined",
          secretKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
          secretKeyValid: process.env.STRIPE_SECRET_KEY?.startsWith("sk_") || false,
          webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
        },
      },
      client: {
        stripe: {
          publishableKeyExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 7)}...`
            : "undefined",
          publishableKeyValid: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_") || false,
        },
        app: {
          appUrlExists: !!process.env.NEXT_PUBLIC_APP_URL,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || "undefined",
        },
      },
      rawEnvCheck: {
        NODE_ENV: process.env.NODE_ENV,
        hasStripeSecret: "STRIPE_SECRET_KEY" in process.env,
        hasStripePublishable: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" in process.env,
        hasAppUrl: "NEXT_PUBLIC_APP_URL" in process.env,
      },
    }

    return NextResponse.json(debug, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)

    // Return a minimal error response
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        basicCheck: {
          hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
          hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        },
      },
      { status: 500 },
    )
  }
}
