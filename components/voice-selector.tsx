"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Voice {
  voice_id: string
  name: string
  category: string
  description: string
  labels?: Record<string, string>
}

interface VoiceSelectorProps {
  selectedVoiceId: string
  onVoiceSelect: (voiceId: string) => void
  contentType?: "verse" | "psalm" | "prayer" | "narrative" | "prophecy"
}

export function VoiceSelector({ selectedVoiceId, onVoiceSelect, contentType = "verse" }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null)
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    async function fetchVoices() {
      try {
        const response = await fetch("/api/tts/voices")
        if (!response.ok) {
          throw new Error("Failed to fetch voices")
        }
        const data = await response.json()
        setVoices(data.voices || [])
      } catch (err) {
        setError("Failed to load voices")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVoices()
  }, [])

  const getPreviewText = (contentType: string) => {
    const previews = {
      verse: "Well, bless your heart, child. That's just the way it is, ain't it?",
      psalm: "Lord, I'm just a humble man tryin' to make my way.",
      prayer: "Lord, hear my prayer, a simple plea from a weary soul.",
      narrative: "Now, gather 'round, and I'll spin you a yarn.",
      prophecy: "The wind's gonna change, and not for the better, I reckon.",
    }
    return previews[contentType as keyof typeof previews] || previews.verse
  }

  const previewVoice = async (voice: Voice) => {
    // Stop any currently playing preview
    if (previewAudio) {
      previewAudio.pause()
      setPreviewAudio(null)
    }

    if (previewVoiceId === voice.voice_id) {
      setPreviewVoiceId(null)
      return
    }

    setPreviewVoiceId(voice.voice_id)
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: getPreviewText(contentType),
          voiceId: voice.voice_id,
          contentType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate preview")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        setPreviewVoiceId(null)
        setPreviewAudio(null)
      }

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        setPreviewVoiceId(null)
        setPreviewAudio(null)
      }

      setPreviewAudio(audio)
      await audio.play()
    } catch (error) {
      console.error("Failed to preview voice:", error)
      setPreviewVoiceId(null)
    }
  }

  const stopPreview = () => {
    if (previewAudio) {
      previewAudio.pause()
      setPreviewAudio(null)
    }
    setPreviewVoiceId(null)
  }

  const getVoiceRecommendation = (voice: Voice) => {
    const recommendations = {
      pNInz6obpgDQGcFmaJgB: ["verse", "narrative"], // Adam
      EXAVITQu4vr4xnSDxMaL: ["psalm", "prayer"], // Bella
      ErXwobaYiN019PkySvjV: ["verse", "psalm", "prayer", "narrative", "prophecy"], // Antoni
      VR6AewLTigWG4xSOukaG: ["prophecy"], // Arnold
    }

    const voiceTypes = recommendations[voice.voice_id as keyof typeof recommendations] || []
    return voiceTypes.includes(contentType)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-destructive py-2">{error}</div>
  }

  // Group voices by category
  const voicesByCategory = voices.reduce(
    (acc, voice) => {
      const category = voice.category || "other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(voice)
      return acc
    },
    {} as Record<string, Voice[]>,
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select Voice</h3>
        <Badge variant="outline" className="text-xs">
          {contentType}
        </Badge>
      </div>
      <ScrollArea className="h-60 rounded-md border">
        <div className="p-2">
          {Object.entries(voicesByCategory).map(([category, categoryVoices]) => (
            <div key={category} className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                {category === "premade" ? "ElevenLabs Voices" : category}
              </h4>
              <div className="space-y-1">
                {categoryVoices.map((voice) => {
                  const isRecommended = getVoiceRecommendation(voice)
                  const isSelected = selectedVoiceId === voice.voice_id
                  const isPreviewing = previewVoiceId === voice.voice_id

                  return (
                    <div
                      key={voice.voice_id}
                      className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5",
                        isSelected && "bg-accent",
                        isRecommended && "ring-1 ring-blue-200 dark:ring-blue-800",
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{voice.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                          {isRecommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{voice.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewVoice(voice)}
                          disabled={isPreviewing}
                          className="h-8 w-8 p-0"
                        >
                          {isPreviewing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant={isSelected ? "secondary" : "default"}
                          size="sm"
                          onClick={() => onVoiceSelect(voice.voice_id)}
                          disabled={isSelected}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {previewVoiceId && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-3 w-3" />
          <span>Playing preview...</span>
          <Button variant="ghost" size="sm" onClick={stopPreview} className="h-6 px-2">
            Stop
          </Button>
        </div>
      )}
    </div>
  )
}
