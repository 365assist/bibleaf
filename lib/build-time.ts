/**
 * BUILD-TIME ONLY UTILITIES
 *
 * This file should ONLY be imported by build scripts and never by runtime code.
 * These utilities are for Next.js build process only.
 */

// These functions should only be called during build
export function getBuildConfig() {
  return {
    // Build analysis
    analyze: process.env.ANALYZE === "true",
    bundleAnalyze: process.env.BUNDLE_ANALYZE === "true",

    // NPM configuration
    npmRc: process.env.NPM_RC || "",
    npmToken: process.env.NPM_TOKEN || "",

    // Build environment
    nodeEnv: process.env.NODE_ENV || "development",
    vercelEnv: process.env.VERCEL_ENV || "",
  }
}

// This should only be used in next.config.js
export function configureBuild(config: any) {
  const buildConfig = getBuildConfig()

  // Apply build configuration
  if (buildConfig.analyze || buildConfig.bundleAnalyze) {
    // Add bundle analysis configuration
    console.log("Bundle analysis enabled")
  }

  return config
}
