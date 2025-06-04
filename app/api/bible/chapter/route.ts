import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { normalizeBookName, getBookInfo } from "@/lib/bible-book-mapping"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookParam = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const translation = searchParams.get("translation") || "kjv"

    if (!bookParam || !chapterParam) {
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

    // Normalize book name (e.g., "Psalm" -> "psalms", "1 John" -> "1john")
    const normalizedBook = normalizeBookName(bookParam)
    if (!normalizedBook) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown book: ${bookParam}`,
        },
        { status: 400 },
      )
    }

    console.log(`Fetching ${normalizedBook} ${chapter} in ${translation} from blob storage`)

    // Get chapter from blob storage
    const chapterData = await bibleBlobService.getChapter(translation, normalizedBook, chapter)

    if (!chapterData) {
      // Try to get available books for debugging
      const availableBooks = await bibleBlobService.getBooks(translation)
      console.log(
        "Available books:",
        availableBooks.map((b) => b.id),
      )

      return NextResponse.json(
        {
          success: false,
          error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
          debug: {
            requestedBook: bookParam,
            normalizedBook,
            chapter,
            translation,
            availableBooks: availableBooks.map((b) => b.id).slice(0, 10), // First 10 for debugging
          },
        },
        { status: 404 },
      )
    }

    // Add navigation info
    let navigation = null
    try {
      const bookInfo = getBookInfo(normalizedBook)
      if (bookInfo) {
        // Calculate next/previous chapters
        let nextChapter = null
        let prevChapter = null

        if (chapter < bookInfo.chapters) {
          nextChapter = {
            book: normalizedBook,
            chapter: chapter + 1,
            displayName: `${bookInfo.name} ${chapter + 1}`,
          }
        }

        if (chapter > 1) {
          prevChapter = {
            book: normalizedBook,
            chapter: chapter - 1,
            displayName: `${bookInfo.name} ${chapter - 1}`,
          }
        }

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
      bookDisplayName: getBookInfo(normalizedBook)?.name || bookParam,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching Bible chapter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chapter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
