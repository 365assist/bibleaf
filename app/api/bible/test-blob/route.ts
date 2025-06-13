import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Testing Bible Blob Storage ===")

    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    }

    // Test 1: List available translations
    try {
      console.log("Test 1: Listing available translations...")
      const translations = await bibleBlobService.listAvailableTranslations()
      results.tests.push({
        name: "List Translations",
        success: true,
        result: translations,
        count: translations.length,
      })
      console.log("Available translations:", translations)
    } catch (error) {
      results.tests.push({
        name: "List Translations",
        success: false,
        error: error.message,
      })
      console.error("Translation list failed:", error)
    }

    // Test 2: Get Bible stats
    try {
      console.log("Test 2: Getting Bible stats...")
      const stats = await bibleBlobService.getBibleStats()
      results.tests.push({
        name: "Bible Stats",
        success: true,
        result: stats,
      })
      console.log("Bible stats:", stats)
    } catch (error) {
      results.tests.push({
        name: "Bible Stats",
        success: false,
        error: error.message,
      })
      console.error("Bible stats failed:", error)
    }

    // Test 3: Search for a simple term
    try {
      console.log("Test 3: Searching for 'love'...")
      const searchResults = await bibleBlobService.searchBible("kjv", "love", 5)
      results.tests.push({
        name: "Search 'love'",
        success: true,
        result: searchResults,
        count: searchResults.length,
      })
      console.log("Search results:", searchResults.length, "verses found")
    } catch (error) {
      results.tests.push({
        name: "Search 'love'",
        success: false,
        error: error.message,
      })
      console.error("Search failed:", error)
    }

    // Test 4: Get a specific verse
    try {
      console.log("Test 4: Getting John 3:16...")
      const verse = await bibleBlobService.getVerse("kjv", "john", 3, 16)
      results.tests.push({
        name: "Get John 3:16",
        success: !!verse,
        result: verse,
      })
      console.log("John 3:16:", verse)
    } catch (error) {
      results.tests.push({
        name: "Get John 3:16",
        success: false,
        error: error.message,
      })
      console.error("Get verse failed:", error)
    }

    // Test 5: Check data availability
    try {
      console.log("Test 5: Checking data availability...")
      const availability = await bibleBlobService.checkBibleDataAvailability()
      results.tests.push({
        name: "Data Availability",
        success: true,
        result: availability,
      })
      console.log("Data availability:", availability)
    } catch (error) {
      results.tests.push({
        name: "Data Availability",
        success: false,
        error: error.message,
      })
      console.error("Data availability check failed:", error)
    }

    const successCount = results.tests.filter((t) => t.success).length
    const totalTests = results.tests.length

    return NextResponse.json({
      success: successCount > 0,
      summary: `${successCount}/${totalTests} tests passed`,
      results,
      recommendations:
        successCount === 0
          ? [
              "Check if BLOB_READ_WRITE_TOKEN environment variable is set",
              "Verify Bible data has been uploaded to Vercel Blob storage",
              "Run the bible upload scripts to populate the database",
              "Check network connectivity to Vercel Blob storage",
            ]
          : successCount < totalTests
            ? [
                "Some tests failed - check individual test results",
                "Verify all Bible translations are properly uploaded",
                "Check blob storage permissions and access",
              ]
            : ["All tests passed! Bible search should be working properly"],
    })
  } catch (error) {
    console.error("Blob test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test blob storage",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
