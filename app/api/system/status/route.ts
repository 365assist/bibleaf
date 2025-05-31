import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Direct environment variable access on server
    const status = {
      services: {
        stripe: !!(
          process.env.STRIPE_SECRET_KEY &&
          process.env.STRIPE_WEBHOOK_SECRET &&
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ),
        openai: !!process.env.OPENAI_API_KEY,
        deepInfra: !!process.env.DEEPINFRA_API_KEY,
        elevenLabs: !!process.env.ELEVENLABS_API_KEY,
        blobStorage: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      // Debug info (remove in production)
      debug: {
        stripeSecretKeyExists: !!process.env.STRIPE_SECRET_KEY,
        stripeWebhookExists: !!process.env.STRIPE_WEBHOOK_SECRET,
        stripePublishableExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        stripeSecretPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + "...",
        stripePublishablePrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 8) + "...",
      },
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error checking system status:", error)
    return NextResponse.json({ error: "Failed to check system status" }, { status: 500 })
  }
}
