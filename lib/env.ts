// Environment variables validation and configuration
export const env = {
  // Deep Infra AI API Key
  DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY || "",

  // Vercel Blob Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || "",

  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Node Environment
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Validation function
export function validateEnv() {
  const missing = []

  if (!env.DEEPINFRA_API_KEY) missing.push("DEEPINFRA_API_KEY")
  if (!env.BLOB_READ_WRITE_TOKEN) missing.push("BLOB_READ_WRITE_TOKEN")

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
    console.warn("Some features may not work properly.")
  }

  return missing.length === 0
}

// Check if we're in development mode
export const isDev = env.NODE_ENV === "development"
export const isProd = env.NODE_ENV === "production"
