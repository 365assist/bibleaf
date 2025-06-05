import { NextResponse } from "next/server"

export async function GET() {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      status: "healthy",
      services: {
        database: true, // Vercel Blob storage
        ai: !!process.env.OPENAI_API_KEY,
        tts: !!process.env.ELEVENLABS_API_KEY,
        stripe: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        blob: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || "unknown",
      },
      features: {
        aiSearch: true,
        lifeGuidance: true,
        textToSpeech: !!process.env.ELEVENLABS_API_KEY,
        payments: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        userAccounts: true,
        offlineSupport: true,
      },
      version: "1.0.0",
    }

    return NextResponse.json(status, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("System status check failed:", error)

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: "error",
        error: "System status check failed",
        services: {
          database: false,
          ai: false,
          tts: false,
          stripe: false,
          blob: false,
        },
      },
      { status: 500 },
    )
  }
}
