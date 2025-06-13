import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { aiService } from "@/lib/ai-service"

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

    console.log(`=== Bible Search API ===`)
    console.log(`Query: "${query}"`)
    console.log(`Translation: ${translation}`)
    console.log(`Limit: ${limit}`)

    let results = []
    let searchMethod = "unknown"

    try {
      // First, try comprehensive AI search (which includes blob storage)
      console.log("Trying AI service comprehensive search...")
      const aiResults = await aiService.searchBible(query)

      if (aiResults && aiResults.length > 0) {
        console.log(`AI service found ${aiResults.length} results`)
        results = aiResults.map((result) => ({
          book: result.reference.split(" ")[0].toLowerCase(),
          chapter: Number.parseInt(result.reference.split(" ")[1]?.split(":")[0] || "1"),
          verse: Number.parseInt(result.reference.split(":")[1] || "1"),
          text: result.text,
          translation: translation.toUpperCase(),
          reference: result.reference,
          relevanceScore: result.relevanceScore,
          context: result.context,
        }))
        searchMethod = "ai-service"
      }
    } catch (error) {
      console.error("AI service search failed:", error)
    }

    // If AI service didn't return results, try direct blob search
    if (results.length === 0) {
      try {
        console.log("Trying direct blob storage search...")
        const blobResults = await bibleBlobService.searchBible(translation, query, limit)

        if (blobResults && blobResults.length > 0) {
          console.log(`Blob service found ${blobResults.length} results`)
          results = blobResults.map((verse) => ({
            ...verse,
            reference: `${verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} ${verse.chapter}:${verse.verse}`,
            relevanceScore: 0.8,
            context: `This verse from ${verse.book} provides biblical wisdom and guidance.`,
          }))
          searchMethod = "blob-storage"
        }
      } catch (error) {
        console.error("Blob storage search failed:", error)
      }
    }

    // If still no results, try getting available translations and search them
    if (results.length === 0) {
      try {
        console.log("Trying multi-translation search...")
        const translations = await bibleBlobService.listAvailableTranslations()
        console.log("Available translations:", translations)

        for (const translationId of translations.slice(0, 3)) {
          // Try first 3 translations
          try {
            const verses = await bibleBlobService.searchBible(translationId, query, 10)
            if (verses && verses.length > 0) {
              console.log(`Found ${verses.length} results in ${translationId}`)
              results.push(
                ...verses.map((verse) => ({
                  ...verse,
                  reference: `${verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} ${verse.chapter}:${verse.verse}`,
                  relevanceScore: 0.7,
                  context: `This verse from ${verse.book} provides biblical wisdom and guidance.`,
                })),
              )
              searchMethod = "multi-translation"
              break
            }
          } catch (error) {
            console.error(`Error searching ${translationId}:`, error)
            continue
          }
        }
      } catch (error) {
        console.error("Multi-translation search failed:", error)
      }
    }

    console.log(`Final results: ${results.length} verses found using ${searchMethod}`)

    return NextResponse.json({
      success: true,
      results: results.slice(0, limit),
      query,
      translation: translation.toUpperCase(),
      count: results.length,
      source: searchMethod,
      debug: {
        searchMethod,
        originalQuery: query,
        translationsAvailable: await bibleBlobService.listAvailableTranslations().catch(() => []),
      },
    })
  } catch (error) {
    console.error("Error in Bible search API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search Bible",
        results: [],
        debug: {
          errorMessage: error.message,
          errorStack: error.stack,
        },
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

    // Use the same logic as POST
    const postResponse = await POST(
      new Request(request.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, translation, limit }),
      }),
    )

    const data = await postResponse.json()

    return NextResponse.json({
      success: data.success,
      verses: data.results || [],
      query: data.query,
      translation: data.translation,
      count: data.count || 0,
      source: data.source,
      debug: data.debug,
    })
  } catch (error) {
    console.error("Error in Bible search GET API:", error)
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
