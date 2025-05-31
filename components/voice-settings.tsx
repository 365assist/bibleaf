"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings, Volume2 } from "lucide-react"
import { VoiceSelector } from "./voice-selector"

export interface VoiceSettings {
  voiceId: string
  stability: number
  similarityBoost: number
}

interface VoiceSettingsProps {
  onSettingsChange?: (settings: VoiceSettings) => void
  className?: string
}

const DEFAULT_SETTINGS: VoiceSettings = {
  voiceId: "pNInz6obpgDQGcFmaJgB", // Default voice ID
  stability: 0.5,
  similarityBoost: 0.75,
}

export function VoiceSettings({ onSettingsChange, className }: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS)
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load settings from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("voice-settings")
        if (saved) {
          const parsedSettings = JSON.parse(saved)
          setSettings(parsedSettings)
        }
      } catch (error) {
        console.warn("Failed to load voice settings:", error)
      }
      setIsInitialized(true)
    }
  }, [])

  // Save settings and notify parent (only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem("voice-settings", JSON.stringify(settings))
        onSettingsChange?.(settings)
      } catch (error) {
        console.warn("Failed to save voice settings:", error)
      }
    }
  }, [settings, isInitialized, onSettingsChange])

  const handleVoiceChange = useCallback((voiceId: string) => {
    setSettings((prev) => ({ ...prev, voiceId }))
  }, [])

  const handleStabilityChange = useCallback((value: number[]) => {
    setSettings((prev) => ({ ...prev, stability: value[0] }))
  }, [])

  const handleSimilarityBoostChange = useCallback((value: number[]) => {
    setSettings((prev) => ({ ...prev, similarityBoost: value[0] }))
  }, [])

  const testVoice = useCallback(async () => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "This is a test of your selected voice settings.",
          voiceId: settings.voiceId,
          stability: settings.stability,
          similarityBoost: settings.similarityBoost,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
      }
    } catch (error) {
      console.error("Failed to test voice:", error)
    }
  }, [settings])

  if (!isInitialized) {
    return null // Don't render until initialized
  }

  return (
    <div className={className}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2">
        <Settings className="h-4 w-4" />
        Voice Settings
      </Button>

      {isOpen && (
        <Card className="mt-2 w-80">
          <CardHeader>
            <CardTitle className="text-lg">Voice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <VoiceSelector selectedVoiceId={settings.voiceId} onVoiceSelect={handleVoiceChange} />

            <div className="space-y-2">
              <Label>Stability: {settings.stability.toFixed(2)}</Label>
              <Slider
                value={[settings.stability]}
                onValueChange={handleStabilityChange}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher values make the voice more stable but less expressive
              </p>
            </div>

            <div className="space-y-2">
              <Label>Similarity Boost: {settings.similarityBoost.toFixed(2)}</Label>
              <Slider
                value={[settings.similarityBoost]}
                onValueChange={handleSimilarityBoostChange}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Higher values make the voice more similar to the original</p>
            </div>

            <Button onClick={testVoice} className="w-full gap-2">
              <Volume2 className="h-4 w-4" />
              Test Voice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
