import { type NextRequest, NextResponse } from "next/server"
import { bibleLocalService } from "@/lib/bible-local-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, translation = "kjv", limit = 10 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    console.log(`Searching local Bible: "${query}" in ${translation}`)
    const results = await bibleLocalService.searchBible(query, translation, limit)

    return NextResponse.json({
      success: true,
      results,
      query,
      translation: translation.toUpperCase(),
      count: results.length,
      source: "local-database",
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
