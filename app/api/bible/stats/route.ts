import { NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function GET() {
  try {
    console.log("Fetching Bible statistics from blob storage...")
    const stats = await bibleBlobService.getBibleStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching Bible stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Bible statistics",
      },
      { status: 500 },
    )
  }
}
