/**
 * Build-time environment variables
 * These are only used during the build process and should not be accessed at runtime
 */

// Check if we're in a build environment
export const isBuildTime = process.env.NODE_ENV === undefined || process.env.VERCEL_ENV === undefined

// Build-time only environment variables
export const buildEnv = {
  // NPM Configuration (used during build/install only)
  NPM_RC: process.env.NPM_RC || "",
  NPM_TOKEN: process.env.NPM_TOKEN || "",

  // Build configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  VERCEL_ENV: process.env.VERCEL_ENV || "",

  // Build flags - these should have defaults
  ANALYZE: process.env.ANALYZE === "true" || false,
  BUNDLE_ANALYZE: process.env.BUNDLE_ANALYZE === "true" || false,
}

// Validation for build environment
export function validateBuildEnv() {
  const warnings = []

  if (!buildEnv.NPM_RC) {
    warnings.push("NPM_RC not set - may affect package installation")
  }

  if (!buildEnv.NPM_TOKEN) {
    warnings.push("NPM_TOKEN not set - may affect private package access")
  }

  // ANALYZE and BUNDLE_ANALYZE are optional and have defaults

  if (warnings.length > 0) {
    console.warn("Build environment warnings:", warnings.join(", "))
  }

  return {
    valid: true,
    warnings,
    env: buildEnv,
  }
}
