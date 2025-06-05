import { type NextRequest, NextResponse } from "next/server"
import { generateSpeechServer, getRecommendedVoice } from "@/lib/tts-server"

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, stability, similarityBoost, contentType } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Determine the best voice for the content type
    const selectedVoiceId = voiceId || getRecommendedVoice(contentType || "verse")

    // Use the secure server-side TTS function
    const audioData = await generateSpeechServer({
      text,
      voiceId: selectedVoiceId,
      stability: stability || 0.5,
      similarityBoost: similarityBoost || 0.75,
    })

    // Return the audio data with the appropriate content type
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Voice-Used": selectedVoiceId,
        "X-Content-Type": contentType || "verse",
      },
    })
  } catch (error) {
    console.error("Error in TTS API route:", error)

    // Return specific error messages for different failure types
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "Text-to-speech service is not configured" }, { status: 503 })
      }
      if (error.message.includes("too long")) {
        return NextResponse.json({ error: "Text is too long. Please try a shorter passage." }, { status: 400 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process text-to-speech request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
