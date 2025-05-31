import { isServer } from "./env-utils"

// List of build-time only variables that should never be accessed at runtime
const BUILD_TIME_ONLY_VARS = ["NPM_RC", "NPM_TOKEN", "ANALYZE", "BUNDLE_ANALYZE"]

// Server-side environment variables
// These are ONLY available on the server
export const serverEnv = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: isServer ? process.env.STRIPE_SECRET_KEY || "" : "",
  STRIPE_WEBHOOK_SECRET: isServer ? process.env.STRIPE_WEBHOOK_SECRET || "" : "",

  // AI Configuration
  DEEPINFRA_API_KEY: isServer ? process.env.DEEPINFRA_API_KEY || "" : "",
  ELEVENLABS_API_KEY: isServer ? process.env.ELEVENLABS_API_KEY || "" : "",

  // Storage Configuration
  BLOB_READ_WRITE_TOKEN: isServer ? process.env.BLOB_READ_WRITE_TOKEN || "" : "",
}

// Validation function for server environment
export function validateServerEnv() {
  // Only run on server
  if (!isServer) return { valid: false, error: "Cannot validate server environment on client" }

  const requiredVars = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]
  const optionalVars = ["DEEPINFRA_API_KEY", "ELEVENLABS_API_KEY", "BLOB_READ_WRITE_TOKEN"]

  const missing = requiredVars.filter((v) => !process.env[v])
  const missingOptional = optionalVars.filter((v) => !process.env[v])

  if (missing.length > 0) {
    console.error(`Missing required server environment variables: ${missing.join(", ")}`)
    return { valid: false, missing, missingOptional }
  }

  if (missingOptional.length > 0) {
    console.warn(`Missing optional server environment variables: ${missingOptional.join(", ")}`)
  }

  return { valid: true, missing: [], missingOptional }
}

// Check if Stripe is properly configured (server-side)
export const isStripeConfiguredServer = isServer
  ? !!(serverEnv.STRIPE_SECRET_KEY && serverEnv.STRIPE_WEBHOOK_SECRET)
  : false

// Check if Deep Infra is properly configured (server-side)
export const isDeepInfraConfigured = isServer ? !!serverEnv.DEEPINFRA_API_KEY : false

// Check if ElevenLabs is properly configured (server-side)
export const isElevenLabsConfiguredServer = isServer ? !!serverEnv.ELEVENLABS_API_KEY : false

// Check if Blob storage is properly configured (server-side)
export const isBlobStorageConfigured = isServer ? !!serverEnv.BLOB_READ_WRITE_TOKEN : false

// Get environment status for system status page
export function getEnvironmentStatus() {
  if (!isServer) {
    return { error: "Cannot get environment status on client" }
  }

  return {
    core: {
      app: true,
    },
    services: {
      stripe: isStripeConfiguredServer,
      deepInfra: isDeepInfraConfigured,
      elevenLabs: isElevenLabsConfiguredServer,
      blobStorage: isBlobStorageConfigured,
    },
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  }
}
