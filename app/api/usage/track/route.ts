import { type NextRequest, NextResponse } from "next/server"
import { getUserData, initializeUserData } from "@/lib/blob-storage"

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
          guidanceUsedToday: 0,
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
            guidance: 0,
            tier: "free",
            searchLimit: 5,
            guidanceLimit: 5,
          },
        })
      }
    }

    // Get limits based on subscription tier
    const limits = getUsageLimits(userData.subscription.tier || "free")

    // Return current usage data
    return NextResponse.json({
      usage: {
        searches: userData.subscription.searchesUsedToday || 0,
        guidance: userData.subscription.guidanceUsedToday || 0,
        tier: userData.subscription.tier || "free",
        searchLimit: limits.searches,
        guidanceLimit: limits.guidance,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/usage/track:", error)

    // Return default values on error
    return NextResponse.json({
      usage: {
        searches: 0,
        guidance: 0,
        tier: "free",
        searchLimit: 5,
        guidanceLimit: 5,
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
      return NextResponse.json({ error: "Valid type is required (search or guidance)" }, { status: 400 })
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
          guidanceUsedToday: 0,
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

    // Check if it's a new day and reset counters if needed
    const today = new Date().toISOString().split("T")[0]
    const lastReset = userData.subscription.lastSearchReset.split("T")[0]

    if (today !== lastReset) {
      console.log(`Resetting usage counters for ${userId} - new day detected`)
      userData.subscription.searchesUsedToday = 0
      userData.subscription.guidanceUsedToday = 0
      userData.subscription.lastSearchReset = new Date().toISOString()

      // Save the reset counters
      try {
        await saveUserData(userData)
      } catch (saveError) {
        console.error("Error saving reset counters:", saveError)
      }
    }

    // Get limits based on subscription tier
    const limits = getUsageLimits(userData.subscription.tier || "free")

    // Check if user has exceeded their limit
    if (type === "search") {
      if (userData.subscription.searchesUsedToday >= limits.searches) {
        console.log(
          `User ${userId} has exceeded search limit: ${userData.subscription.searchesUsedToday}/${limits.searches}`,
        )
        return NextResponse.json(
          {
            limitExceeded: true,
            message: `You've reached your daily limit of ${limits.searches} searches on the ${userData.subscription.tier} plan.`,
            usage: {
              searches: userData.subscription.searchesUsedToday,
              limit: limits.searches,
              tier: userData.subscription.tier,
            },
          },
          { status: 429 },
        )
      }
    } else if (type === "guidance") {
      if (userData.subscription.guidanceUsedToday >= limits.guidance) {
        console.log(
          `User ${userId} has exceeded guidance limit: ${userData.subscription.guidanceUsedToday}/${limits.guidance}`,
        )
        return NextResponse.json(
          {
            limitExceeded: true,
            message: `You've reached your daily limit of ${limits.guidance} guidance requests on the ${userData.subscription.tier} plan.`,
            usage: {
              guidance: userData.subscription.guidanceUsedToday,
              limit: limits.guidance,
              tier: userData.subscription.tier,
            },
          },
          { status: 429 },
        )
      }
    }

    // Increment the appropriate counter
    if (type === "search") {
      userData.subscription.searchesUsedToday = (userData.subscription.searchesUsedToday || 0) + 1
      console.log(`Incremented search count for ${userId} to ${userData.subscription.searchesUsedToday}`)
    } else if (type === "guidance") {
      userData.subscription.guidanceUsedToday = (userData.subscription.guidanceUsedToday || 0) + 1
      console.log(`Incremented guidance count for ${userId} to ${userData.subscription.guidanceUsedToday}`)
    }

    // Save the updated user data
    try {
      await saveUserData(userData)
    } catch (saveError) {
      console.error("Error saving updated usage:", saveError)
      return NextResponse.json({ error: "Failed to update usage tracking" }, { status: 500 })
    }

    // Return success with updated usage
    return NextResponse.json({
      success: true,
      usage: {
        searches: userData.subscription.searchesUsedToday || 0,
        guidance: userData.subscription.guidanceUsedToday || 0,
        tier: userData.subscription.tier || "free",
        searchLimit: limits.searches,
        guidanceLimit: limits.guidance,
      },
    })
  } catch (error) {
    console.error("Error in POST /api/usage/track:", error)
    return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
  }
}

// Helper function to get usage limits based on subscription tier
function getUsageLimits(tier: string) {
  switch (tier) {
    case "premium":
    case "annual":
      return { searches: Number.POSITIVE_INFINITY, guidance: Number.POSITIVE_INFINITY }
    case "basic":
      return { searches: 50, guidance: 25 }
    case "free":
    default:
      return { searches: 5, guidance: 5 }
  }
}

// Helper function to save user data
async function saveUserData(userData: any) {
  const { updateUsageTracking, getUserData, initializeUserData, saveUserData } = await import("@/lib/blob-storage")
  return saveUserData(userData)
}
