import { type NextRequest, NextResponse } from "next/server"
import { bibleAPIService } from "@/lib/bible-api-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const translation = searchParams.get("translation") || "ESV"

    console.log(`Fetching daily verse in ${translation}`)
    const dailyVerse = await bibleAPIService.getDailyVerse(translation)

    if (!dailyVerse) {
      return NextResponse.json({ error: "Daily verse not available" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      verse: dailyVerse,
      date: new Date().toISOString().split("T")[0],
    })
  } catch (error) {
    console.error("Error fetching daily verse:", error)
    return NextResponse.json({ error: "Failed to fetch daily verse" }, { status: 500 })
  }
}
