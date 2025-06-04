import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const translation = searchParams.get("translation") || "kjv"

    console.log(`Getting books for translation: ${translation}`)
    const books = await bibleBlobService.getBooks(translation)

    return NextResponse.json({
      success: true,
      books,
      translation,
    })
  } catch (error) {
    console.error("Error getting Bible books:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Bible books",
      },
      { status: 500 },
    )
  }
}
