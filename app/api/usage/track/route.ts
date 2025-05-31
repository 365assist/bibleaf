import { type NextRequest, NextResponse } from "next/server"
import { updateUsageTracking, getUserData } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user data to check current usage
    const userData = await getUserData(userId)

    if (!userData) {
      return NextResponse.json({ error: "User not found", usage: { searches: 0 } }, { status: 404 })
    }

    // Return current usage data
    return NextResponse.json({
      usage: {
        searches: userData.subscription.searchesUsedToday || 0,
        tier: userData.subscription.tier,
        limit: getTierLimit(userData.subscription.tier),
      },
    })
  } catch (error) {
    console.error("Error tracking usage:", error)
    return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!type || !["search", "guidance"].includes(type)) {
      return NextResponse.json({ error: "Valid type is required" }, { status: 400 })
    }

    // Update usage tracking
    const success = await updateUsageTracking(userId, type)

    if (!success) {
      return NextResponse.json({ error: "Usage limit exceeded", limitExceeded: true }, { status: 429 })
    }

    // Get updated user data
    const userData = await getUserData(userId)

    return NextResponse.json({
      success: true,
      usage: userData
        ? {
            searches: userData.subscription.searchesUsedToday || 0,
            tier: userData.subscription.tier,
            limit: getTierLimit(userData.subscription.tier),
          }
        : { searches: 0, tier: "free", limit: 5 },
    })
  } catch (error) {
    console.error("Error tracking usage:", error)
    return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
  }
}

function getTierLimit(tier: string): number {
  switch (tier) {
    case "premium":
    case "annual":
      return Number.POSITIVE_INFINITY
    case "basic":
      return 20
    case "free":
    default:
      return 5
  }
}
