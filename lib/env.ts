/**
 * Environment variables utility
 *
 * This file provides safe access to environment variables with proper client/server separation
 */

// Type-safe check for client vs server
export const isServer = typeof window === "undefined"
export const isClient = !isServer

// List of build-time only variables that should never be accessed at runtime
const BUILD_TIME_ONLY_VARS = ["NPM_RC", "NPM_TOKEN", "ANALYZE", "BUNDLE_ANALYZE"]

// ==============================
// CLIENT-SIDE ENVIRONMENT
// ==============================
// These variables are safe to use on both client and server

export const clientEnv = {
  // App information
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Public API keys (safe for client)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
}

// ==============================
// SERVER-SIDE ENVIRONMENT
// ==============================
// These variables are ONLY available on the server

// This is a safe proxy that prevents client-side access
const createServerOnlyProxy = () => {
  const handler = {
    get: (target: any, prop: string) => {
      // For build-time only variables, silently return empty string (no warnings)
      if (BUILD_TIME_ONLY_VARS.includes(prop)) {
        return ""
      }

      // Only allow access on the server for other variables
      if (isClient) {
        // Only warn for actual server variables, not build-time variables
        if (!BUILD_TIME_ONLY_VARS.includes(prop)) {
          console.warn(`${prop} cannot be accessed on the client.`)
        }
        return ""
      }

      // On the server, return the actual value
      return process.env[prop] || ""
    },
  }

  return new Proxy({}, handler)
}

// Server-only environment variables
export const serverEnv = createServerOnlyProxy()

// ==============================
// ENVIRONMENT UTILITIES
// ==============================

// Check if we're in development mode
export const isDevelopment = () => {
  if (isClient) {
    return window.location.hostname === "localhost"
  }
  return process.env.NODE_ENV === "development"
}

// Get the app URL
export const getAppUrl = () => {
  if (isClient) {
    return window.location.origin
  }
  return clientEnv.NEXT_PUBLIC_APP_URL
}

// Feature flags based on environment
export const features = {
  // Features that work with or without API keys
  offlineMode: true,
  bibleSearch: true,
  lifeGuidance: true,
  dailyVerse: true,
  savedVerses: true,

  // Features that require specific API keys
  get tts() {
    // Always check server-side only for security
    if (isClient) {
      return true // Assume available, will be validated server-side
    }
    return !!process.env.ELEVENLABS_API_KEY
  },

  get payments() {
    if (isClient) {
      return !!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
    return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)
  },

  get aiPowered() {
    if (isClient) {
      return true // Assume available, will be checked server-side
    }
    return !!process.env.DEEPINFRA_API_KEY
  },

  get storage() {
    if (isClient) {
      return true // Assume available, will be checked server-side
    }
    return !!process.env.BLOB_READ_WRITE_TOKEN
  },
}

// Combined environment object for backward compatibility
export const env = {
  // Client-side variables
  ...clientEnv,

  // Server-side variables (will be empty on client)
  STRIPE_SECRET_KEY: isServer ? process.env.STRIPE_SECRET_KEY || "" : "",
  STRIPE_WEBHOOK_SECRET: isServer ? process.env.STRIPE_WEBHOOK_SECRET || "" : "",
  ELEVENLABS_API_KEY: isServer ? process.env.ELEVENLABS_API_KEY || "" : "",
  DEEPINFRA_API_KEY: isServer ? process.env.DEEPINFRA_API_KEY || "" : "",
  BLOB_READ_WRITE_TOKEN: isServer ? process.env.BLOB_READ_WRITE_TOKEN || "" : "",
  OPENAI_API_KEY: isServer ? process.env.OPENAI_API_KEY || "" : "",
}
