import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, userId } = body

    if (!query || !userId) {
      return NextResponse.json({ error: "Query and user ID are required" }, { status: 400 })
    }

    // Check usage limits
    const usageAllowed = await updateUsageTracking(userId, "search")
    if (!usageAllowed) {
      return NextResponse.json(
        {
          error: "Daily search limit exceeded",
          limitExceeded: true,
          message: "You've reached your daily search limit. Upgrade your plan for unlimited searches.",
        },
        { status: 429 },
      )
    }

    // Perform AI search
    const results = await aiService.searchBible(query)

    return NextResponse.json({
      success: true,
      query,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI search:", error)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}
