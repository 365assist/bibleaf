import { type NextRequest, NextResponse } from "next/server"
import { updateUsageTracking, getUserData, initializeUserData } from "@/lib/blob-storage"

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

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Try to get user data
    let userData = await getUserData(userId)

    // If user data doesn't exist, initialize it
    if (!userData) {
      console.log(`No user data found for ${userId}, initializing...`)

      // Create default user data structure
      const defaultUserData = {
        id: userId,
        email: userId.includes("@") ? userId : `${userId}@example.com`,
        name: userId.split("@")[0] || "User",
        createdAt: new Date().toISOString(),
        subscription: {
          tier: "free",
          status: "active",
          searchesUsedToday: 0,
          lastSearchReset: new Date().toISOString(),
        },
        preferences: {
          theme: "system",
          notifications: true,
          verseCategories: [],
        },
      }

      try {
        await initializeUserData(userId, defaultUserData)
        userData = defaultUserData
        console.log(`Initialized user data for ${userId}`)
      } catch (initError) {
        console.error("Error initializing user data:", initError)
        // Return default values if initialization fails
        return NextResponse.json({
          usage: {
            searches: 0,
            tier: "free",
            limit: 5,
          },
        })
      }
    }

    // Return current usage data
    return NextResponse.json({
      usage: {
        searches: userData.subscription.searchesUsedToday || 0,
        tier: userData.subscription.tier || "free",
        limit: getTierLimit(userData.subscription.tier || "free"),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/usage/track:", error)

    // Return default values on error
    return NextResponse.json({
      usage: {
        searches: 0,
        tier: "free",
        limit: 5,
      },
    })
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

    // Try to get user data
    let userData = await getUserData(userId)

    // If user data doesn't exist, initialize it
    if (!userData) {
      console.log(`No user data found for ${userId}, initializing before tracking...`)

      const defaultUserData = {
        id: userId,
        email: userId.includes("@") ? userId : `${userId}@example.com`,
        name: userId.split("@")[0] || "User",
        createdAt: new Date().toISOString(),
        subscription: {
          tier: "free",
          status: "active",
          searchesUsedToday: 0,
          lastSearchReset: new Date().toISOString(),
        },
        preferences: {
          theme: "system",
          notifications: true,
          verseCategories: [],
        },
      }

      try {
        await initializeUserData(userId, defaultUserData)
        userData = defaultUserData
      } catch (initError) {
        console.error("Error initializing user data:", initError)
        return NextResponse.json({ error: "Failed to initialize user data" }, { status: 500 })
      }
    }

    // Update usage tracking
    const success = await updateUsageTracking(userId, type)

    if (!success) {
      return NextResponse.json({ error: "Usage limit exceeded", limitExceeded: true }, { status: 429 })
    }

    // Get updated user data
    const updatedUserData = await getUserData(userId)

    return NextResponse.json({
      success: true,
      usage: updatedUserData
        ? {
            searches: updatedUserData.subscription.searchesUsedToday || 0,
            tier: updatedUserData.subscription.tier || "free",
            limit: getTierLimit(updatedUserData.subscription.tier || "free"),
          }
        : { searches: 0, tier: "free", limit: 5 },
    })
  } catch (error) {
    console.error("Error in POST /api/usage/track:", error)
    return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
  }
}
