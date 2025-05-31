"use client"

import type React from "react"

import { useState } from "react"
import TextToSpeech from "./text-to-speech"

export default function TTSDemo() {
  const [text, setText] = useState(
    "Welcome to BibleAF, your AI-powered spiritual companion. Choose your preferred voice and enjoy listening to Bible verses and spiritual guidance.",
  )
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const sampleTexts = [
    "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
    "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters. - Psalm 23:1-2",
    "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. - Proverbs 3:5-6",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9",
  ]

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-4">Text-to-Speech with Voice Selection</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Enter text to convert to speech..."
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-lg leading-relaxed">{text}</p>
          </div>

          <div className="flex justify-between items-center">
            <TextToSpeech text={text} showVoiceSettings={true} />
            <button onClick={() => setIsEditing(true)} className="text-sm text-primary hover:underline">
              Edit Text
            </button>
          </div>

          {/* Sample Texts */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Try these sample texts:</h4>
            <div className="grid gap-2">
              {sampleTexts.map((sampleText, index) => (
                <button
                  key={index}
                  onClick={() => setText(sampleText)}
                  className="text-left text-sm p-2 border rounded hover:bg-muted transition-colors"
                >
                  {sampleText.length > 100 ? `${sampleText.substring(0, 100)}...` : sampleText}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-muted-foreground space-y-1">
        <p>• Click the settings icon to choose your preferred voice</p>
        <p>• Preview voices before selecting them</p>
        <p>• Adjust voice parameters for optimal results</p>
        <p>• Your settings are saved automatically</p>
      </div>
    </div>
  )
}
