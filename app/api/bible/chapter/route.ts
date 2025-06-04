import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { normalizeBookName, getBookInfo } from "@/lib/bible-book-mapping"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookParam = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const translation = searchParams.get("translation") || "kjv"

    console.log("API Request:", { bookParam, chapterParam, translation })

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
    console.log("Normalized book:", { original: bookParam, normalized: normalizedBook })

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
      // Try to get available books and chapters for debugging
      try {
        const availableBooks = await bibleBlobService.getBooks(translation)
        const bibleData = await bibleBlobService.downloadBibleTranslation(translation)

        let availableChapters: number[] = []
        if (bibleData && bibleData.books[normalizedBook]) {
          availableChapters = Object.keys(bibleData.books[normalizedBook])
            .map(Number)
            .sort((a, b) => a - b)
        }

        console.log(
          "Available books:",
          availableBooks.map((b) => b.id),
        )
        console.log(`Available chapters for ${normalizedBook}:`, availableChapters)

        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion:
              availableChapters.length > 0
                ? `Available chapters for ${bookParam}: ${availableChapters.join(", ")}`
                : `Book ${bookParam} is available but no chapters found. Try uploading sample data.`,
            debug: {
              requestedBook: bookParam,
              normalizedBook,
              chapter,
              translation,
              availableBooks: availableBooks.map((b) => b.id).slice(0, 10),
              availableChapters: availableChapters.slice(0, 10),
            },
          },
          { status: 404 },
        )
      } catch (debugError) {
        console.error("Error getting debug info:", debugError)
        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion: "Try uploading sample data using the 'Upload Sample Data' button.",
          },
          { status: 404 },
        )
      }
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

    console.log("API Response success:", {
      book: response.book,
      chapter: response.chapter,
      verseCount: response.verses.length,
    })

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

// Add POST method to handle both GET and POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { book: bookParam, chapter: chapterParam, translation = "kjv" } = body

    console.log("POST API Request:", { bookParam, chapterParam, translation })

    if (!bookParam || !chapterParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Book and chapter parameters are required",
        },
        { status: 400 },
      )
    }

    const chapter = Number.parseInt(chapterParam.toString())
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
    console.log("POST Normalized book:", { original: bookParam, normalized: normalizedBook })

    if (!normalizedBook) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown book: ${bookParam}`,
        },
        { status: 400 },
      )
    }

    console.log(`POST Fetching ${normalizedBook} ${chapter} in ${translation} from blob storage`)

    // Get chapter from blob storage
    const chapterData = await bibleBlobService.getChapter(translation, normalizedBook, chapter)

    if (!chapterData) {
      // Try to get available books and chapters for debugging
      try {
        const availableBooks = await bibleBlobService.getBooks(translation)
        const bibleData = await bibleBlobService.downloadBibleTranslation(translation)

        let availableChapters: number[] = []
        if (bibleData && bibleData.books[normalizedBook]) {
          availableChapters = Object.keys(bibleData.books[normalizedBook])
            .map(Number)
            .sort((a, b) => a - b)
        }

        console.log(
          "POST Available books:",
          availableBooks.map((b) => b.id),
        )
        console.log(`POST Available chapters for ${normalizedBook}:`, availableChapters)

        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion:
              availableChapters.length > 0
                ? `Available chapters for ${bookParam}: ${availableChapters.join(", ")}`
                : `Book ${bookParam} is available but no chapters found. Try uploading sample data.`,
            debug: {
              requestedBook: bookParam,
              normalizedBook,
              chapter,
              translation,
              availableBooks: availableBooks.map((b) => b.id).slice(0, 10),
              availableChapters: availableChapters.slice(0, 10),
            },
          },
          { status: 404 },
        )
      } catch (debugError) {
        console.error("POST Error getting debug info:", debugError)
        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion: "Try uploading sample data using the 'Upload Sample Data' button.",
          },
          { status: 404 },
        )
      }
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
      console.warn("POST Could not add navigation info:", error)
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

    console.log("POST API Response success:", {
      book: response.book,
      chapter: response.chapter,
      verseCount: response.verses.length,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("POST Error fetching Bible chapter:", error)
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
