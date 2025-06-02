import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Conversational AI Guidance API Route Called ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { message, userId, conversationHistory = [], context = [] } = body

    console.log("Extracted message:", message)
    console.log("Extracted userId:", userId)
    console.log("Conversation history length:", conversationHistory.length)
    console.log("Context:", context)

    if (!message || !userId) {
      console.error("Missing required fields:", { message: !!message, userId: !!userId })
      return NextResponse.json(
        {
          error: "Message and user ID are required",
          received: { message: !!message, userId: !!userId },
        },
        { status: 400 },
      )
    }

    console.log("Checking usage limits for user:", userId)

    // Check usage limits
    const usageAllowed = await updateUsageTracking(userId, "guidance")
    console.log("Usage allowed:", usageAllowed)

    if (!usageAllowed) {
      console.log("Usage limit exceeded for user:", userId)
      return NextResponse.json(
        {
          error: "Daily guidance limit exceeded",
          limitExceeded: true,
          message: "You've reached your daily guidance limit. Upgrade your plan for unlimited guidance.",
        },
        { status: 429 },
      )
    }

    console.log("Getting conversational AI guidance")

    // Get conversational AI guidance
    const guidanceResult = await aiService.getConversationalGuidance(message, conversationHistory, context)
    console.log("AI guidance result:", guidanceResult)

    const response = {
      success: true,
      message,
      guidance: guidanceResult.guidance,
      verses: guidanceResult.relevantVerses || [],
      practicalSteps: guidanceResult.practicalSteps || [],
      prayerSuggestion: guidanceResult.prayerSuggestion,
      followUpQuestions: guidanceResult.followUpQuestions || [],
      timestamp: new Date().toISOString(),
    }

    console.log("Sending response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in conversational AI guidance API:", error)

    const isDevelopment = process.env.NODE_ENV === "development"

    return NextResponse.json(
      {
        error: "Failed to get guidance",
        ...(isDevelopment && {
          details: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 },
    )
  }
}
