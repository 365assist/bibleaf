import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    console.log("Daily verse API called")

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      console.error("Missing userId parameter")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("Getting daily verse for user:", userId)

    // Get daily verse from AI service
    const verse = await aiService.getDailyVerse()
    console.log("Daily verse retrieved:", verse)

    const response = {
      success: true,
      verse,
      timestamp: new Date().toISOString(),
    }

    console.log("Sending daily verse response:", response)

    return NextResponse.json(response, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error in daily verse API:", error)

    // Return a fallback verse if AI service fails
    const fallbackVerse = {
      reference: "Jeremiah 29:11",
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      translation: "NIV",
    }

    return NextResponse.json(
      {
        success: true,
        verse: fallbackVerse,
        fallback: true,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
