// Re-export from stripe-config.ts for backward compatibility
import { 
  stripeConfig, 
  SUBSCRIPTION_PLANS, 
  FREE_TIER, 
  formatPrice, 
  getPlanById,
  type SubscriptionPlan 
} from './stripe-config';

export { 
  stripeConfig, 
  SUBSCRIPTION_PLANS, 
  FREE_TIER, 
  formatPrice, 
  getPlanById,
  type SubscriptionPlan 
};

// Default export for compatibility
export default {
  stripeConfig,
  SUBSCRIPTION_PLANS,
  FREE_TIER,
  formatPrice,
  getPlanById
};

// Add getStripe function
export const getStripe = async () => {
  try {
    // This is a mock implementation since we don't have the actual Stripe.js implementation
    // In a real app, this would load the Stripe.js library and initialize it with the publishable key
    console.log('Initializing Stripe...');
    return {
      redirectToCheckout: async ({ sessionId }: { sessionId: string }) => {
        console.log(`Redirecting to checkout with session ID: ${sessionId}`);
        return { error: null };
      }
    };
  } catch (error) {
    console.error('Failed to initialize Stripe', error);
    throw error;
  }
};
