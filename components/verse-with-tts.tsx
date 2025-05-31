"use client"

import { useState } from "react"
import TextToSpeech from "./text-to-speech"
import { Heart, BookOpen } from "lucide-react"
import Link from "next/link"

interface VerseWithTTSProps {
  reference: string
  text: string
  context?: string
  onSave?: () => void
}

export default function VerseWithTTS({ reference, text, context, onSave }: VerseWithTTSProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    if (onSave) {
      onSave()
    }
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-primary text-lg">{reference}</h4>
        <div className="flex items-center gap-2">
          <TextToSpeech text={text} />
          <button
            onClick={handleSave}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title={isSaved ? "Saved!" : "Save verse"}
          >
            <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>
      </div>

      <p className="text-foreground leading-relaxed text-base">{text}</p>

      {context && (
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground italic">{context}</p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <BookOpen size={14} className="text-muted-foreground" />
        <Link
          href={`/bible/${encodeURIComponent(reference.split(" ")[0])}/${reference.split(" ")[1]?.split(":")[0] || "1"}${reference.includes(":") ? `?verse=${reference.split(":")[1]}` : ""}`}
          className="text-sm text-primary hover:text-primary/80"
        >
          Read full chapter →
        </Link>
      </div>
    </div>
  )
}
