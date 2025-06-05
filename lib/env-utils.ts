// Type-safe check for client vs server
export const isServer = typeof window === "undefined"
export const isClient = !isServer

// Import from the env.ts file
import { clientEnv, serverEnv, features } from "./env"

// Re-export for backwards compatibility
export { clientEnv, serverEnv, features }

// Safe environment checks that work on both client and server
export const getAppUrl = () => {
  if (isClient) {
    return window.location.origin
  }
  return clientEnv.NEXT_PUBLIC_APP_URL
}

export const getApiUrl = () => {
  return clientEnv.NEXT_PUBLIC_API_URL
}

export const isDevelopment = () => {
  if (isClient) {
    return window.location.hostname === "localhost"
  }
  return process.env.NODE_ENV === "development"
}

// Safe environment access that doesn't trigger warnings for build-time variables
export function safeGetEnv(key: string): string {
  // Build-time only variables that shouldn't be accessed at runtime
  const buildTimeVars = ["NPM_RC", "NPM_TOKEN", "ANALYZE", "BUNDLE_ANALYZE"]

  if (buildTimeVars.includes(key)) {
    return "" // Silently return empty string for build-time variables
  }

  if (isClient && !key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`${key} cannot be accessed on the client.`)
    return ""
  }

  return process.env[key] || ""
}

// App configuration that works on both client and server
export const appConfig = {
  appName: "BibleAF",
  appDescription: "AI-Powered Bible Study and Life Guidance",
  appUrl: getAppUrl(),
  apiUrl: getApiUrl(),
  isDev: isDevelopment(),
}
