import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { BibleService } from "@/lib/bible-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const translation = searchParams.get("translation") || "kjv"

    if (!book || !chapterParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Book and chapter parameters are required",
        },
        { status: 400 },
      )
    }

    const chapter = Number.parseInt(chapterParam)
    if (isNaN(chapter)) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter must be a valid number",
        },
        { status: 400 },
      )
    }

    // Get chapter from blob storage
    console.log(`Fetching ${book} ${chapter} in ${translation} from blob storage`)
    const chapterData = await bibleBlobService.getChapter(translation, book, chapter)

    if (!chapterData) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 },
      )
    }

    // Add navigation info if BibleService is available
    let navigation = null
    try {
      const bookInfo = BibleService.getBook(book)
      if (bookInfo) {
        const nextChapter = BibleService.getNextChapter(book, chapter)
        const prevChapter = BibleService.getPreviousChapter(book, chapter)

        navigation = {
          previous: prevChapter,
          next: nextChapter,
          bookInfo: {
            name: bookInfo.name,
            chapters: bookInfo.chapters,
            testament: bookInfo.testament,
          },
        }
      }
    } catch (error) {
      console.warn("Could not add navigation info:", error)
    }

    const response = {
      success: true,
      book: chapterData.book,
      chapter: chapterData.chapter,
      translation: chapterData.translation,
      verses: chapterData.verses,
      navigation,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching Bible chapter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chapter",
      },
      { status: 500 },
    )
  }
}
