"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Heart, AlertCircle } from "lucide-react"
import TextToSpeech from "./text-to-speech"
import { normalizeBookName, getBookInfo } from "@/lib/bible-book-mapping"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
  translation: string
}

interface BibleChapterReaderProps {
  book: string
  chapter: number
  highlightVerse?: number
  onSaveVerse?: (verse: { reference: string; text: string }) => void
}

export default function BibleChapterReader({ book, chapter, highlightVerse, onSaveVerse }: BibleChapterReaderProps) {
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVerse, setSelectedVerse] = useState<number | null>(highlightVerse || null)
  const [translation, setTranslation] = useState("kjv")
  const [availableTranslations, setAvailableTranslations] = useState<string[]>(["kjv", "niv", "nasb", "nlt", "csb"])

  useEffect(() => {
    fetchChapter()
    fetchAvailableTranslations()
  }, [book, chapter, translation])

  const fetchAvailableTranslations = async () => {
    try {
      const response = await fetch("/api/bible/translations")
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.translations) {
          setAvailableTranslations(data.translations)
        }
      }
    } catch (error) {
      console.error("Error fetching translations:", error)
    }
  }

  const fetchChapter = async () => {
    try {
      setLoading(true)
      setError("")

      // Normalize the book name before making the API call
      const normalizedBook = normalizeBookName(book)
      if (!normalizedBook) {
        throw new Error(`Unknown book: ${book}`)
      }

      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(normalizedBook)}&chapter=${chapter}&translation=${translation}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch chapter")
      }

      setChapterData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load chapter. Please try again."
      setError(errorMessage)
      console.error("Error fetching chapter:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(selectedVerse === verseNumber ? null : verseNumber)
  }

  const handleSaveVerse = (verseNumber: number, verseText: string) => {
    if (onSaveVerse) {
      const bookInfo = getBookInfo(book)
      const displayName = bookInfo?.name || book
      onSaveVerse({
        reference: `${displayName} ${chapter}:${verseNumber}`,
        text: verseText,
      })
    }
  }

  const getChapterText = () => {
    if (!chapterData) return ""
    return chapterData.verses.map((v) => v.text).join(" ")
  }

  const navigateChapter = (direction: "prev" | "next") => {
    const bookInfo = getBookInfo(book)
    if (!bookInfo) return

    let newChapter = chapter
    const newBook = book

    if (direction === "next") {
      if (chapter < bookInfo.chapters) {
        newChapter = chapter + 1
      } else {
        // For now, just stay on the last chapter
        // TODO: Implement navigation to next book
        return
      }
    } else {
      if (chapter > 1) {
        newChapter = chapter - 1
      } else {
        // For now, just stay on the first chapter
        // TODO: Implement navigation to previous book
        return
      }
    }

    // Update the current page
    const normalizedBook = normalizeBookName(newBook)
    if (normalizedBook) {
      window.history.pushState({}, "", `/bible/${encodeURIComponent(book)}/${newChapter}`)
      window.location.reload()
    }
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} />
          <p className="font-medium">Chapter Not Available</p>
        </div>
        <p className="text-sm mt-1">{error}</p>
        <div className="mt-4 space-y-3">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">What you can do:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Try a different chapter (e.g., Proverbs 1)</li>
              <li>Try a popular book like John, Psalms, or Genesis</li>
              <li>Upload full Bible data using the admin tools</li>
              <li>Check if the translation is available</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchChapter}
              className="text-sm underline hover:no-underline bg-destructive/20 px-3 py-1 rounded"
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/bible/john/3")}
              className="text-sm underline hover:no-underline bg-blue-100 px-3 py-1 rounded"
            >
              Go to John 3:16
            </button>
            <button
              onClick={() => (window.location.href = "/bible/psalms/23")}
              className="text-sm underline hover:no-underline bg-green-100 px-3 py-1 rounded"
            >
              Go to Psalm 23
            </button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            <p className="font-medium">Debug Info:</p>
            <p>
              Requested: {book} {chapter} ({translation.toUpperCase()})
            </p>
            <p>Normalized: {normalizeBookName(book) || "Unknown"}</p>
            <p>Available sample books: John, Psalms, Genesis, Matthew, Romans, Philippians, Proverbs</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading chapter...</span>
      </div>
    )
  }

  if (!chapterData) {
    return <div className="p-6 text-center text-muted-foreground">Chapter not found</div>
  }

  const bookInfo = getBookInfo(book)
  const displayName = chapterData.bookDisplayName || bookInfo?.name || book

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">
            {displayName} {chapterData.chapter}
          </h1>
          <p className="text-muted-foreground">{chapterData.translation.toUpperCase()}</p>
          <p className="text-sm text-muted-foreground">{chapterData.verses.length} verses</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          >
            {availableTranslations.map((trans) => (
              <option key={trans} value={trans}>
                {trans.toUpperCase()}
              </option>
            ))}
          </select>

          <TextToSpeech text={getChapterText()} label="Listen to chapter" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigateChapter("prev")}
          disabled={chapter <= 1}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen size={16} />
          <span>
            Chapter {chapter} of {bookInfo?.chapters || "?"}
          </span>
        </div>

        <button
          onClick={() => navigateChapter("next")}
          disabled={chapter >= (bookInfo?.chapters || 1)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Chapter Content */}
      <div className="space-y-4">
        {chapterData.verses.map((verse) => (
          <div
            key={verse.verse}
            className={`group relative p-4 rounded-lg transition-all cursor-pointer ${
              selectedVerse === verse.verse
                ? "bg-primary/10 border border-primary/20"
                : highlightVerse === verse.verse
                  ? "bg-yellow-100/50 dark:bg-yellow-900/20"
                  : "hover:bg-muted/50"
            }`}
            onClick={() => handleVerseClick(verse.verse)}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                {verse.verse}
              </span>
              <p className="flex-1 text-lg leading-relaxed">{verse.text}</p>
            </div>

            {/* Verse Actions */}
            <div
              className={`absolute right-4 top-4 transition-opacity ${
                selectedVerse === verse.verse ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-1 bg-background border rounded-lg p-2 shadow-lg">
                <TextToSpeech text={verse.text} size="sm" label={`Listen to verse ${verse.verse}`} />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveVerse(verse.verse, verse.text)
                  }}
                  className="p-1 hover:bg-muted rounded"
                  title="Save verse"
                >
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chapter Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={() => navigateChapter("prev")}
          disabled={chapter <= 1}
          className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous Chapter
        </button>

        <button
          onClick={() => navigateChapter("next")}
          disabled={chapter >= (bookInfo?.chapters || 1)}
          className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Chapter
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
