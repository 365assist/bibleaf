import { type NextRequest, NextResponse } from "next/server"
import { stripeConfig } from "@/lib/stripe-config"

export async function POST(request: NextRequest) {
  try {
    if (!stripeConfig.isConfigured) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    // For demo purposes, just log the webhook
    console.log("Stripe webhook received (demo mode)")
    console.log("Body:", body)
    console.log("Signature:", signature)

    /* 
    // Real Stripe webhook verification would look like this:
    const stripe = require('stripe')(stripeConfig.secretKey)
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const userId = session.client_reference_id
        const planId = session.metadata.planId
        
        // Update user subscription in your database
        const userData = await getUserData(userId)
        if (userData) {
          userData.subscription = {
            tier: planId,
            status: 'active',
            searchesUsedToday: 0,
            lastSearchReset: new Date().toISOString()
          }
          userData.updatedAt = new Date().toISOString()
          await saveUserData(userData)
        }
        break
        
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break
        
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
    */

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
