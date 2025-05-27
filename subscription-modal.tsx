import { useState } from 'react';
import { getStripe, SUBSCRIPTION_PLANS, FREE_TIER, formatPrice, SubscriptionPlan } from '@/lib/stripe';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  userId: string;
}

export default function SubscriptionModal({ isOpen, onClose, currentPlan, userId }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setIsLoading(true);
      setSelectedPlan(plan);
      
      // Call the API to create a checkout session
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: `price_${plan.id}`, // In a real app, this would be a real Stripe price ID
          customerId: userId,
          successUrl: `${window.location.origin}/dashboard/profile?subscription=success`,
          cancelUrl: `${window.location.origin}/dashboard/profile?subscription=canceled`,
        }),
      });
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-3xl max-h-[90vh] overflow-auto rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Free Tier */}
          <div className={`border rounded-lg p-6 ${currentPlan === 'free' ? 'border-primary' : ''}`}>
            <h3 className="text-xl font-semibold mb-2">{FREE_TIER.name}</h3>
            <p className="text-muted-foreground mb-4">{FREE_TIER.description}</p>
            <p className="text-2xl font-bold mb-4">Free</p>
            
            <ul className="space-y-2 mb-6">
              {FREE_TIER.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              disabled={currentPlan === 'free'}
              className="w-full py-2 px-4 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Select'}
            </button>
          </div>
          
          {/* Paid Plans */}
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-6 ${plan.popular ? 'border-primary ring-1 ring-primary' : ''} ${currentPlan === plan.id ? 'border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <p className="text-2xl font-bold mb-1">{formatPrice(plan.price)}</p>
              <p className="text-sm text-muted-foreground mb-4">per {plan.interval}</p>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || currentPlan === plan.id}
                className={`w-full py-2 px-4 rounded-md ${
                  currentPlan === plan.id 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                } disabled:opacity-50`}
              >
                {isLoading && selectedPlan?.id === plan.id ? 'Processing...' : ''}
                {!isLoading && currentPlan === plan.id ? 'Current Plan' : ''}
                {!isLoading && currentPlan !== plan.id ? 'Subscribe' : ''}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure payment processing by Stripe</p>
          <p className="mt-1">Cancel anytime. We'll remind you before your trial ends.</p>
        </div>
      </div>
    </div>
  );
}
