"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Pause, Volume2, Loader2, VolumeX } from "lucide-react"
import { VoiceSettings, type VoiceSettings as VoiceSettingsType } from "./voice-settings"

interface TextToSpeechProps {
  text: string
  className?: string
  showVoiceSettings?: boolean
  reference?: string
}

export function TextToSpeech({ text, className = "", showVoiceSettings = true, reference }: TextToSpeechProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    voiceId: "ErXwobaYiN019PkySvjV", // Adam - a valid ElevenLabs voice
    stability: 0.5,
    similarityBoost: 0.75,
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [voiceName, setVoiceName] = useState("Zach Bryan Style")
  const [cacheStatus, setCacheStatus] = useState<string | null>(null)
  const currentAudioUrl = useRef<string | null>(null)

  // Cleanup function to properly dispose of audio resources
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener("ended", handleAudioEnded)
      audioRef.current.removeEventListener("error", handleAudioError)
      audioRef.current = null
    }
    if (currentAudioUrl.current) {
      URL.revokeObjectURL(currentAudioUrl.current)
      currentAudioUrl.current = null
    }
    setIsPlaying(false)
  }, [])

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
    cleanupAudio()
  }, [cleanupAudio])

  const handleAudioError = useCallback(
    (event: Event) => {
      console.error("Audio error:", event)
      setError("Error playing audio")
      setIsPlaying(false)
      cleanupAudio()
    },
    [cleanupAudio],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [cleanupAudio])

  const handlePlay = async () => {
    // If we have audio and it's valid, toggle playback
    if (audioRef.current && currentAudioUrl.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          // Check if the audio source is still valid
          if (audioRef.current.readyState >= 2) {
            // HAVE_CURRENT_DATA or higher
            await audioRef.current.play()
            setIsPlaying(true)
          } else {
            // Audio source is invalid, regenerate
            cleanupAudio()
            // Fall through to regenerate audio
          }
        }
        return
      } catch (err) {
        console.error("Error playing existing audio:", err)
        cleanupAudio()
        // Fall through to regenerate audio
      }
    }

    // Generate new audio
    setIsLoading(true)
    setError(null)
    setCacheStatus(null)

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: voiceSettings.voiceId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate speech`)
      }

      // Verify we got audio data
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("audio")) {
        throw new Error("Invalid response: Expected audio data")
      }

      // Get the audio blob
      const audioBlob = await response.blob()

      // Verify the blob has content
      if (audioBlob.size === 0) {
        throw new Error("Received empty audio data")
      }

      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob)
      currentAudioUrl.current = audioUrl

      // Create new audio element
      const audio = new Audio()

      // Set up event listeners before setting src
      audio.addEventListener("ended", handleAudioEnded)
      audio.addEventListener("error", handleAudioError)
      audio.addEventListener("loadeddata", () => {
        console.log("Audio loaded successfully")
      })

      // Set audio properties
      audio.src = audioUrl
      audio.muted = isMuted
      audio.preload = "auto"

      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Audio loading timeout"))
        }, 10000) // 10 second timeout

        audio.addEventListener(
          "canplay",
          () => {
            clearTimeout(timeout)
            resolve()
          },
          { once: true },
        )

        audio.addEventListener(
          "error",
          () => {
            clearTimeout(timeout)
            reject(new Error("Failed to load audio"))
          },
          { once: true },
        )

        // Start loading
        audio.load()
      })

      // Store reference and play
      audioRef.current = audio
      await audio.play()
      setIsPlaying(true)
    } catch (err) {
      console.error("Error generating/playing speech:", err)
      setError(err instanceof Error ? err.message : "Failed to generate speech")
      cleanupAudio()
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const handleVoiceSettingsChange = useCallback(
    (newSettings: VoiceSettingsType) => {
      setVoiceSettings(newSettings)

      // Update voice name when voice changes
      if (newSettings.voiceId === "pNInz6obpgDQGcFmaJgB") {
        setVoiceName("Adam")
      } else if (newSettings.voiceId === "EXAVITQu4vr4xnSDxMaL") {
        setVoiceName("Bella")
      } else if (newSettings.voiceId === "ErXwobaYiN019PkySvjV") {
        setVoiceName("Zach Bryan Style")
      } else {
        setVoiceName("Custom Voice")
      }

      // Clear current audio when voice settings change
      cleanupAudio()
      setError(null)
    },
    [cleanupAudio],
  )

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
        aria-label={isPlaying ? "Pause speech" : "Play speech"}
        title={isPlaying ? "Pause" : `Listen (${voiceName})`}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </button>

      {(isPlaying || audioRef.current) && (
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {showVoiceSettings && <VoiceSettings onSettingsChange={handleVoiceSettingsChange} />}

      {error && (
        <div className="flex items-center gap-1">
          <p className="text-xs text-destructive">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      {cacheStatus && <p className="text-xs text-muted-foreground">{cacheStatus}</p>}
    </div>
  )
}

export default TextToSpeech
