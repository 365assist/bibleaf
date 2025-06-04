"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Mic, Settings, BookOpen, Heart, Zap } from "lucide-react"
import { VerseWithEnhancedTTS } from "@/components/verse-with-enhanced-tts"
import { VoiceSelector } from "@/components/voice-selector"
import { TextToSpeech } from "@/components/text-to-speech"

const sampleVerses = {
  verse: {
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    reference: "John 3:16",
    translation: "KJV",
    book: "John",
  },
  psalm: {
    text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    reference: "Psalm 23:1-2",
    translation: "KJV",
    book: "Psalms",
  },
  prayer: {
    text: "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven.",
    reference: "Matthew 6:9-10",
    translation: "KJV",
    book: "Matthew",
  },
  narrative: {
    text: "In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep.",
    reference: "Genesis 1:1-2",
    translation: "KJV",
    book: "Genesis",
  },
  prophecy: {
    text: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.",
    reference: "Isaiah 9:6",
    translation: "KJV",
    book: "Isaiah",
  },
}

export default function EnhancedTTSDemoPage() {
  const [customText, setCustomText] = useState("")
  const [selectedContentType, setSelectedContentType] = useState<keyof typeof sampleVerses>("verse")
  const [selectedVoice, setSelectedVoice] = useState("pNInz6obpgDQGcFmaJgB")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enhanced Bible Audio Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-4">Powered by ElevenLabs AI Voice Technology</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span>High-Quality Voices</span>
            </div>
            <div className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>Biblical Optimization</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Customizable Settings</span>
            </div>
          </div>
        </div>

        {/* Sample Verses by Content Type */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sample Bible Passages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Object.entries(sampleVerses).map(([type, verse]) => (
                  <VerseWithEnhancedTTS key={type} verse={verse} showSettings={true} autoDetectContentType={true} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Text Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Test Custom Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <Select
                  value={selectedContentType}
                  onValueChange={(value) => setSelectedContentType(value as keyof typeof sampleVerses)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verse">Scripture Verse</SelectItem>
                    <SelectItem value="psalm">Psalm</SelectItem>
                    <SelectItem value="prayer">Prayer</SelectItem>
                    <SelectItem value="narrative">Biblical Narrative</SelectItem>
                    <SelectItem value="prophecy">Prophetic Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Voice Selection</label>
                <VoiceSelector
                  selectedVoiceId={selectedVoice}
                  onVoiceSelect={(voiceId) => setSelectedVoice(voiceId)}
                  contentType={selectedContentType}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Text</label>
              <Textarea
                placeholder="Enter your own Bible verse or passage to test..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
              />
            </div>

            {customText && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Ready to play:</p>
                  <p className="text-sm text-muted-foreground">{customText.substring(0, 100)}...</p>
                </div>
                <TextToSpeech text={customText} contentType={selectedContentType} showVoiceSettings={true} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              ElevenLabs Integration Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">🎭 Voice Variety</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple high-quality voices optimized for different types of biblical content
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">🎯 Content-Aware</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically selects the best voice and settings based on content type
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">⚙️ Customizable</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust stability, similarity, and other voice parameters for perfect audio
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">💾 Cached</h4>
                <p className="text-sm text-muted-foreground">
                  Smart caching system reduces API calls and improves performance
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">📱 Responsive</h4>
                <p className="text-sm text-muted-foreground">
                  Works seamlessly across all devices with intuitive controls
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">🔒 Secure</h4>
                <p className="text-sm text-muted-foreground">
                  API keys protected on server-side, no client-side exposure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
