import { type NextRequest, NextResponse } from "next/server"
import { bibleLocalService } from "@/lib/bible-local-service"
import { BibleService } from "@/lib/bible-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const translation = searchParams.get("translation") || "kjv"

    if (!book || !chapterParam) {
      return NextResponse.json({ error: "Book and chapter parameters are required" }, { status: 400 })
    }

    const chapter = Number.parseInt(chapterParam)
    if (isNaN(chapter)) {
      return NextResponse.json({ error: "Chapter must be a valid number" }, { status: 400 })
    }

    // Validate book and chapter using our Bible service
    const bookInfo = BibleService.getBook(book)
    if (!bookInfo) {
      return NextResponse.json({ error: "Invalid book name" }, { status: 400 })
    }

    if (!BibleService.isValidChapter(book, chapter)) {
      return NextResponse.json({ error: "Invalid chapter number" }, { status: 400 })
    }

    // Get chapter from local Bible service
    console.log(`Fetching ${book} ${chapter} in ${translation}`)
    const chapterData = await bibleLocalService.getChapter(book, chapter, translation)

    if (!chapterData) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // Add navigation info
    const nextChapter = BibleService.getNextChapter(book, chapter)
    const prevChapter = BibleService.getPreviousChapter(book, chapter)

    const response = {
      book: bookInfo.name,
      chapter,
      translation: translation.toUpperCase(),
      verses: chapterData.verses,
      navigation: {
        previous: prevChapter,
        next: nextChapter,
        bookInfo: {
          name: bookInfo.name,
          chapters: bookInfo.chapters,
          testament: bookInfo.testament,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching Bible chapter:", error)
    return NextResponse.json({ error: "Failed to fetch chapter" }, { status: 500 })
  }
}
