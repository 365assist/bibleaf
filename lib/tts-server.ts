/**
 * Server-side Text-to-Speech utilities
 * Handles ElevenLabs API calls securely on the server
 */

interface TTSServerOptions {
  text: string
  voiceId?: string
  stability?: number
  similarityBoost?: number
}

/**
 * Generate speech on the server using ElevenLabs API
 * This keeps the API key secure on the server side
 */
export async function generateSpeechServer({
  text,
  voiceId = "pNInz6obpgDQGcFmaJgB", // Adam - valid ElevenLabs voice
  stability = 0.5,
  similarityBoost = 0.75,
}: TTSServerOptions): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw new Error("ElevenLabs API key is not configured")
  }

  if (!text || text.length === 0) {
    throw new Error("Text is required for speech generation")
  }

  if (text.length > 5000) {
    throw new Error("Text too long (max 5000 characters)")
  }

  console.log(`Generating TTS for voice ${voiceId}, text length: ${text.length}`)

  try {
    // Call ElevenLabs API to convert text to speech
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("ElevenLabs API error:", errorData)

      // If it's a voice not found error, try with the default voice
      if (errorData.detail?.status === "voice_not_found" && voiceId !== "pNInz6obpgDQGcFmaJgB") {
        console.log("Retrying with default voice...")
        return generateSpeechServer({
          text,
          voiceId: "pNInz6obpgDQGcFmaJgB",
          stability,
          similarityBoost,
        })
      }

      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || "Unknown error"}`)
    }

    // Get the audio data as an ArrayBuffer
    const audioData = await response.arrayBuffer()

    // Verify we got audio data
    if (audioData.byteLength === 0) {
      throw new Error("Received empty audio data from ElevenLabs")
    }

    console.log(`Generated audio: ${audioData.byteLength} bytes`)
    return audioData
  } catch (error) {
    console.error("Error generating speech:", error)
    throw error
  }
}

/**
 * Check if TTS is available (server-side only)
 */
export function isTTSAvailable(): boolean {
  return !!process.env.ELEVENLABS_API_KEY
}

/**
 * Get available voices (server-side only)
 */
export async function getAvailableVoices() {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw new Error("ElevenLabs API key is not configured")
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`)
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error("Error fetching voices:", error)
    throw error
  }
}
