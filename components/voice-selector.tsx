"use client"

import { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Voice {
  voice_id: string
  name: string
  category: string
  description: string
}

interface VoiceSelectorProps {
  selectedVoiceId: string
  onVoiceSelect: (voiceId: string, voiceName: string) => void
}

export function VoiceSelector({ selectedVoiceId, onVoiceSelect }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null)

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

  const previewVoice = async (voice: Voice) => {
    setPreviewVoiceId(voice.voice_id)
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "This is a preview of my voice.",
          voiceId: voice.voice_id,
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
      }

      await audio.play()
    } catch (error) {
      console.error("Failed to preview voice:", error)
      setPreviewVoiceId(null)
    }
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
      <h3 className="text-sm font-medium">Select Voice</h3>
      <ScrollArea className="h-60 rounded-md border">
        <div className="p-2">
          {Object.entries(voicesByCategory).map(([category, categoryVoices]) => (
            <div key={category} className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                {category === "premade" ? "Standard Voices" : category === "custom" ? "Custom Voices" : category}
              </h4>
              <div className="space-y-1">
                {categoryVoices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5",
                      selectedVoiceId === voice.voice_id && "bg-accent",
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{voice.name}</span>
                        {selectedVoiceId === voice.voice_id && <Check className="ml-2 h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{voice.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewVoice(voice)}
                        disabled={previewVoiceId === voice.voice_id}
                      >
                        {previewVoiceId === voice.voice_id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Preview"}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onVoiceSelect(voice.voice_id, voice.name)}
                        disabled={selectedVoiceId === voice.voice_id}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
