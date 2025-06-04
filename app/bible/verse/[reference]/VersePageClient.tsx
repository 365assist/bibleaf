"use client"

import { notFound, redirect } from "next/navigation"
import { bibleBlobService } from "@/lib/bible-blob-service"
import { normalizeBookName } from "@/lib/bible-book-mapping"
import VerseWithEnhancedTTS from "@/components/verse-with-enhanced-tts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Share2 } from "lucide-react"

interface PageProps {
  params: {
    reference: string
  }
  searchParams: {
    translation?: string
  }
}

// Parse verse reference like "John3:16" or "John%203:16"
function parseVerseReference(reference: string): { book: string; chapter: number; verse: number } | null {
  try {
    // Decode URL encoding
    const decoded = decodeURIComponent(reference)

    // Handle different formats:
    // "John3:16", "John 3:16", "1John3:16", "1 John 3:16"
    const patterns = [
      /^(.+?)(\d+):(\d+)$/, // "John3:16" or "1John3:16"
      /^(.+?)\s+(\d+):(\d+)$/, // "John 3:16" or "1 John 3:16"
    ]

    for (const pattern of patterns) {
      const match = decoded.match(pattern)
      if (match) {
        const book = match[1].trim()
        const chapter = Number.parseInt(match[2])
        const verse = Number.parseInt(match[3])

        if (!isNaN(chapter) && !isNaN(verse)) {
          return { book, chapter, verse }
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error parsing verse reference:", error)
    return null
  }
}

export default async function VersePageClient({ params, searchParams }: PageProps) {
  const translation = searchParams.translation || "kjv"

  // Parse the verse reference
  const parsed = parseVerseReference(params.reference)

  if (!parsed) {
    console.log(`Invalid verse reference: ${params.reference}`)
    notFound()
  }

  const { book, chapter, verse } = parsed

  // Normalize book name
  const normalizedBook = normalizeBookName(book)
  if (!normalizedBook) {
    console.log(`Unknown book: ${book}`)
    notFound()
  }

  try {
    // Get the specific verse
    const verseData = await bibleBlobService.getVerse(translation, normalizedBook, chapter, verse)

    if (!verseData) {
      // If verse not found, redirect to chapter page
      redirect(`/bible/${encodeURIComponent(book)}/${chapter}?verse=${verse}`)
    }

    // Get the full chapter for context
    const chapterData = await bibleBlobService.getChapter(translation, normalizedBook, chapter)

    return (
      <div className="container py-8 max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href={`/bible/${encodeURIComponent(book)}/${chapter}`}>
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Full Chapter
            </Button>
          </Link>
        </div>

        {/* Verse Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {book} {chapter}:{verse}
            </CardTitle>
            <p className="text-center text-muted-foreground">{translation.toUpperCase()} Translation</p>
          </CardHeader>
          <CardContent>
            <VerseWithEnhancedTTS verse={verseData} showReference={false} className="text-lg leading-relaxed" />
          </CardContent>
        </Card>

        {/* Context Verses */}
        {chapterData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Context from {book} {chapter}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapterData.verses
                  .filter((v) => Math.abs(v.verse - verse) <= 2 && v.verse !== verse)
                  .sort((a, b) => a.verse - b.verse)
                  .map((contextVerse) => (
                    <div key={contextVerse.verse} className="p-4 rounded-lg bg-muted/50 border-l-4 border-muted">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-muted-foreground min-w-[2rem]">
                          {contextVerse.verse}
                        </span>
                        <p className="text-sm leading-relaxed">{contextVerse.text}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 text-center">
                <Link href={`/bible/${encodeURIComponent(book)}/${chapter}`}>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Full Chapter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${book} ${chapter}:${verse}`,
                  text: verseData.text,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(`${book} ${chapter}:${verse} - ${verseData.text}`)
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Verse
          </Button>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading verse:", error)
    notFound()
  }
}
