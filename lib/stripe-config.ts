import { clientEnv } from "./env-client"

// Server-side environment access (only works on server)
const getServerEnv = (key: string) => {
  if (typeof window !== "undefined") {
    return "" // Client-side, return empty
  }

  // Debug: Log what we're trying to access
  console.log(`Accessing server env: ${key}`)
  console.log(`Value exists: ${!!process.env[key]}`)
  console.log(`Value prefix: ${process.env[key] ? process.env[key]?.substring(0, 8) + "..." : "not found"}`)

  return process.env[key] || ""
}

// Stripe configuration
export const stripeConfig = {
  publishableKey: clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: getServerEnv("STRIPE_SECRET_KEY"),
  webhookSecret: getServerEnv("STRIPE_WEBHOOK_SECRET"),
  get isConfigured() {
    if (typeof window !== "undefined") {
      // Client-side check
      return !!this.publishableKey
    }
    // Server-side check
    console.log("Checking Stripe configuration:")
    console.log("- Secret key exists:", !!this.secretKey)
    console.log("- Webhook secret exists:", !!this.webhookSecret)
    console.log("- Publishable key exists:", !!this.publishableKey)

    return !!(this.secretKey && this.webhookSecret && this.publishableKey)
  },
}

// Subscription plans with corrected pricing for production
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number // in cents
  interval: "month" | "year"
  features: string[]
  searchesPerDay: number
  stripePriceId?: string // Live Stripe price ID
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential features for daily Bible study",
    price: 499, // $4.99/month
    interval: "month",
    features: [
      "Unlimited Bible reading",
      "50 AI-powered searches per day",
      "25 Life guidance requests per day",
      "Save up to 500 verses",
      "Text-to-speech for verses",
      "Dark/light mode",
      "Offline access",
      "Cross-references",
    ],
    searchesPerDay: 50,
    stripePriceId: "price_1RUrjRBiT317Uae5TiLEGTsD", // Production price ID
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for deeper spiritual growth",
    price: 999, // $9.99/month
    interval: "month",
    features: [
      "All Basic features",
      "Unlimited AI-powered searches",
      "Unlimited Life guidance requests",
      "Unlimited saved verses",
      "Advanced verse tagging and notes",
      "Reading progress tracking",
      "Commentary access",
      "Original language tools",
      "Priority support",
      "Export study notes",
    ],
    searchesPerDay: Number.POSITIVE_INFINITY,
    stripePriceId: "price_1RUrkHBiT317Uae5OtdFxSdn", // Production price ID
    popular: true,
  },
  {
    id: "annual",
    name: "Annual Premium",
    description: "Best value - 2 months free!",
    price: 9999, // $99.99/year (equivalent to $8.33/month)
    interval: "year",
    features: [
      "All Premium features",
      "2 months free (17% savings)",
      "Early access to new features",
      "Downloadable study materials",
      "VIP support",
      "Annual progress reports",
      "Exclusive webinars",
    ],
    searchesPerDay: Number.POSITIVE_INFINITY,
    stripePriceId: "price_1RUrlCBiT317Uae5W9CKifrf", // Confirmed annual price ID
  },
]

export const FREE_TIER = {
  id: "free",
  name: "Free",
  description: "Try BibleAF with limited features",
  searchesPerDay: 5,
  guidancePerDay: 3,
  savedVerses: 10,
  features: [
    "Bible reading access",
    "5 AI-powered searches per day",
    "3 Life guidance requests per day",
    "Save up to 10 verses",
    "Basic cross-references",
  ],
}

// Helper function to format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100)
}

// Get plan by ID
export const getPlanById = (planId: string): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) || null
}

// Calculate savings for annual plan
export const getAnnualSavings = (): { amount: number; percentage: number } => {
  const premiumMonthly = SUBSCRIPTION_PLANS.find((p) => p.id === "premium")?.price || 999
  const annualPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "annual")?.price || 9999
  const monthlyEquivalent = premiumMonthly * 12
  const savings = monthlyEquivalent - annualPlan
  const percentage = Math.round((savings / monthlyEquivalent) * 100)

  return {
    amount: savings,
    percentage,
  }
}
