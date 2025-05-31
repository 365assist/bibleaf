"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextToSpeech } from "@/components/text-to-speech"
import { useState } from "react"

interface DivineVerseDisplayProps {
  reference: string
  text: string
  translation?: string
}

export function DivineVerseDisplay({ reference, text, translation = "NIV" }: DivineVerseDisplayProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    // Logic to save verse would go here
    setIsSaved(!isSaved)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center opacity-20"></div>
      <Card className="border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{reference}</h3>
            <span className="text-sm text-gray-500">{translation}</span>
          </div>

          <p className="text-lg mb-6 leading-relaxed">{text}</p>

          <div className="flex justify-between items-center">
            <TextToSpeech text={`${reference}. ${text}`} />

            <Button
              variant="outline"
              size="sm"
              className={
                isSaved
                  ? "border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                  : "border-gray-300 text-gray-500 hover:border-amber-500 hover:text-amber-500"
              }
              onClick={handleSave}
            >
              {isSaved ? "Saved" : "Save Verse"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
