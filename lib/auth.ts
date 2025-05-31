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

      // Demo users for testing
      const demoUsers = [
        {
          email: "demo@bibleaf.com",
          password: "demo123",
          user: {
            id: "demo-user-123",
            email: "demo@bibleaf.com",
            name: "Demo User",
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
              verseCategories: ["hope", "faith", "love"],
            },
          },
        },
        {
          email: "premium@bibleaf.com",
          password: "premium123",
          user: {
            id: "premium-user-456",
            email: "premium@bibleaf.com",
            name: "Premium User",
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
              verseCategories: ["wisdom", "guidance", "peace"],
            },
          },
        },
      ]

      const demoUser = demoUsers.find((u) => u.email === email && u.password === password)

      if (!demoUser) {
        return { success: false, error: "Invalid email or password" }
      }

      // Create session
      const session = {
        userId: demoUser.user.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(demoUser.user))
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

      return { success: true, user: demoUser.user }
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

      // Check if user already exists (demo)
      if (email === "demo@bibleaf.com" || email === "premium@bibleaf.com") {
        return { success: false, error: "User already exists" }
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
        },
      }

      // Create session
      const session = {
        userId: newUser.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser))
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

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
  }
}

// NextAuth.js compatible authOptions for future migration
export const authOptions = {
  providers: [
    // Placeholder for future NextAuth.js integration
    {
      id: "demo",
      name: "Demo Provider",
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
