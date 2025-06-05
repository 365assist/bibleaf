import { NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function GET() {
  try {
    console.log("Fetching available Bible translations from blob storage...")
    const translationIds = await bibleBlobService.listAvailableTranslations()

    // Get translation metadata
    const translations = []
    for (const id of translationIds) {
      const bibleData = await bibleBlobService.downloadBibleTranslation(id)
      if (bibleData) {
        translations.push(bibleData.translation)
      }
    }

    return NextResponse.json({
      success: true,
      translations,
      count: translations.length,
    })
  } catch (error) {
    console.error("Error fetching Bible translations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Bible translations",
        translations: [],
      },
      { status: 500 },
    )
  }
}
