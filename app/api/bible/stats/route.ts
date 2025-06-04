import { NextResponse } from "next/server"
import { bibleLocalService } from "@/lib/bible-local-service"

export async function GET() {
  try {
    const stats = await bibleLocalService.getBibleStats()
    const translations = await bibleLocalService.getAvailableTranslations()

    if (!stats) {
      return NextResponse.json({ error: "Bible statistics not available" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      stats,
      translations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting Bible stats:", error)
    return NextResponse.json({ error: "Failed to get Bible statistics" }, { status: 500 })
  }
}
