import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    console.log("AI Search API called")

    const body = await request.json()
    const { query, userId } = body

    console.log("Search request:", { query, userId })

    if (!query || !userId) {
      console.error("Missing query or userId:", { query: !!query, userId: !!userId })
      return NextResponse.json({ error: "Query and user ID are required" }, { status: 400 })
    }

    // Check usage limits
    console.log("Checking usage limits for user:", userId)
    const usageAllowed = await updateUsageTracking(userId, "search")
    if (!usageAllowed) {
      console.log("Usage limit exceeded for user:", userId)
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
    console.log("Performing AI search for query:", query)
    const results = await aiService.searchBible(query)
    console.log("AI search results:", results)

    const response = {
      success: true,
      query,
      results,
      timestamp: new Date().toISOString(),
    }

    console.log("Sending response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in AI search API:", error)
    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
