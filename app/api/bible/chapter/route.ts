import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

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

    console.log(`Fetching ${bookParam} ${chapter} in ${translation} from blob storage`)

    // Get chapter from blob storage (the service now handles book name normalization internally)
    const chapterData = await bibleBlobService.getChapter(translation, bookParam, chapter)

    if (!chapterData) {
      // Try to get available books and chapters for debugging
      try {
        const availableBooks = await bibleBlobService.getBooks(translation)
        const availableTranslations = await bibleBlobService.listAvailableTranslations()

        console.log("Available translations:", availableTranslations)
        console.log("Available books:", availableBooks.map((b) => b.id).slice(0, 20))

        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion: `Try one of these popular chapters: John 3, Psalms 23, Genesis 1, Matthew 5, Romans 8, Philippians 4`,
            debug: {
              requestedBook: bookParam,
              chapter,
              translation,
              availableTranslations,
              availableBooks: availableBooks.map((b) => `${b.id} (${b.name})`).slice(0, 15),
              popularChapters: [
                "john/3",
                "psalms/23",
                "genesis/1",
                "matthew/5",
                "romans/8",
                "philippians/4",
                "proverbs/3",
                "1corinthians/13",
                "ephesians/6",
              ],
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
            suggestion:
              "The Bible database may need to be initialized. Try uploading sample data or running the Bible download scripts.",
            debug: {
              requestedBook: bookParam,
              chapter,
              translation,
              note: "Bible data may not be properly loaded",
            },
          },
          { status: 404 },
        )
      }
    }

    const response = {
      success: true,
      book: chapterData.book,
      chapter: chapterData.chapter,
      translation: chapterData.translation,
      verses: chapterData.verses,
      bookDisplayName: chapterData.book, // The service will handle proper display names
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
        suggestion: "Please check if the Bible data is properly loaded and try again.",
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

    console.log(`POST Fetching ${bookParam} ${chapter} in ${translation} from blob storage`)

    // Get chapter from blob storage (the service now handles book name normalization internally)
    const chapterData = await bibleBlobService.getChapter(translation, bookParam, chapter)

    if (!chapterData) {
      // Try to get available books and chapters for debugging
      try {
        const availableBooks = await bibleBlobService.getBooks(translation)
        const availableTranslations = await bibleBlobService.listAvailableTranslations()

        console.log("POST Available translations:", availableTranslations)
        console.log("POST Available books:", availableBooks.map((b) => b.id).slice(0, 20))

        return NextResponse.json(
          {
            success: false,
            error: `Chapter not found: ${bookParam} ${chapter} in ${translation}`,
            suggestion: `Try one of these popular chapters: John 3, Psalms 23, Genesis 1, Matthew 5, Romans 8, Philippians 4`,
            debug: {
              requestedBook: bookParam,
              chapter,
              translation,
              availableTranslations,
              availableBooks: availableBooks.map((b) => `${b.id} (${b.name})`).slice(0, 15),
              popularChapters: [
                "john/3",
                "psalms/23",
                "genesis/1",
                "matthew/5",
                "romans/8",
                "philippians/4",
                "proverbs/3",
                "1corinthians/13",
                "ephesians/6",
              ],
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
            suggestion:
              "The Bible database may need to be initialized. Try uploading sample data or running the Bible download scripts.",
            debug: {
              requestedBook: bookParam,
              chapter,
              translation,
              note: "Bible data may not be properly loaded",
            },
          },
          { status: 404 },
        )
      }
    }

    const response = {
      success: true,
      book: chapterData.book,
      chapter: chapterData.chapter,
      translation: chapterData.translation,
      verses: chapterData.verses,
      bookDisplayName: chapterData.book, // The service will handle proper display names
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
        suggestion: "Please check if the Bible data is properly loaded and try again.",
      },
      { status: 500 },
    )
  }
}
