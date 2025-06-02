import type { NextRequest } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    console.log("=== AI Search API Route Called ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { query, userId } = body

    console.log("Extracted query:", query)
    console.log("Extracted userId:", userId)

    if (!query || !userId) {
      console.error("Missing required fields:", { query: !!query, userId: !!userId })
      return new Response(
        JSON.stringify({
          error: "Query and user ID are required",
          received: { query: !!query, userId: !!userId },
          results: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("Checking usage limits for user:", userId)

    // Check usage limits
    const usageAllowed = await updateUsageTracking(userId, "search")
    console.log("Usage allowed:", usageAllowed)

    if (!usageAllowed) {
      console.log("Usage limit exceeded for user:", userId)
      return new Response(
        JSON.stringify({
          error: "Daily search limit exceeded",
          limitExceeded: true,
          message: "You've reached your daily search limit. Upgrade your plan for unlimited searches.",
          results: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("Performing AI Bible search")

    // Perform AI search
    const searchResults = await aiService.searchBible(query)
    console.log("AI search results:", searchResults)

    const response = {
      success: true,
      query,
      results: searchResults || [],
      timestamp: new Date().toISOString(),
    }

    console.log("Sending response:", response)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in AI search API:", error)

    // Always return valid JSON, even for errors
    const fallbackResults = [
      {
        reference: "John 3:16",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        relevanceScore: 0.9,
        context: "God's love demonstrated through Christ's sacrifice for humanity's salvation.",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        relevanceScore: 0.85,
        context: "God's sovereign work in all circumstances for believers' ultimate good.",
      },
      {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
        relevanceScore: 0.8,
        context: "Divine empowerment for all of life's challenges through Christ.",
      },
    ]

    const errorResponse = {
      success: false,
      error: "Search service temporarily unavailable",
      fallback: true,
      results: fallbackResults,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
