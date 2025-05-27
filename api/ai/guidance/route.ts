import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { situation, userId } = body

    if (!situation || !userId) {
      return NextResponse.json({ error: "Situation and user ID are required" }, { status: 400 })
    }

    // Check usage limits
    const usageAllowed = await updateUsageTracking(userId, "guidance")
    if (!usageAllowed) {
      return NextResponse.json(
        {
          error: "Daily guidance limit exceeded",
          limitExceeded: true,
          message: "You've reached your daily guidance limit. Upgrade your plan for unlimited guidance.",
        },
        { status: 429 },
      )
    }

    // Get AI guidance
    const guidance = await aiService.getLifeGuidance(situation)

    return NextResponse.json({
      success: true,
      situation,
      guidance,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI guidance:", error)
    return NextResponse.json({ error: "Failed to get guidance" }, { status: 500 })
  }
}
