"use client"

import { useState } from "react"
import { Settings, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface VoiceSettings {
  voiceId: string
  stability: number
  similarityBoost: number
  speed?: number
  pitch?: number
}

interface VoiceSettingsProps {
  onSettingsChange: (settings: VoiceSettings) => void
  initialSettings?: Partial<VoiceSettings>
}

const VOICE_OPTIONS = [
  { id: "ErXwobaYiN019PkySvjV", name: "Zach Bryan Style", description: "Warm, conversational" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Clear, professional" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", description: "Gentle, soothing" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "Strong, authoritative" },
]

export function VoiceSettings({ onSettingsChange, initialSettings }: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    voiceId: "ErXwobaYiN019PkySvjV",
    stability: 0.5,
    similarityBoost: 0.75,
    speed: 1.0,
    pitch: 1.0,
    ...initialSettings,
  })

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    onSettingsChange(updated)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Voice Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Voice Settings</h4>
            <p className="text-sm text-muted-foreground">Customize the voice output for your preferences</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
              <Select value={settings.voiceId} onValueChange={(value) => updateSettings({ voiceId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stability">Stability</Label>
                <span className="text-sm text-muted-foreground">{settings.stability.toFixed(2)}</span>
              </div>
              <Slider
                id="stability"
                min={0}
                max={1}
                step={0.01}
                value={[settings.stability]}
                onValueChange={([value]) => updateSettings({ stability: value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher values make the voice more consistent but less expressive
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="similarity">Similarity Boost</Label>
                <span className="text-sm text-muted-foreground">{settings.similarityBoost.toFixed(2)}</span>
              </div>
              <Slider
                id="similarity"
                min={0}
                max={1}
                step={0.01}
                value={[settings.similarityBoost]}
                onValueChange={([value]) => updateSettings({ similarityBoost: value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher values make the voice more similar to the original speaker
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed">Speed</Label>
                <span className="text-sm text-muted-foreground">{(settings.speed || 1.0).toFixed(1)}x</span>
              </div>
              <Slider
                id="speed"
                min={0.5}
                max={2.0}
                step={0.1}
                value={[settings.speed || 1.0]}
                onValueChange={([value]) => updateSettings({ speed: value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Adjust playback speed</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch">Pitch</Label>
                <span className="text-sm text-muted-foreground">{(settings.pitch || 1.0).toFixed(1)}x</span>
              </div>
              <Slider
                id="pitch"
                min={0.5}
                max={2.0}
                step={0.1}
                value={[settings.pitch || 1.0]}
                onValueChange={([value]) => updateSettings({ pitch: value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Adjust voice pitch</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Changes apply to new audio generation</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
