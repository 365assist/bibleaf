import { NextResponse } from "next/server"
import { bibleServerService } from "@/lib/bible-server-service"

export async function GET() {
  try {
    const stats = bibleServerService.getBibleStats()
    const translations = bibleServerService.getAvailableTranslations()

    return NextResponse.json({
      success: true,
      stats,
      translations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting Bible stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Bible statistics",
      },
      { status: 500 },
    )
  }
}
