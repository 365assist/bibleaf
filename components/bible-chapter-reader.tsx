"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Heart } from "lucide-react"
import { type BibleChapter, BibleService } from "@/lib/bible-service"
import TextToSpeech from "./text-to-speech"

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
  const [translation, setTranslation] = useState("NIV")

  useEffect(() => {
    fetchChapter()
  }, [book, chapter, translation])

  const fetchChapter = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch chapter")
      }

      const data = await response.json()
      setChapterData(data)
    } catch (err) {
      setError("Failed to load chapter. Please try again.")
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
      onSaveVerse({
        reference: `${book} ${chapter}:${verseNumber}`,
        text: verseText,
      })
    }
  }

  const getChapterText = () => {
    if (!chapterData) return ""
    return chapterData.verses.map((v) => v.text).join(" ")
  }

  const navigateChapter = (direction: "prev" | "next") => {
    const bookInfo = BibleService.getBook(book)
    if (!bookInfo) return

    let newChapter = chapter
    let newBook = book

    if (direction === "next") {
      if (chapter < bookInfo.chapters) {
        newChapter = chapter + 1
      } else {
        // Move to next book
        const books = BibleService.getBooks()
        const currentIndex = books.findIndex((b) => b.name === book)
        if (currentIndex < books.length - 1) {
          newBook = books[currentIndex + 1].name
          newChapter = 1
        }
      }
    } else {
      if (chapter > 1) {
        newChapter = chapter - 1
      } else {
        // Move to previous book
        const books = BibleService.getBooks()
        const currentIndex = books.findIndex((b) => b.name === book)
        if (currentIndex > 0) {
          const prevBook = books[currentIndex - 1]
          newBook = prevBook.name
          newChapter = prevBook.chapters
        }
      }
    }

    // In a real app, you'd update the URL here
    window.location.href = `/bible/${encodeURIComponent(newBook)}/${newChapter}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading chapter...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <p className="font-medium">Error Loading Chapter</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={fetchChapter} className="text-sm underline mt-2 hover:no-underline">
          Try again
        </button>
      </div>
    )
  }

  if (!chapterData) {
    return <div className="p-6 text-center text-muted-foreground">Chapter not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">
            {chapterData.book} {chapterData.chapter}
          </h1>
          <p className="text-muted-foreground">{chapterData.translation}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="NIV">NIV</option>
            <option value="ESV">ESV</option>
            <option value="KJV">KJV</option>
            <option value="NASB">NASB</option>
          </select>

          <TextToSpeech text={getChapterText()} label="Listen to chapter" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigateChapter("prev")}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen size={16} />
          <span>{chapterData.verses.length} verses</span>
        </div>

        <button
          onClick={() => navigateChapter("next")}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
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
          className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft size={16} />
          Previous Chapter
        </button>

        <button
          onClick={() => navigateChapter("next")}
          className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
        >
          Next Chapter
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
