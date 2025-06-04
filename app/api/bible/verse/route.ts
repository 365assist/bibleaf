import { type NextRequest, NextResponse } from "next/server"
import { bibleAPIService } from "@/lib/bible-api-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const translation = searchParams.get("translation") || "ESV"

    if (!reference) {
      return NextResponse.json({ error: "Reference parameter is required" }, { status: 400 })
    }

    console.log(`Fetching verse: ${reference} in ${translation}`)
    const verse = await bibleAPIService.getVerse(reference, translation)

    if (!verse) {
      return NextResponse.json({ error: "Verse not found" }, { status: 404 })
    }

    return NextResponse.json(verse)
  } catch (error) {
    console.error("Error fetching Bible verse:", error)
    return NextResponse.json({ error: "Failed to fetch verse" }, { status: 500 })
  }
}
