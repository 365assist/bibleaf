"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BibleService } from "@/lib/bible-service"
import TextToSpeech from "./text-to-speech"

interface VerseContextViewerProps {
  reference: string
  onClose: () => void
  highlightVerse?: number
}

interface ContextVerse {
  verse: number
  text: string
  isTarget?: boolean
}

export default function VerseContextViewer({ reference, onClose, highlightVerse }: VerseContextViewerProps) {
  const [contextVerses, setContextVerses] = useState<ContextVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [contextRange, setContextRange] = useState(5) // verses before and after
  const [showVerseNumbers, setShowVerseNumbers] = useState(true)
  const [translation, setTranslation] = useState("NIV")

  // Parse reference to get book, chapter, and verse
  const parseReference = (ref: string) => {
    const parts = ref.split(" ")
    const book = parts.slice(0, -1).join(" ")
    const chapterVerse = parts[parts.length - 1]
    const [chapter, verse] = chapterVerse.split(":")
    return {
      book,
      chapter: Number.parseInt(chapter),
      verse: verse ? Number.parseInt(verse) : 1,
    }
  }

  const { book, chapter, verse: targetVerse } = parseReference(reference)

  useEffect(() => {
    fetchContext()
  }, [reference, contextRange, translation])

  const fetchContext = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch chapter")
      }

      const chapterData = await response.json()

      // Calculate context range
      const startVerse = Math.max(1, targetVerse - contextRange)
      const endVerse = Math.min(chapterData.verses.length, targetVerse + contextRange)

      const contextData = chapterData.verses
        .filter((v: any) => v.verse >= startVerse && v.verse <= endVerse)
        .map((v: any) => ({
          verse: v.verse,
          text: v.text,
          isTarget: v.verse === targetVerse || v.verse === highlightVerse,
        }))

      setContextVerses(contextData)
    } catch (err) {
      setError("Failed to load context. Please try again.")
      console.error("Error fetching context:", err)
    } finally {
      setLoading(false)
    }
  }

  const getContextText = () => {
    return contextVerses.map((v) => v.text).join(" ")
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-3"></div>
              <span>Loading context...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-blue-50 dark:from-amber-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-amber-800 dark:text-amber-300">{reference} - Context View</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {contextRange} verses before and after • {translation}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TextToSpeech text={getContextText()} label="Listen to context" />
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="p-4 border-b bg-muted/30">
          <div className="flex flex-wrap items-center gap-4">
            {/* Context Range Control */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Context Range:</label>
              <select
                value={contextRange}
                onChange={(e) => setContextRange(Number.parseInt(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={3}>3 verses</option>
                <option value={5}>5 verses</option>
                <option value={10}>10 verses</option>
                <option value={15}>15 verses</option>
              </select>
            </div>

            {/* Translation Control */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Translation:</label>
              <select
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="NIV">NIV</option>
                <option value="ESV">ESV</option>
                <option value="KJV">KJV</option>
                <option value="NASB">NASB</option>
                <option value="NLT">NLT</option>
              </select>
            </div>

            {/* Verse Numbers Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVerseNumbers(!showVerseNumbers)}
              className="flex items-center gap-2"
            >
              {showVerseNumbers ? <EyeOff size={14} /> : <Eye size={14} />}
              {showVerseNumbers ? "Hide" : "Show"} Verse Numbers
            </Button>

            {/* Read Full Chapter Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(`/bible/${encodeURIComponent(book)}/${chapter}`, "_blank")
              }}
              className="flex items-center gap-2"
            >
              <BookOpen size={14} />
              Read Full Chapter
            </Button>
          </div>
        </div>

        <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
          {error ? (
            <div className="p-6 text-center text-destructive">
              <p>{error}</p>
              <Button onClick={fetchContext} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {contextVerses.map((verse) => (
                <div
                  key={verse.verse}
                  className={`p-4 rounded-lg transition-all ${
                    verse.isTarget
                      ? "bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 shadow-md"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {showVerseNumbers && (
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          verse.isTarget ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {verse.verse}
                      </span>
                    )}
                    <p
                      className={`flex-1 leading-relaxed ${
                        verse.isTarget ? "text-lg font-medium text-amber-900 dark:text-amber-100" : "text-base"
                      }`}
                    >
                      {verse.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevChapter = chapter - 1
                  if (prevChapter >= 1) {
                    window.open(`/bible/${encodeURIComponent(book)}/${prevChapter}`, "_blank")
                  }
                }}
                disabled={chapter <= 1}
              >
                <ChevronLeft size={14} />
                Previous Chapter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const bookInfo = BibleService.getBook(book)
                  const nextChapter = chapter + 1
                  if (bookInfo && nextChapter <= bookInfo.chapters) {
                    window.open(`/bible/${encodeURIComponent(book)}/${nextChapter}`, "_blank")
                  }
                }}
                disabled={(() => {
                  const bookInfo = BibleService.getBook(book)
                  return !bookInfo || chapter >= bookInfo.chapters
                })()}
              >
                Next Chapter
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
