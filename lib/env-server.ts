// Server-side environment variables with proper validation
export const serverEnv = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY || "",
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",

  // Storage Configuration
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || "",

  // Other Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  ANALYZE: process.env.ANALYZE || "",
  BUNDLE_ANALYZE: process.env.BUNDLE_ANALYZE || "",
  NPM_RC: process.env.NPM_RC || "",
  NPM_TOKEN: process.env.NPM_TOKEN || "",
}

// Debug function to log environment status
export function debugServerEnv() {
  console.log("=== Server Environment Debug ===")
  console.log("STRIPE_SECRET_KEY exists:", !!serverEnv.STRIPE_SECRET_KEY)
  console.log("STRIPE_SECRET_KEY length:", serverEnv.STRIPE_SECRET_KEY.length)
  console.log("STRIPE_SECRET_KEY starts with sk_:", serverEnv.STRIPE_SECRET_KEY.startsWith("sk_"))
  console.log("STRIPE_WEBHOOK_SECRET exists:", !!serverEnv.STRIPE_WEBHOOK_SECRET)
  console.log("DEEPINFRA_API_KEY exists:", !!serverEnv.DEEPINFRA_API_KEY)
  console.log("BLOB_READ_WRITE_TOKEN exists:", !!serverEnv.BLOB_READ_WRITE_TOKEN)
  console.log(
    "All process.env STRIPE vars:",
    Object.keys(process.env).filter((key) => key.includes("STRIPE")),
  )
  console.log("================================")
}

// Validate server environment on import
if (typeof window === "undefined") {
  debugServerEnv()
}
