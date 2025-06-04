import { NextResponse } from "next/server"
import { bibleAPIService } from "@/lib/bible-api-service"

export async function GET() {
  try {
    const translations = bibleAPIService.getAvailableTranslations()

    return NextResponse.json({
      success: true,
      translations,
      count: translations.length,
    })
  } catch (error) {
    console.error("Error fetching translations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch translations",
        translations: [],
      },
      { status: 500 },
    )
  }
}
