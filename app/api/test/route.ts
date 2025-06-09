import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Backend API is working correctly",
      timestamp: new Date().toISOString(),
      endpoints: {
        bibleSearch: "/api/bible/search",
        bibleStats: "/api/bible/stats",
        bibleVerse: "/api/bible/verse",
        bibleChapter: "/api/bible/chapter",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Backend API error",
      },
      { status: 500 },
    )
  }
}
