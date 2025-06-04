import { type NextRequest, NextResponse } from "next/server"
import { bibleServerService } from "@/lib/bible-server-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book")
    const chapterParam = searchParams.get("chapter")
    const verseParam = searchParams.get("verse")
    const translation = searchParams.get("translation") || "kjv"
    const random = searchParams.get("random") === "true"

    // Handle random verse request
    if (random) {
      const randomVerse = bibleServerService.getRandomVerse(translation)
      if (!randomVerse) {
        return NextResponse.json(
          {
            success: false,
            error: "Random verse not available",
          },
          { status: 404 },
        )
      }
      return NextResponse.json({
        success: true,
        verse: randomVerse,
      })
    }

    // Handle specific verse request
    if (!book || !chapterParam || !verseParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Book, chapter, and verse parameters are required",
        },
        { status: 400 },
      )
    }

    const chapter = Number.parseInt(chapterParam)
    const verse = Number.parseInt(verseParam)

    if (isNaN(chapter) || isNaN(verse)) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter and verse must be valid numbers",
        },
        { status: 400 },
      )
    }

    const verseData = bibleServerService.getVerse(book, chapter, verse, translation)

    if (!verseData) {
      return NextResponse.json(
        {
          success: false,
          error: "Verse not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      verse: verseData,
    })
  } catch (error) {
    console.error("Error fetching Bible verse:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verse",
      },
      { status: 500 },
    )
  }
}
