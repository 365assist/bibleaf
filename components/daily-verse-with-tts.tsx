"use client"

import { useState, useEffect } from "react"
import { Calendar, Heart, Share2 } from "lucide-react"
import TextToSpeech from "./text-to-speech"

interface DailyVerseData {
  reference: string
  text: string
  context?: string
  date: string
}

interface DailyVerseWithTTSProps {
  userId?: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
}

export default function DailyVerseWithTTS({ userId, onSaveVerse }: DailyVerseWithTTSProps) {
  const [verse, setVerse] = useState<DailyVerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetchDailyVerse()
  }, [userId])

  const fetchDailyVerse = async () => {
    try {
      setIsLoading(true)
      setError("")

      const url = userId ? `/api/ai/daily-verse?userId=${userId}` : "/api/ai/daily-verse"
      console.log("Fetching daily verse from:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers.get("content-type"))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      console.log("Raw response:", text)

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Invalid JSON response from server")
      }

      console.log("Parsed data:", data)

      if (data.verse) {
        setVerse({
          reference: data.verse.reference,
          text: data.verse.text,
          context: data.verse.context,
          date: data.date || new Date().toISOString().split("T")[0],
        })
      } else {
        throw new Error("No verse data in response")
      }
    } catch (error) {
      console.error("Error fetching daily verse:", error)

      // Set a fallback verse instead of showing error
      setVerse({
        reference: "Psalm 119:105",
        text: "Your word is a lamp for my feet, a light on my path.",
        context: "The psalmist's declaration of Scripture's guidance in life.",
        date: new Date().toISOString().split("T")[0],
      })

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to load daily verse")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveVerse = () => {
    if (verse && onSaveVerse) {
      onSaveVerse({
        reference: verse.reference,
        text: verse.text,
      })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const handleShare = async () => {
    if (!verse) return

    const shareText = `"${verse.text}" - ${verse.reference}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Bible Verse",
          text: shareText,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        alert("Verse copied to clipboard!")
      } catch (error) {
        console.error("Failed to copy to clipboard:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (!verse) return null

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary">
          <Calendar size={18} />
          <span className="font-medium text-sm">Daily Verse - {new Date(verse.date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <TextToSpeech text={verse.text} />

          <button
            onClick={handleShare}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            title="Share verse"
          >
            <Share2 size={16} />
          </button>

          {onSaveVerse && (
            <button
              onClick={handleSaveVerse}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
              title={isSaved ? "Saved!" : "Save verse"}
            >
              <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : ""} />
            </button>
          )}
        </div>
      </div>

      <blockquote className="space-y-4">
        <p className="text-lg leading-relaxed font-medium text-foreground">"{verse.text}"</p>
        <footer className="text-primary font-semibold">— {verse.reference}</footer>
      </blockquote>

      {verse.context && (
        <div className="mt-4 p-4 bg-background/50 rounded-md">
          <p className="text-sm text-muted-foreground italic">{verse.context}</p>
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
          Note: Using fallback verse due to connection issue
        </div>
      )}
    </div>
  )
}
