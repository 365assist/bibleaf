/**
 * Simple environment check utility
 * This provides basic environment validation without requiring all variables
 */

export function getBasicEnvStatus() {
  const isServer = typeof window === "undefined"

  if (!isServer) {
    return {
      client: true,
      server: false,
      message: "Client-side environment check",
    }
  }

  // Core required variables
  const coreVars = {
    nodeEnv: process.env.NODE_ENV || "development",
    hasStripe: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    hasDeepInfra: !!process.env.DEEPINFRA_API_KEY,
    hasElevenLabs: !!process.env.ELEVENLABS_API_KEY,
    hasBlobStorage: !!process.env.BLOB_READ_WRITE_TOKEN,
  }

  // Optional build variables (don't require them)
  const buildVars = {
    analyze: process.env.ANALYZE === "true",
    bundleAnalyze: process.env.BUNDLE_ANALYZE === "true",
    npmConfigured: !!(process.env.NPM_RC && process.env.NPM_TOKEN),
  }

  return {
    client: false,
    server: true,
    core: coreVars,
    build: buildVars,
    message: "Server-side environment check complete",
  }
}

export function isProductionReady() {
  const status = getBasicEnvStatus()

  if (!status.server) {
    return false
  }

  // Check if we have the minimum required for production
  return !!(
    status.core?.hasStripe &&
    status.core?.hasDeepInfra &&
    status.core?.hasElevenLabs &&
    status.core?.hasBlobStorage
  )
}
