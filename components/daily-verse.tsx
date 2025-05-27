"use client"

import { useState, useEffect } from "react"
import { Calendar, Heart, Share2, RefreshCw } from "lucide-react"

interface DailyVerseData {
  reference: string
  text: string
  context?: string
  date: string
}

interface DailyVerseProps {
  userId?: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
}

export default function DailyVerse({ userId, onSaveVerse }: DailyVerseProps) {
  const [verse, setVerse] = useState<DailyVerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDailyVerse()
  }, [userId])

  const fetchDailyVerse = async () => {
    try {
      setIsLoading(true)
      setError("")

      const url = userId ? `/api/ai/daily-verse?userId=${userId}` : "/api/ai/daily-verse"
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get daily verse")
      }

      setVerse({
        reference: data.verse.reference,
        text: data.verse.text,
        context: data.verse.context,
        date: data.date,
      })
    } catch (error) {
      console.error("Error fetching daily verse:", error)
      setError("Failed to load daily verse")
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

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <p className="text-destructive font-medium">Error loading daily verse</p>
        <p className="text-destructive/80 text-sm mt-1">{error}</p>
        <button
          onClick={fetchDailyVerse}
          className="mt-3 text-sm text-destructive hover:text-destructive/80 flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Try again
        </button>
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
              title="Save verse"
            >
              <Heart size={16} />
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
    </div>
  )
}
