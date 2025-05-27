// src/lib/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with the public key
// In a real app, this would be an environment variable
const stripePublicKey = 'pk_test_example_key_for_demo';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

// Helper function to format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
};

// Types for subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  interval: 'month' | 'year';
  features: string[];
  searchesPerDay: number;
  popular?: boolean;
}

// Define subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for daily Bible study',
    price: 499, // $4.99
    interval: 'month',
    features: [
      'Unlimited Bible reading',
      '20 AI-powered searches per day',
      '10 Life guidance requests per day',
      'Save up to 100 verses',
      'Dark/light mode',
      'Offline access'
    ],
    searchesPerDay: 20
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Advanced features for deeper spiritual growth',
    price: 999, // $9.99
    interval: 'month',
    features: [
      'All Basic features',
      'Unlimited AI-powered searches',
      'Unlimited Life guidance requests',
      'Unlimited saved verses',
      'Advanced verse tagging',
      'Reading progress tracking',
      'Priority support'
    ],
    searchesPerDay: Infinity,
    popular: true
  },
  {
    id: 'annual',
    name: 'Annual',
    description: 'Best value with 2 months free',
    price: 4999, // $49.99
    interval: 'year',
    features: [
      'All Premium features',
      '2 months free',
      'Early access to new features',
      'Downloadable study materials',
      'VIP support'
    ],
    searchesPerDay: Infinity
  }
];

// Free tier definition
export const FREE_TIER = {
  id: 'free',
  name: 'Free',
  description: 'Try BibleAF with limited features',
  searchesPerDay: 5,
  features: [
    'Bible reading',
    '5 AI-powered searches per day',
    '3 Life guidance requests per day',
    'Save up to 10 verses'
  ]
};
