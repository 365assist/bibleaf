"use client";

import { useState, useEffect } from 'react';
import { formatPrice, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import SubscriptionModal from '@/components/subscription/subscription-modal';

interface SubscriptionManagementProps {
  userId: string;
  currentPlan: string;
  subscriptionData?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

export default function SubscriptionManagement({ 
  userId, 
  currentPlan = 'free',
  subscriptionData
}: SubscriptionManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Get current plan details
  const planDetails = currentPlan === 'free' 
    ? { name: 'Free', price: 0, interval: 'month' as const } 
    : SUBSCRIPTION_PLANS.find(plan => plan.id === currentPlan) || { name: 'Free', price: 0, interval: 'month' as const };
  
  // Format the renewal date
  const renewalDate = subscriptionData?.currentPeriodEnd 
    ? new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;
  
  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!subscriptionData?.id) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.'
    );
    
    if (!confirmed) return;
    
    try {
      setIsCancelling(true);
      
      const response = await fetch('/api/payment/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: userId,
          subscriptionId: subscriptionData.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Your subscription has been canceled. You will have access until the end of your current billing period.');
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Subscription Management</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Plan</span>
          <span className="text-sm font-bold capitalize">{planDetails.name}</span>
        </div>
        
        {currentPlan !== 'free' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price</span>
              <span className="text-sm">{formatPrice(planDetails.price)} / {planDetails.interval}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                subscriptionData?.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {subscriptionData?.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {renewalDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {subscriptionData?.cancelAtPeriodEnd ? 'Access Until' : 'Renews On'}
                </span>
                <span className="text-sm">{renewalDate}</span>
              </div>
            )}
          </>
        )}
        
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
          >
            {currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
          </button>
          
          {currentPlan !== 'free' && !subscriptionData?.cancelAtPeriodEnd && (
            <button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="px-4 py-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 text-sm"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
        
        {currentPlan === 'free' && (
          <p className="text-xs text-muted-foreground mt-2">
            You are currently on the Free plan with limited features. Upgrade to unlock more capabilities.
          </p>
        )}
        
        {currentPlan !== 'free' && subscriptionData?.cancelAtPeriodEnd && (
          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
            <p>Your subscription has been canceled and will not renew. You have access until {renewalDate}.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:text-primary/80 text-xs mt-1"
            >
              Reactivate Subscription
            </button>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentPlan={currentPlan}
          userId={userId}
        />
      )}
    </div>
  );
}
