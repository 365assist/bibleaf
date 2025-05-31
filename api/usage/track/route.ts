import { type NextRequest, NextResponse } from "next/server"
import { updateUsageTracking, getUserData } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userData = await getUserData(userId)
    if (!userData) {
      // Return default usage for demo users
      return NextResponse.json({
        usage: {
          searches: 0,
          guidanceRequests: 0,
          lastReset: new Date().toISOString(),
        },
      })
    }

    const today = new Date().toISOString().split("T")[0]
    const lastReset = userData.subscription.lastSearchReset.split("T")[0]

    // Reset usage if it's a new day
    let searchesUsedToday = userData.subscription.searchesUsedToday
    if (today !== lastReset) {
      searchesUsedToday = 0
    }

    return NextResponse.json({
      usage: {
        searches: searchesUsedToday,
        guidanceRequests: searchesUsedToday, // Using same counter for demo
        lastReset: userData.subscription.lastSearchReset,
      },
    })
  } catch (error) {
    console.error("Error fetching usage data:", error)
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type } = body

    if (!userId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["search", "guidance"].includes(type)) {
      return NextResponse.json({ error: "Invalid usage type" }, { status: 400 })
    }

    const allowed = await updateUsageTracking(userId, type)

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Usage limit exceeded",
          limitExceeded: true,
        },
        { status: 429 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating usage tracking:", error)
    return NextResponse.json({ error: "Failed to update usage tracking" }, { status: 500 })
  }
}
