import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple environment variable check
    const envCheck = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      variables: {
        STRIPE_SECRET_KEY: {
          exists: !!process.env.STRIPE_SECRET_KEY,
          length: process.env.STRIPE_SECRET_KEY?.length || 0,
          prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || "none",
          valid: process.env.STRIPE_SECRET_KEY?.startsWith("sk_") || false,
        },
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
          exists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          length: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
          prefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) || "none",
          valid: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_") || false,
        },
        NEXT_PUBLIC_APP_URL: {
          exists: !!process.env.NEXT_PUBLIC_APP_URL,
          value: process.env.NEXT_PUBLIC_APP_URL || "not set",
        },
      },
    }

    return NextResponse.json(envCheck)
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json(
      {
        error: "Environment check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
