import type { NextRequest } from "next/server"
import { aiService } from "@/lib/ai"
import { updateUsageTracking } from "@/lib/usage-tracking"

export async function POST(request: NextRequest) {
  try {
    console.log("=== AI Guidance API Route Called ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { situation, userId } = body

    console.log("Extracted situation:", situation)
    console.log("Extracted userId:", userId)

    if (!situation) {
      console.error("Missing required situation field")
      return new Response(
        JSON.stringify({
          error: "Situation is required",
          received: { situation: !!situation },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Handle demo users or missing userId
    const isDemo = !userId || userId === "demo-user"
    console.log("Is demo user:", isDemo)

    // For demo users, skip usage tracking
    let usageAllowed = true
    if (!isDemo) {
      console.log("Checking usage limits for user:", userId)
      // Check usage limits for authenticated users
      usageAllowed = await updateUsageTracking(userId, "guidance")
      console.log("Usage allowed:", usageAllowed)

      if (!usageAllowed) {
        console.log("Usage limit exceeded for user:", userId)
        return new Response(
          JSON.stringify({
            error: "Daily guidance limit exceeded",
            limitExceeded: true,
            message: "You've reached your daily guidance limit. Upgrade your plan for unlimited guidance.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        )
      }
    }

    console.log("Generating AI Bible guidance")

    // Generate guidance
    const guidance = await aiService.generateGuidance(situation)
    console.log("AI guidance generated:", guidance)

    const response = {
      success: true,
      situation,
      ...guidance,
      timestamp: new Date().toISOString(),
      demo: isDemo,
    }

    console.log("Sending response:", response)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in AI guidance API:", error)

    // Always return valid JSON, even for errors
    const fallbackGuidance = {
      guidance:
        "During times of uncertainty, the Bible encourages us to trust in God's plan and seek His wisdom. Remember that God is always with you, guiding your steps.",
      relevantVerses: [
        {
          reference: "Proverbs 3:5-6",
          text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          context: "Wisdom for daily living and decision-making.",
        },
        {
          reference: "Jeremiah 29:11",
          text: 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
          context: "God's promise of hope and purpose.",
        },
      ],
      practicalSteps: [
        "Take time for prayer and reflection",
        "Seek wisdom from Scripture",
        "Consult with trusted spiritual mentors",
        "Remember God's faithfulness in past situations",
      ],
      prayerSuggestion:
        "Heavenly Father, grant me wisdom and clarity as I navigate this situation. Help me to trust in Your perfect plan and to follow Your guidance. Amen.",
    }

    const errorResponse = {
      success: false,
      error: "Guidance service temporarily unavailable",
      fallback: true,
      ...fallbackGuidance,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
