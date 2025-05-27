"use client"

import { AuthService } from "@/lib/auth"

// Re-export the AuthService for client components
export { AuthService }

// Create a safe version that doesn't use browser APIs for server components
export const SafeAuthService = {
  // Safe methods that don't use browser APIs
  // These can be used in server components
  
  // For example, a method to check if a user exists by email
  // that would be implemented with a database call in a real app
  userExists: async (email: string): Promise<boolean> => {
    // This would be a server-side check in a real app
    return email === "demo@bibleaf.com" || email === "premium@bibleaf.com"
  }
}
