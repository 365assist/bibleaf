import { type NextRequest, NextResponse } from "next/server"
import { BibleService } from "@/lib/bible-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const translation = searchParams.get("translation") || "NIV"

    if (!book || !chapterParam) {
      return NextResponse.json({ error: "Book and chapter parameters are required" }, { status: 400 })
    }

    const chapter = Number.parseInt(chapterParam)
    if (isNaN(chapter)) {
      return NextResponse.json({ error: "Chapter must be a valid number" }, { status: 400 })
    }

    const chapterData = await BibleService.getChapter(book, chapter, translation)

    if (!chapterData) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    return NextResponse.json(chapterData)
  } catch (error) {
    console.error("Error fetching Bible chapter:", error)
    return NextResponse.json({ error: "Failed to fetch chapter" }, { status: 500 })
  }
}
