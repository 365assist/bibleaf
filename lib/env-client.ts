// Client-side environment variables (prefixed with NEXT_PUBLIC_)
// These are safe to access on both client and server

export const clientEnv = {
  // Stripe Configuration (Client-side)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // API URL
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
}

// Validation function for client environment
export function validateClientEnv() {
  const missing = []

  if (!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
  if (!clientEnv.NEXT_PUBLIC_APP_URL) missing.push("NEXT_PUBLIC_APP_URL")
  if (!clientEnv.NEXT_PUBLIC_API_URL) missing.push("NEXT_PUBLIC_API_URL")

  if (missing.length > 0) {
    console.warn(`Missing client environment variables: ${missing.join(", ")}`)
    console.warn("Some features may not work properly.")
  }

  return missing.length === 0
}

// Check if Stripe is properly configured (client-side)
export const isStripeConfiguredClient = !!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Safe environment checks that work on both client and server
export const getAppUrl = () => {
  if (typeof window !== "undefined") {
    // Client side
    return window.location.origin
  }
  // Server side
  return clientEnv.NEXT_PUBLIC_APP_URL
}

export const getApiUrl = () => {
  return clientEnv.NEXT_PUBLIC_API_URL
}

export const isDevelopment = () => {
  if (typeof window !== "undefined") {
    // Client side
    return window.location.hostname === "localhost"
  }
  // Server side
  return process.env.NODE_ENV === "development"
}
