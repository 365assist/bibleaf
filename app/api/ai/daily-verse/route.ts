import type { NextRequest } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Daily Verse API Route Called ===")

    const url = new URL(request.url)
    const preferences = url.searchParams.get("preferences")
    const userPreferences = preferences ? preferences.split(",") : undefined

    console.log("User preferences:", userPreferences)

    // Get daily verse from AI service
    const dailyVerse = await aiService.getDailyVerse(userPreferences)
    console.log("Daily verse result:", dailyVerse)

    const response = {
      success: true,
      verse: dailyVerse,
      timestamp: new Date().toISOString(),
    }

    console.log("Sending response:", response)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in daily verse API:", error)

    // Always return valid JSON with fallback verse
    const fallbackVerses = [
      {
        reference: "Psalm 118:24",
        text: "This is the day the Lord has made; let us rejoice and be glad in it.",
        relevanceScore: 1.0,
        context: "A reminder to find joy and gratitude in each new day that God has given us.",
      },
      {
        reference: "Lamentations 3:22-23",
        text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
        relevanceScore: 1.0,
        context: "God's mercy and faithfulness are renewed each morning, giving us hope for each new day.",
      },
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        relevanceScore: 1.0,
        context: "God has good plans for our lives, giving us hope and a future filled with His purposes.",
      },
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        relevanceScore: 1.0,
        context: "God provides renewed strength to those who put their hope and trust in Him.",
      },
      {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
        relevanceScore: 1.0,
        context: "Through Christ's strength, we can face any challenge or situation that comes our way.",
      },
    ]

    // Select verse based on day of year for variety
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedVerse = fallbackVerses[dayOfYear % fallbackVerses.length]

    const errorResponse = {
      success: false,
      error: "Daily verse service temporarily unavailable",
      fallback: true,
      verse: selectedVerse,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
