interface TTSOptions {
  text: string
  voiceId?: string
  stability?: number
  similarityBoost?: number
  useCache?: boolean
  reference?: string
}

// In-memory cache for audio blobs to avoid redundant API calls in the same session
const memoryCache = new Map<string, Blob>()

/**
 * Generate text-to-speech audio on the client side
 * Always uses server API for security - no client-side API keys
 */
export async function generateSpeech({
  text,
  voiceId = "pNInz6obpgDQGcFmaJgB", // Adam - valid ElevenLabs voice
  stability = 0.5,
  similarityBoost = 0.75,
  useCache = true,
  reference,
}: TTSOptions): Promise<{ audioBlob: Blob; fromCache: boolean; cacheType?: string }> {
  // Create a cache key based on all parameters
  const cacheKey = `${text}|${voiceId}|${stability}|${similarityBoost}`

  // Check memory cache first if enabled
  if (useCache && memoryCache.has(cacheKey)) {
    return { audioBlob: memoryCache.get(cacheKey)!, fromCache: true, cacheType: "memory" }
  }

  try {
    // Always use our server API for security - never expose API keys to client
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voiceId,
        stability,
        similarityBoost,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Server TTS API error: ${response.status}`)
    }

    const audioBlob = await response.blob()

    // Cache the result if caching is enabled
    if (useCache) {
      memoryCache.set(cacheKey, audioBlob)
    }

    return { audioBlob, fromCache: false }
  } catch (error) {
    console.error("Failed to generate speech:", error)
    throw error
  }
}

/**
 * Clear the TTS memory cache
 */
export function clearTTSMemoryCache(): void {
  memoryCache.clear()
}

/**
 * Get the size of the TTS memory cache in MB
 */
export function getTTSMemoryCacheSize(): number {
  let totalSize = 0
  memoryCache.forEach((blob) => {
    totalSize += blob.size
  })
  return totalSize / (1024 * 1024) // Convert to MB
}

/**
 * Play audio from a blob
 */
export function playAudioBlob(blob: Blob): HTMLAudioElement {
  const audioUrl = URL.createObjectURL(blob)
  const audio = new Audio(audioUrl)

  // Clean up the URL object when done
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl)
  }

  audio.play().catch((error) => {
    console.error("Failed to play audio:", error)
  })

  return audio
}
