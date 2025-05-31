import { loadStripe, type Stripe } from "@stripe/stripe-js"
import { clientEnv } from "./env-client"

let stripePromise: Promise<Stripe | null>

// Initialize Stripe on the client side
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

// Helper function to redirect to checkout
export async function redirectToCheckout(sessionId: string) {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error("Stripe failed to load")
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error redirecting to checkout:", error)
    throw error
  }
}

// Alternative function to redirect using URL (simpler approach)
export async function redirectToCheckoutUrl(url: string) {
  window.location.href = url
}

// Helper function to redirect to billing portal
export async function redirectToBillingPortal() {
  try {
    const response = await fetch("/api/payment/manage-subscription", {
      method: "POST",
    })

    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    console.error("Error redirecting to billing portal:", error)
    throw error
  }
}
