import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { getUserData } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Get user preferences if available
    let preferences: string[] = []
    if (userId) {
      const userData = await getUserData(userId)
      preferences = userData?.preferences?.verseCategories || []
    }

    // Get daily verse
    const dailyVerse = await aiService.getDailyVerse(preferences)

    return NextResponse.json({
      success: true,
      verse: dailyVerse,
      date: new Date().toISOString().split("T")[0],
    })
  } catch (error) {
    console.error("Error getting daily verse:", error)
    return NextResponse.json({ error: "Failed to get daily verse" }, { status: 500 })
  }
}
