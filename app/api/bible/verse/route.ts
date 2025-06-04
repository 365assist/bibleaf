import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

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
      console.log(`Getting random verse in ${translation} from blob storage`)
      const verse = await bibleBlobService.getRandomVerse(translation)

      if (!verse) {
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
        verse,
        source: "blob-storage",
      })
    }

    // Handle specific verse request
    if (!book || !chapterParam || !verseParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Book, chapter, and verse parameters are required (or use random=true)",
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

    console.log(`Getting ${book} ${chapter}:${verse} in ${translation} from blob storage`)
    const verseData = await bibleBlobService.getVerse(translation, book, chapter, verse)

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
      source: "blob-storage",
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
