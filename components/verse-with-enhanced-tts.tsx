"use client"

import { useState, useCallback } from "react"
import { Volume2, Settings, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VoiceSettings } from "./voice-settings"
import { TextToSpeech } from "./text-to-speech"

interface VerseWithEnhancedTTSProps {
  verse: {
    text: string
    reference: string
    translation?: string
    book?: string
    chapter?: number
    verse_number?: number
  }
  className?: string
  showSettings?: boolean
  autoDetectContentType?: boolean
}

export function VerseWithEnhancedTTS({
  verse,
  className = "",
  showSettings = true,
  autoDetectContentType = true,
}: VerseWithEnhancedTTSProps) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)

  // Auto-detect content type based on the book
  const getContentType = useCallback(() => {
    if (!autoDetectContentType) return "verse"

    const book = verse.book?.toLowerCase() || verse.reference.toLowerCase()

    if (book.includes("psalm")) return "psalm"
    if (book.includes("proverb")) return "verse"
    if (
      book.includes("genesis") ||
      book.includes("exodus") ||
      book.includes("matthew") ||
      book.includes("mark") ||
      book.includes("luke") ||
      book.includes("john")
    ) {
      return "narrative"
    }
    if (book.includes("isaiah") || book.includes("jeremiah") || book.includes("ezekiel") || book.includes("daniel")) {
      return "prophecy"
    }
    if (verse.text.toLowerCase().includes("prayer") || verse.text.toLowerCase().includes("pray")) {
      return "prayer"
    }

    return "verse"
  }, [verse, autoDetectContentType])

  const contentType = getContentType()

  // Format the text for better TTS pronunciation
  const formatTextForTTS = (text: string) => {
    return (
      text
        // Add pauses after verse numbers
        .replace(/(\d+)\s+/g, "$1. ")
        // Add pauses after colons
        .replace(/:/g, ": ")
        // Slow down for emphasis words
        .replace(/\b(LORD|God|Jesus|Christ)\b/g, '<emphasis level="strong">$1</emphasis>')
        // Add breaks for better pacing
        .replace(/[.!?]/g, '$&<break time="0.5s"/>')
        .replace(/[;,]/g, '$&<break time="0.3s"/>')
    )
  }

  const getContentTypeDescription = (type: string) => {
    const descriptions = {
      verse: "Scripture Verse",
      psalm: "Psalm",
      prayer: "Prayer",
      narrative: "Biblical Narrative",
      prophecy: "Prophetic Word",
    }
    return descriptions[type as keyof typeof descriptions] || "Scripture"
  }

  return (
    <Card className={`${className} relative`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Content Type Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {getContentTypeDescription(contentType)}
            </Badge>

            {showSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Verse Text */}
          <blockquote className="text-lg leading-relaxed border-l-4 border-amber-500 pl-4 italic">
            "{verse.text}"
          </blockquote>

          {/* Reference and TTS Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <cite className="text-sm font-medium text-muted-foreground not-italic">— {verse.reference}</cite>
              {verse.translation && (
                <Badge variant="secondary" className="text-xs">
                  {verse.translation}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <TextToSpeech
                text={formatTextForTTS(verse.text)}
                contentType={contentType}
                showVoiceSettings={false}
                reference={verse.reference}
              />

              {showSettings && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Voice
                </Button>
              )}
            </div>
          </div>

          {/* Voice Settings Panel */}
          {showVoiceSettings && (
            <div className="border-t pt-4">
              <VoiceSettings
                onSettingsChange={(settings) => {
                  console.log("Voice settings updated:", settings)
                }}
              />
            </div>
          )}

          {/* TTS Tips */}
          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <p className="font-medium mb-1">🎧 Audio Features:</p>
            <ul className="space-y-1">
              <li>• Optimized for {getContentTypeDescription(contentType).toLowerCase()}</li>
              <li>• High-quality ElevenLabs voices</li>
              <li>• Adjustable speed and tone</li>
              <li>• Perfect for meditation and study</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VerseWithEnhancedTTS
