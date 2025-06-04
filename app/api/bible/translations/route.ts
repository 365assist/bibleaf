import { NextResponse } from "next/server"
import { bibleServerService } from "@/lib/bible-server-service"

export async function GET() {
  try {
    const translations = bibleServerService.getAvailableTranslations()

    return NextResponse.json({
      success: true,
      translations,
      count: translations.length,
    })
  } catch (error) {
    console.error("Error getting Bible translations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Bible translations",
      },
      { status: 500 },
    )
  }
}
