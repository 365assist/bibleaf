import { NextResponse } from "next/server"
import { bibleLocalService } from "@/lib/bible-local-service"

export async function GET() {
  try {
    const stats = bibleLocalService.getStats()
    const translations = bibleLocalService.getAvailableTranslations()
    const books = bibleLocalService.getBooks()

    return NextResponse.json({
      success: true,
      database: {
        isReady: bibleLocalService.isReady(),
        ...stats,
      },
      translations: translations.length,
      books: books.length,
      availableTranslations: translations,
      testaments: {
        old: books.filter((b) => b.testament === "old").length,
        new: books.filter((b) => b.testament === "new").length,
      },
    })
  } catch (error) {
    console.error("Error fetching Bible stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Bible statistics",
      },
      { status: 500 },
    )
  }
}
