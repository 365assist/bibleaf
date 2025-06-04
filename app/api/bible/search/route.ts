import { type NextRequest, NextResponse } from "next/server"
import { bibleAPIService } from "@/lib/bible-api-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, translation = "ESV", limit = 10 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    console.log(`Searching Bible: "${query}" in ${translation}`)
    const results = await bibleAPIService.searchBible(query, translation, limit)

    return NextResponse.json({
      success: true,
      results,
      query,
      translation,
      count: results.length,
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
