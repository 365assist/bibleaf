import { NextResponse } from "next/server"
import { getAvailableVoices, isTTSAvailable } from "@/lib/tts-server"

export async function GET() {
  try {
    if (!isTTSAvailable()) {
      return NextResponse.json({ error: "TTS service is not configured" }, { status: 503 })
    }

    const voices = await getAvailableVoices()
    return NextResponse.json({ voices })
  } catch (error) {
    console.error("Error fetching voices:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch voices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
