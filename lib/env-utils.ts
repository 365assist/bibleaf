// Type-safe check for client vs server
export const isServer = typeof window === "undefined"
export const isClient = !isServer

// Import from the new env.ts file
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

export const isDevelopment = () => {
  if (isClient) {
    return window.location.hostname === "localhost"
  }
  return process.env.NODE_ENV === "development"
}

// Safe environment access that doesn't trigger warnings for build-time variables
export function safeGetEnv(key: string): string {
  // Build-time only variables that shouldn't be accessed at runtime
  const buildTimeVars = ["NPM_RC", "NPM_TOKEN"]

  if (isClient && buildTimeVars.includes(key)) {
    return ""
  }

  if (isClient && !key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`${key} cannot be accessed on the client.`)
    return ""
  }

  return process.env[key] || ""
}

// Prevent client-side access to server-only environment variables
export function preventClientAccess(variableName: string): string {
  // Build-time only variables
  const buildTimeVars = ["NPM_RC", "NPM_TOKEN"]

  if (isClient) {
    if (!buildTimeVars.includes(variableName)) {
      console.warn(`${variableName} cannot be accessed on the client.`)
    }
    return ""
  }
  return process.env[variableName] || ""
}

// App configuration that works on both client and server
export const appConfig = {
  appName: "BibleAF",
  appDescription: "AI-Powered Bible Study and Life Guidance",
  appUrl: getAppUrl(),
  isDev: isDevelopment(),
}
