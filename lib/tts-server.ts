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

interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  description: string
  preview_url?: string
  labels?: Record<string, string>
}

/**
 * Generate speech on the server using ElevenLabs API
 * This keeps the API key secure on the server side
 */
export async function generateSpeechServer({
  text,
  voiceId = "ErXwobaYiN019PkySvjV", // Adam - a valid ElevenLabs voice
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
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2", // Better model for biblical text
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style: 0.0, // Neutral style for biblical content
          use_speaker_boost: true,
        },
        output_format: "mp3_44100_128", // High quality audio
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
export async function getAvailableVoices(): Promise<ElevenLabsVoice[]> {
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

    // Add some default voices if none are returned
    const defaultVoices: ElevenLabsVoice[] = [
      {
        voice_id: "ErXwobaYiN019PkySvjV",
        name: "Antoni",
        category: "premade",
        description: "Zach Bryan style - warm, authentic voice perfect for biblical storytelling",
      },
      {
        voice_id: "pNInz6obpgDQGcFmaJgB",
        name: "Adam",
        category: "premade",
        description: "Deep, authoritative voice perfect for biblical narration",
      },
      {
        voice_id: "EXAVITQu4vr4xnSDxMaL",
        name: "Bella",
        category: "premade",
        description: "Warm, gentle female voice ideal for psalms and prayers",
      },
      {
        voice_id: "VR6AewLTigWG4xSOukaG",
        name: "Arnold",
        category: "premade",
        description: "Strong, confident voice for powerful passages",
      },
    ]

    return data.voices || defaultVoices
  } catch (error) {
    console.error("Error fetching voices:", error)

    // Return default voices as fallback
    return [
      {
        voice_id: "pNInz6obpgDQGcFmaJgB",
        name: "Adam",
        category: "premade",
        description: "Deep, authoritative voice perfect for biblical narration",
      },
      {
        voice_id: "EXAVITQu4vr4xnSDxMaL",
        name: "Bella",
        category: "premade",
        description: "Warm, gentle female voice ideal for psalms and prayers",
      },
    ]
  }
}

/**
 * Get voice details by ID
 */
export async function getVoiceDetails(voiceId: string): Promise<ElevenLabsVoice | null> {
  const voices = await getAvailableVoices()
  return voices.find((voice) => voice.voice_id === voiceId) || null
}

/**
 * Get recommended voice for biblical content type
 */
export function getRecommendedVoice(contentType: "verse" | "psalm" | "prayer" | "narrative" | "prophecy"): string {
  const recommendations = {
    verse: "pNInz6obpgDQGcFmaJgB", // Adam - authoritative
    psalm: "EXAVITQu4vr4xnSDxMaL", // Bella - gentle
    prayer: "EXAVITQu4vr4xnSDxMaL", // Bella - warm
    narrative: "ErXwobaYiN019PkySvjV", // Antoni - storytelling
    prophecy: "VR6AewLTigWG4xSOukaG", // Arnold - powerful
  }

  return recommendations[contentType] || "ErXwobaYiN019PkySvjV"
}
