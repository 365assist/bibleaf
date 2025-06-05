"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Pause, Volume2, Loader2, VolumeX } from "lucide-react"
import { VoiceSettings, type VoiceSettings as VoiceSettingsType } from "./voice-settings"

interface TextToSpeechProps {
  text: string
  className?: string
  showVoiceSettings?: boolean
  reference?: string
  contentType?: string
}

export function TextToSpeech({
  text,
  className = "",
  showVoiceSettings = true,
  reference,
  contentType = "verse",
}: TextToSpeechProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    voiceId: "ErXwobaYiN019PkySvjV",
    stability: 0.5,
    similarityBoost: 0.75,
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [voiceName, setVoiceName] = useState("Zach Bryan Style")
  const [cacheStatus, setCacheStatus] = useState<string | null>(null)
  const currentAudioUrl = useRef<string | null>(null)

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

  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [cleanupAudio])

  const handlePlay = async () => {
    if (audioRef.current && currentAudioUrl.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          if (audioRef.current.readyState >= 2) {
            await audioRef.current.play()
            setIsPlaying(true)
          } else {
            cleanupAudio()
          }
        }
        return
      } catch (err) {
        console.error("Error playing existing audio:", err)
        cleanupAudio()
      }
    }

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

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("audio")) {
        throw new Error("Invalid response: Expected audio data")
      }

      const audioBlob = await response.blob()

      if (audioBlob.size === 0) {
        throw new Error("Received empty audio data")
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      currentAudioUrl.current = audioUrl

      const audio = new Audio()

      audio.addEventListener("ended", handleAudioEnded)
      audio.addEventListener("error", handleAudioError)
      audio.addEventListener("loadeddata", () => {
        console.log("Audio loaded successfully")
      })

      audio.src = audioUrl
      audio.muted = isMuted
      audio.preload = "auto"

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Audio loading timeout"))
        }, 10000)

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

        audio.load()
      })

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

      if (newSettings.voiceId === "pNInz6obpgDQGcFmaJgB") {
        setVoiceName("Adam")
      } else if (newSettings.voiceId === "EXAVITQu4vr4xnSDxMaL") {
        setVoiceName("Bella")
      } else if (newSettings.voiceId === "ErXwobaYiN019PkySvjV") {
        setVoiceName("Zach Bryan Style")
      } else {
        setVoiceName("Custom Voice")
      }

      cleanupAudio()
      setError(null)
    },
    [cleanupAudio],
  )

  const buttonClasses = "p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
  const iconClasses = "h-5 w-5"

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className={buttonClasses}
        aria-label={isPlaying ? "Pause speech" : "Play speech"}
        title={isPlaying ? "Pause" : `Listen (${voiceName})`}
      >
        {isLoading ? (
          <Loader2 className={`${iconClasses} animate-spin`} />
        ) : isPlaying ? (
          <Pause className={iconClasses} />
        ) : (
          <Play className={iconClasses} />
        )}
      </button>

      {(isPlaying || audioRef.current) && (
        <button
          onClick={toggleMute}
          className={buttonClasses}
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className={iconClasses} /> : <Volume2 className={iconClasses} />}
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
