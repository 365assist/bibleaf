import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, translation = "kjv", limit = 20 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
        },
        { status: 400 },
      )
    }

    console.log(`Searching Bible in blob storage: "${query}" in ${translation}`)
    const results = await bibleBlobService.searchBible(translation, query, limit)

    return NextResponse.json({
      success: true,
      results,
      query,
      translation: translation.toUpperCase(),
      count: results.length,
      source: "blob-storage",
    })
  } catch (error) {
    console.error("Error searching Bible:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search Bible",
        results: [],
      },
      { status: 500 },
    )
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const translation = searchParams.get("translation") || "kjv"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
        },
        { status: 400 },
      )
    }

    console.log(`Searching Bible in blob storage: "${query}" in ${translation}`)
    const results = await bibleBlobService.searchBible(translation, query, limit)

    return NextResponse.json({
      success: true,
      verses: results,
      query,
      translation: translation.toUpperCase(),
      count: results.length,
      source: "blob-storage",
    })
  } catch (error) {
    console.error("Error searching Bible:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search Bible",
        verses: [],
      },
      { status: 500 },
    )
  }
}
