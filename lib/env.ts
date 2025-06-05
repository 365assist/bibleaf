/**
 * Environment variables utility with proper client/server separation
 */

// Type-safe environment detection
export const isServer = typeof window === "undefined"
export const isClient = !isServer

// ==============================
// CLIENT-SIDE ENVIRONMENT
// ==============================
export const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
}

// ==============================
// SERVER-SIDE ENVIRONMENT PROXY
// ==============================
const createServerProxy = () => {
  return new Proxy({} as Record<string, string>, {
    get: (target, prop: string) => {
      if (isClient) {
        console.warn(`Server environment variable ${prop} accessed on client`)
        return ""
      }
      return process.env[prop] || ""
    },
  })
}

export const serverEnv = createServerProxy()

// ==============================
// FEATURE FLAGS
// ==============================
export const features = {
  offlineMode: true,
  bibleSearch: true,
  lifeGuidance: true,
  dailyVerse: true,
  savedVerses: true,

  get tts() {
    if (isClient) return true
    return !!process.env.ELEVENLABS_API_KEY
  },

  get payments() {
    if (isClient) return !!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)
  },

  get aiPowered() {
    if (isClient) return true
    return !!(process.env.DEEPINFRA_API_KEY || process.env.OPENAI_API_KEY)
  },

  get storage() {
    if (isClient) return true
    return !!process.env.BLOB_READ_WRITE_TOKEN
  },
}

// ==============================
// VALIDATION FUNCTIONS
// ==============================
export function validateClientEnv() {
  const warnings = []

  if (!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    warnings.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
  }

  if (!clientEnv.NEXT_PUBLIC_API_URL) {
    warnings.push("NEXT_PUBLIC_API_URL")
  }

  if (warnings.length > 0) {
    console.warn(`Missing client env vars: ${warnings.join(", ")}`)
  }

  return warnings.length === 0
}

export function validateServerEnv() {
  if (isClient) return true

  const required = ["OPENAI_API_KEY", "STRIPE_SECRET_KEY", "BLOB_READ_WRITE_TOKEN"]
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error(`Missing server env vars: ${missing.join(", ")}`)
    return false
  }

  return true
}

export function validateEnv() {
  if (isServer) {
    return validateClientEnv() && validateServerEnv()
  }
  return validateClientEnv()
}

// ==============================
// UTILITIES
// ==============================
export const getAppUrl = () => {
  if (isClient) return window.location.origin
  return clientEnv.NEXT_PUBLIC_APP_URL
}

export const getApiUrl = () => {
  return clientEnv.NEXT_PUBLIC_API_URL
}

export const isDevelopment = () => {
  if (isClient) return window.location.hostname === "localhost"
  return process.env.NODE_ENV === "development"
}

// Debug function for server environment
export function debugServerEnv() {
  if (isClient) {
    console.warn("Server environment debugging is only available on the server")
    return { error: "Cannot access server environment from client" }
  }

  if (process.env.NODE_ENV !== "development") {
    return { message: "Debug information only available in development mode" }
  }

  const envVars = [
    "OPENAI_API_KEY",
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "BLOB_READ_WRITE_TOKEN",
    "ELEVENLABS_API_KEY",
    "DEEPINFRA_API_KEY",
  ]

  const status = {}
  for (const key of envVars) {
    status[key] = process.env[key] ? "defined" : "missing"
  }

  return {
    nodeEnv: process.env.NODE_ENV,
    status,
    timestamp: new Date().toISOString(),
  }
}

// ==============================
// LEGACY ENV OBJECT (for backward compatibility)
// ==============================
export const env = {
  // Client-side environment variables
  ...clientEnv,

  // Server-side environment variables (only available on server)
  ...(isServer
    ? {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
        ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",
        DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY || "",
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || "",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
        DATABASE_URL: process.env.DATABASE_URL || "",
      }
    : {}),

  // Common environment variables
  NODE_ENV: process.env.NODE_ENV || "development",
}
