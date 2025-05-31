import { type NextRequest, NextResponse } from "next/server"
import { createBillingPortalSession } from "../../../../lib/stripe-server"
import { clientEnv } from "../../../../lib/env-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get the user's Stripe customer ID
    const customerId = session.user.stripeCustomerId
    if (!customerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 })
    }

    // Create a billing portal session
    const { url } = await createBillingPortalSession({
      customerId,
      returnUrl: `${clientEnv.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    // Return the billing portal URL
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error creating billing portal session:", error)
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 })
  }
}
