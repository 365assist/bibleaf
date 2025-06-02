import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check all environment variables that should be available
    const envStatus = {
      // Direct process.env access
      direct: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "exists" : "missing",
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "exists" : "missing",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "missing",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "missing",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "exists" : "missing",
        DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY ? "exists" : "missing",
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? "exists" : "missing",
      },

      // Show prefixes for debugging (safe to show first few characters)
      prefixes: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
          ? process.env.STRIPE_SECRET_KEY.substring(0, 8) + "..."
          : "not found",
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
          ? process.env.STRIPE_WEBHOOK_SECRET.substring(0, 8) + "..."
          : "not found",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 8) + "..."
          : "not found",
      },

      // Show all environment variable names that contain "STRIPE"
      stripeVars: Object.keys(process.env).filter((key) => key.includes("STRIPE")),

      // Show validation
      validation: {
        stripeSecretValid: process.env.STRIPE_SECRET_KEY?.startsWith("sk_") || false,
        stripeWebhookValid: process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") || false,
        stripePublishableValid: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_") || false,
      },

      // Runtime info
      runtime: {
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        platform: process.platform,
      },
    }

    return NextResponse.json(envStatus)
  } catch (error) {
    console.error("Environment debug error:", error)
    return NextResponse.json(
      {
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
