import { type NextRequest, NextResponse } from "next/server"
import { bibleServerService } from "@/lib/bible-server-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const translation = searchParams.get("translation") || "kjv"

    console.log(`Fetching daily verse in ${translation}`)
    const dailyVerse = bibleServerService.getDailyVerse(translation)

    if (!dailyVerse) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily verse not available",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      verse: dailyVerse,
      date: new Date().toISOString().split("T")[0],
    })
  } catch (error) {
    console.error("Error fetching daily verse:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch daily verse",
      },
      { status: 500 },
    )
  }
}
