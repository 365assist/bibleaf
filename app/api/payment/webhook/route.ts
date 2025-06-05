import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "../../../../lib/stripe-server"
import { serverEnv } from "../../../../lib/env-server"
import { headers } from "next/headers"
import type Stripe from "stripe"

// This is your Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") as string

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, serverEnv.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          // Update user subscription status in your database
          console.log(`User ${userId} subscribed successfully`)

          // TODO: Update user subscription in your database
          // await db.user.update({
          //   where: { id: userId },
          //   data: {
          //     stripeCustomerId: session.customer as string,
          //     subscriptionStatus: "active",
          //     subscriptionPlan: "premium", // Determine based on the price ID
          //   },
          // })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription updates
        console.log(`Subscription ${subscription.id} updated`)

        // TODO: Update subscription status in your database
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellations
        console.log(`Subscription ${subscription.id} cancelled`)

        // TODO: Update subscription status in your database
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return a success response
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

// Updated configuration for Next.js App Router
export const runtime = "nodejs"
// Disable body parsing, we need the raw body for webhook signature verification
export const dynamic = "force-dynamic"
