import { env } from "./env"

// Stripe configuration
export const stripeConfig = {
  publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  secretKey: env.STRIPE_SECRET_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  isConfigured: !!(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY),
}

// Subscription plans with real Stripe price IDs (you'll need to create these in Stripe)
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number // in cents
  interval: "month" | "year"
  features: string[]
  searchesPerDay: number
  stripePriceId?: string // Real Stripe price ID
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
    stripePriceId: "price_basic_monthly", // Replace with real Stripe price ID
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for deeper spiritual growth",
    price: 999, // $9.99
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
    stripePriceId: "price_premium_monthly", // Replace with real Stripe price ID
    popular: true,
  },
  {
    id: "annual",
    name: "Annual Premium",
    description: "Best value with 2 months free",
    price: 9999, // $99.99 (instead of $119.88)
    interval: "year",
    features: [
      "All Premium features",
      "2 months free",
      "Early access to new features",
      "Downloadable study materials",
      "VIP support",
    ],
    searchesPerDay: Number.POSITIVE_INFINITY,
    stripePriceId: "price_premium_yearly", // Replace with real Stripe price ID
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
