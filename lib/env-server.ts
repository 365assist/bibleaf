/**
 * Server-only environment variables
 * This file should only be imported in server-side code
 */

// Validate we're on the server
if (typeof window !== "undefined") {
  throw new Error("env-server.ts should only be imported on the server side")
}

// Server environment variables with validation
export const serverEnv = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY || "",

  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || "",

  // TTS
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",

  // App
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Validation function
export function validateServerEnv() {
  const required = ["OPENAI_API_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "BLOB_READ_WRITE_TOKEN"]

  const missing = required.filter((key) => !serverEnv[key as keyof typeof serverEnv])

  if (missing.length > 0) {
    console.warn(`Missing server environment variables: ${missing.join(", ")}`)
    return false
  }

  return true
}

// Debug function for server environment variables
export function debugServerEnv() {
  if (serverEnv.NODE_ENV === "development") {
    const status = {}
    for (const key in serverEnv) {
      status[key] = serverEnv[key as keyof typeof serverEnv] ? "defined" : "missing"
    }

    return {
      nodeEnv: serverEnv.NODE_ENV,
      status,
      timestamp: new Date().toISOString(),
    }
  }

  return { message: "Debug information only available in development mode" }
}
