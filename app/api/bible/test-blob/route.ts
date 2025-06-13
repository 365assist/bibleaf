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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "List Translations",
        success: false,
        error: error.message || "Unknown error occurred",
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "Bible Stats",
        success: false,
        error: error.message || "Unknown error occurred",
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "Search 'love'",
        success: false,
        error: error.message || "Unknown error occurred",
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "Get John 3:16",
        success: false,
        error: error.message || "Unknown error occurred",
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "Data Availability",
        success: false,
        error: error.message || "Unknown error occurred",
      })
      console.error("Data availability check failed:", error)
    }

    // Test 6: Check environment variables
    try {
      console.log("Test 6: Checking environment variables...")
      const blobTokenExists = !!process.env.BLOB_READ_WRITE_TOKEN
      results.tests.push({
        name: "Environment Variables",
        success: true,
        result: {
          BLOB_READ_WRITE_TOKEN_EXISTS: blobTokenExists,
          BLOB_READ_WRITE_TOKEN_LENGTH: blobTokenExists ? process.env.BLOB_READ_WRITE_TOKEN.length : 0,
        },
      })
      console.log("Environment variables check:", { blobTokenExists })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      results.tests.push({
        name: "Environment Variables",
        success: false,
        error: error.message || "Unknown error occurred",
      })
      console.error("Environment variables check failed:", error)
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
  } catch (err) {
    // Improved error handling for the main try/catch
    const error = err instanceof Error ? err : new Error(String(err))
    console.error("Blob test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test blob storage",
        details: error.message || "Unknown error occurred",
        // Don't include stack trace in production for security reasons
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
