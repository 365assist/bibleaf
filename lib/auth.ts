// Simple authentication system using localStorage for demo
// In production, you'd use NextAuth.js or similar

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  subscription: {
    tier: "free" | "basic" | "premium" | "annual"
    status: "active" | "canceled" | "expired"
    searchesUsedToday: number
    lastSearchReset: string
  }
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    verseCategories: string[]
    onboardingComplete?: boolean
  }
}

export class AuthService {
  private static readonly USER_KEY = "bibleaf_user"
  private static readonly SESSION_KEY = "bibleaf_session"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem(this.USER_KEY)
      const sessionData = localStorage.getItem(this.SESSION_KEY)

      if (!userData || !sessionData) return null

      const session = JSON.parse(sessionData)
      const now = Date.now()

      // Check if session is expired (24 hours)
      if (now > session.expiresAt) {
        this.logout()
        return null
      }

      return JSON.parse(userData)
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Developer accounts for testing and development
      const developerUsers = [
        {
          email: "dev@bibleaf.com",
          password: "dev2024!",
          user: {
            id: "dev-user-001",
            email: "dev@bibleaf.com",
            name: "Developer Account",
            createdAt: new Date().toISOString(),
            subscription: {
              tier: "premium" as const,
              status: "active" as const,
              searchesUsedToday: 0,
              lastSearchReset: new Date().toISOString(),
            },
            preferences: {
              theme: "system" as const,
              notifications: true,
              verseCategories: ["development", "testing", "faith"],
            },
          },
        },
        {
          email: "admin@bibleaf.com",
          password: "admin2024!",
          user: {
            id: "admin-user-001",
            email: "admin@bibleaf.com",
            name: "Admin Account",
            createdAt: new Date().toISOString(),
            subscription: {
              tier: "premium" as const,
              status: "active" as const,
              searchesUsedToday: 0,
              lastSearchReset: new Date().toISOString(),
            },
            preferences: {
              theme: "system" as const,
              notifications: true,
              verseCategories: ["administration", "management", "wisdom"],
            },
          },
        },
        {
          email: "test@bibleaf.com",
          password: "test2024!",
          user: {
            id: "test-user-001",
            email: "test@bibleaf.com",
            name: "Test Account",
            createdAt: new Date().toISOString(),
            subscription: {
              tier: "free" as const,
              status: "active" as const,
              searchesUsedToday: 0,
              lastSearchReset: new Date().toISOString(),
            },
            preferences: {
              theme: "system" as const,
              notifications: true,
              verseCategories: ["testing", "quality-assurance"],
            },
          },
        },
      ]

      const developerUser = developerUsers.find((u) => u.email === email && u.password === password)

      if (!developerUser) {
        return { success: false, error: "Invalid email or password" }
      }

      // Create session
      const session = {
        userId: developerUser.user.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(developerUser.user))
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

      // Try to initialize user data in blob storage for developer accounts
      // But make it optional - don't block login if blob storage is not available
      try {
        // Check if BLOB_READ_WRITE_TOKEN is available before attempting to save
        const { serverEnv } = await import("./env-server")
        if (serverEnv.BLOB_READ_WRITE_TOKEN) {
          const { saveUserData, getUserData } = await import("./blob-storage")

          // First check if user data already exists
          const existingUserData = await getUserData(developerUser.user.id)

          if (!existingUserData) {
            // If no existing data, save the new user data
            await saveUserData(developerUser.user)
            console.log("User data saved to blob storage")
          } else {
            // If data exists but tier doesn't match, update it
            if (existingUserData.subscription.tier !== developerUser.user.subscription.tier) {
              existingUserData.subscription.tier = developerUser.user.subscription.tier
              await saveUserData(existingUserData)
              console.log("User subscription tier updated in blob storage")
            }
          }
        } else {
          console.log("Blob storage not configured - skipping user data initialization")
        }
      } catch (error) {
        // Don't block login if blob storage fails
        console.log("Note: User data initialization skipped (blob storage not available)")
      }

      return { success: true, user: developerUser.user }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  static async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists (developer accounts)
      if (email === "dev@bibleaf.com" || email === "admin@bibleaf.com" || email === "test@bibleaf.com") {
        return { success: false, error: "This email is reserved. Please use a different email address." }
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        createdAt: new Date().toISOString(),
        subscription: {
          tier: "free",
          status: "active",
          searchesUsedToday: 0,
          lastSearchReset: new Date().toISOString(),
        },
        preferences: {
          theme: "system",
          notifications: true,
          verseCategories: [],
          onboardingComplete: false,
        },
      }

      // Create session
      const session = {
        userId: newUser.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser))
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

      // Try to save user data to blob storage, but make it optional
      try {
        // Check if BLOB_READ_WRITE_TOKEN is available before attempting to save
        const { serverEnv } = await import("./env-server")
        if (serverEnv.BLOB_READ_WRITE_TOKEN) {
          const { saveUserData } = await import("./blob-storage")
          await saveUserData(newUser)
          console.log("New user data saved to blob storage")
        } else {
          console.log("Blob storage not configured - skipping user data initialization")
        }
      } catch (error) {
        // Don't block signup if blob storage fails
        console.log("Note: User data initialization skipped (blob storage not available)")
      }

      return { success: true, user: newUser }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: "Signup failed. Please try again." }
    }
  }

  static logout(): void {
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.SESSION_KEY)
    window.location.href = "/"
  }

  static updateUser(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser))

    // Try to update user data in blob storage, but make it optional
    try {
      // We're in a client component, so we can't directly check serverEnv
      // Instead, we'll try to update and catch any errors
      import("./blob-storage").then(({ saveUserData }) => {
        saveUserData(updatedUser).catch(() => {
          console.log("Note: User data update skipped (blob storage not available)")
        })
      })
    } catch (error) {
      // Don't block the update if blob storage fails
      console.log("Note: User data update skipped (blob storage not available)")
    }
  }
}

// NextAuth.js compatible authOptions for future migration
export const authOptions = {
  providers: [
    // Placeholder for future NextAuth.js integration
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const result = await AuthService.login(credentials.email, credentials.password)
        return result.success ? result.user : null
      },
    },
  ],
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }
      return session
    },
  },
}
