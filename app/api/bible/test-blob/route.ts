import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { bibleFallbackService } from "@/lib/bible-fallback-service"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Testing Bible Storage Systems ===")

    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
      usingFallback: false,
    }

    // Test environment variables first
    const blobTokenExists = !!process.env.BLOB_READ_WRITE_TOKEN
    results.tests.push({
      name: "Environment Variables",
      success: true,
      result: {
        BLOB_READ_WRITE_TOKEN_EXISTS: blobTokenExists,
        BLOB_READ_WRITE_TOKEN_LENGTH: blobTokenExists ? process.env.BLOB_READ_WRITE_TOKEN.length : 0,
      },
    })

    if (!blobTokenExists) {
      console.log("⚠️  BLOB_READ_WRITE_TOKEN not found, using fallback service")
      results.usingFallback = true

      // Test fallback service
      try {
        console.log("Test: Fallback service search...")
        const searchResults = await bibleFallbackService.searchBible("kjv", "love", 5)
        results.tests.push({
          name: "Fallback Search",
          success: true,
          result: searchResults,
          count: searchResults.length,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Fallback Search",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }

      try {
        console.log("Test: Fallback service stats...")
        const stats = await bibleFallbackService.getBibleStats()
        results.tests.push({
          name: "Fallback Stats",
          success: true,
          result: stats,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Fallback Stats",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }

      try {
        console.log("Test: Fallback get verse...")
        const verse = await bibleFallbackService.getVerse("kjv", "john", 3, 16)
        results.tests.push({
          name: "Fallback Get Verse",
          success: !!verse,
          result: verse,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Fallback Get Verse",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }
    } else {
      // Test blob service
      try {
        console.log("Test: Blob service translations...")
        const translations = await bibleBlobService.listAvailableTranslations()
        results.tests.push({
          name: "Blob Translations",
          success: true,
          result: translations,
          count: translations.length,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Blob Translations",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }

      try {
        console.log("Test: Blob service stats...")
        const stats = await bibleBlobService.getBibleStats()
        results.tests.push({
          name: "Blob Stats",
          success: true,
          result: stats,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Blob Stats",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }

      try {
        console.log("Test: Blob service search...")
        const searchResults = await bibleBlobService.searchBible("kjv", "love", 5)
        results.tests.push({
          name: "Blob Search",
          success: true,
          result: searchResults,
          count: searchResults.length,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        results.tests.push({
          name: "Blob Search",
          success: false,
          error: error.message || "Unknown error occurred",
        })
      }
    }

    const successCount = results.tests.filter((t) => t.success).length
    const totalTests = results.tests.length

    return NextResponse.json({
      success: successCount > 0,
      summary: `${successCount}/${totalTests} tests passed`,
      usingFallback: results.usingFallback,
      results,
      recommendations: results.usingFallback
        ? [
            "✅ Fallback service is working for basic testing",
            "⚠️  Limited to ~15 sample verses only",
            "🔧 To get full Bible functionality:",
            "   1. Get BLOB_READ_WRITE_TOKEN from Vercel Dashboard",
            "   2. Add it to your .env.local file",
            "   3. Upload Bible data using the upload scripts",
            "   4. Restart your development server",
          ]
        : successCount === 0
          ? [
              "❌ Blob storage configured but not working",
              "Check if Bible data has been uploaded",
              "Verify BLOB_READ_WRITE_TOKEN is correct",
              "Check network connectivity to Vercel Blob storage",
            ]
          : ["✅ Blob storage is working correctly!", "Bible search should be fully functional"],
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error("Test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test Bible storage",
        details: error.message || "Unknown error occurred",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
