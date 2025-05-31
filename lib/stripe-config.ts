import { clientEnv } from "./env-client"

// Server-side environment access (only works on server)
const getServerEnv = (key: string) => {
  if (typeof window !== "undefined") {
    return "" // Client-side, return empty
  }
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
    return !!(this.secretKey && this.webhookSecret && this.publishableKey)
  },
}

// Subscription plans with updated live Stripe price IDs
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
    price: 499, // $4.99
    interval: "month",
    features: [
      "Unlimited Bible reading",
      "20 AI-powered searches per day",
      "10 Life guidance requests per day",
      "Save up to 100 verses",
      "Dark/light mode",
      "Offline access",
    ],
    searchesPerDay: 20,
    stripePriceId: "price_1RUrjRBiT317Uae5TiLEGTsD", // Live price ID for $4.99/month
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for deeper spiritual growth",
    price: 1999, // $19.99
    interval: "month",
    features: [
      "All Basic features",
      "Unlimited AI-powered searches",
      "Unlimited Life guidance requests",
      "Unlimited saved verses",
      "Advanced verse tagging",
      "Reading progress tracking",
      "Priority support",
    ],
    searchesPerDay: Number.POSITIVE_INFINITY,
    stripePriceId: "price_1RUrkHBiT317Uae5OtdFxSdn", // Live price ID for $19.99/month
    popular: true,
  },
  {
    id: "annual",
    name: "Annual Premium",
    description: "Best value with 1 month free",
    price: 9999, // $99.99
    interval: "year",
    features: [
      "All Premium features",
      "1 month free",
      "Early access to new features",
      "Downloadable study materials",
      "VIP support",
    ],
    searchesPerDay: Number.POSITIVE_INFINITY,
    stripePriceId: "price_1RUrlCBiT317Uae5W9CKifrf", // Live price ID for $99.99/year
  },
]

export const FREE_TIER = {
  id: "free",
  name: "Free",
  description: "Try BibleAF with limited features",
  searchesPerDay: 5,
  features: [
    "Bible reading",
    "5 AI-powered searches per day",
    "3 Life guidance requests per day",
    "Save up to 10 verses",
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
