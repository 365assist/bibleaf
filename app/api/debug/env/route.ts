import { NextResponse } from "next/server"

export async function GET() {
  // Only return public environment variables for security
  return NextResponse.json({
    // Safe to expose these as they're already public
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || null,

    // For private variables, just return existence status, not values
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "exists" : "missing",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "exists" : "missing",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "exists" : "missing",
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? "exists" : "missing",

    // Add other environment variables status here
    NODE_ENV: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  })
}
