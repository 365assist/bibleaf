import { type NextRequest, NextResponse } from "next/server"
import { generateSpeechServer } from "@/lib/tts-server"

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, stability, similarityBoost } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Use the secure server-side TTS function
    const audioData = await generateSpeechServer({
      text,
      voiceId,
      stability,
      similarityBoost,
    })

    // Return the audio data with the appropriate content type
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error in TTS API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process text-to-speech request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
