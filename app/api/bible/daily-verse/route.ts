import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Daily Verse API Route Called ===")

    const url = new URL(request.url)
    const translation = url.searchParams.get("translation") || "kjv"

    console.log("Translation requested:", translation)

    // Get daily verse from blob service
    const dailyVerse = await bibleBlobService.getDailyVerse(translation)

    if (dailyVerse) {
      console.log("Daily verse found:", dailyVerse)

      const response = {
        success: true,
        verse: {
          book: dailyVerse.book,
          bookName: dailyVerse.book.charAt(0).toUpperCase() + dailyVerse.book.slice(1),
          chapter: dailyVerse.chapter,
          verse: dailyVerse.verse,
          text: dailyVerse.text,
          translation: dailyVerse.translation,
        },
        timestamp: new Date().toISOString(),
      }

      console.log("Sending response:", response)
      return NextResponse.json(response)
    }

    // Fallback verse if blob service fails
    console.log("Using fallback verse")
    const fallbackVerse = {
      book: "psalms",
      bookName: "Psalms",
      chapter: 119,
      verse: 105,
      text: "Your word is a lamp for my feet, a light on my path.",
      translation: "NIV",
    }

    return NextResponse.json({
      success: true,
      verse: fallbackVerse,
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  } catch (error) {
    console.error("Error in daily verse API:", error)

    // Always return a valid response with fallback verse
    const fallbackVerse = {
      book: "john",
      bookName: "John",
      chapter: 3,
      verse: 16,
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      translation: "NIV",
    }

    return NextResponse.json({
      success: true,
      verse: fallbackVerse,
      timestamp: new Date().toISOString(),
      fallback: true,
      error: "Service temporarily unavailable",
    })
  }
}
