import { type NextRequest, NextResponse } from "next/server"
import { stripeConfig, getPlanById } from "@/lib/stripe-config"
import { env } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    if (!stripeConfig.isConfigured) {
      return NextResponse.json(
        {
          error: "Payment system not configured",
          message: "Stripe is not set up. Please contact support.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { planId, userId, successUrl, cancelUrl } = body

    if (!planId || !userId) {
      return NextResponse.json({ error: "Plan ID and User ID are required" }, { status: 400 })
    }

    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // For demo purposes, return a mock checkout URL
    // In production, you would create a real Stripe checkout session
    const mockCheckoutUrl = `${env.NEXT_PUBLIC_APP_URL}/payment/demo?plan=${planId}&amount=${plan.price}`

    return NextResponse.json({
      url: mockCheckoutUrl,
      sessionId: `demo_session_${Date.now()}`,
      message: "Demo mode - no real payment will be processed",
    })

    /* 
    // Real Stripe implementation would look like this:
    const stripe = require('stripe')(stripeConfig.secretKey)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        planId: planId,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
    */
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
