"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Languages,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Bookmark,
  Share2,
  Search,
} from "lucide-react"
import Link from "next/link"

interface Verse {
  number: number
  text: string
  originalText?: string
  commentary?: string
  crossReferences?: string[]
}

interface Chapter {
  book: string
  chapter: number
  verses: Verse[]
  introduction?: string
  outline?: string[]
}

interface EnhancedBibleReaderProps {
  book: string
  chapter: number
  highlightVerse?: number
  translation?: string
}

export default function EnhancedBibleReader({
  book,
  chapter,
  highlightVerse,
  translation = "NIV",
}: EnhancedBibleReaderProps) {
  const [chapterData, setChapterData] = useState<Chapter | null>(null)
  const [selectedTranslation, setSelectedTranslation] = useState(translation)
  const [showOriginalLanguage, setShowOriginalLanguage] = useState(false)
  const [showCommentary, setShowCommentary] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState<number | null>(highlightVerse || null)
  const [fontSize, setFontSize] = useState(16)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChapterData()
  }, [book, chapter, selectedTranslation])

  const loadChapterData = async () => {
    setIsLoading(true)
    try {
      // This would fetch from your Bible API
      const response = await fetch(
        `/api/bible/chapter?book=${book}&chapter=${chapter}&translation=${selectedTranslation}`,
      )
      const data = await response.json()
      setChapterData(data)
    } catch (error) {
      console.error("Failed to load chapter:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(selectedVerse === verseNumber ? null : verseNumber)
  }

  const navigateChapter = (direction: "prev" | "next") => {
    // Implementation for chapter navigation
    const newChapter = direction === "next" ? chapter + 1 : chapter - 1
    window.location.href = `/bible/${book}/${newChapter}`
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chapterData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Chapter not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">
                {book} {chapter}
              </CardTitle>
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="NIV">NIV</option>
                <option value="ESV">ESV</option>
                <option value="KJV">KJV</option>
                <option value="NASB">NASB</option>
                <option value="NLT">NLT</option>
                <option value="CSB">CSB</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOriginalLanguage(!showOriginalLanguage)}
                className={showOriginalLanguage ? "bg-blue-50 border-blue-200" : ""}
              >
                <Languages className="w-4 h-4 mr-2" />
                Original
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentary(!showCommentary)}
                className={showCommentary ? "bg-green-50 border-green-200" : ""}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Commentary
              </Button>

              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                  A-
                </Button>
                <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                  A+
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => navigateChapter("prev")} disabled={chapter <= 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Chapter
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Listen
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <Button variant="outline" onClick={() => navigateChapter("next")}>
              Next Chapter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Chapter Introduction */}
      {chapterData.introduction && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Chapter Introduction
            </h3>
            <p className="text-muted-foreground leading-relaxed">{chapterData.introduction}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bible Text */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
                {chapterData.verses.map((verse) => (
                  <div
                    key={verse.number}
                    className={`group cursor-pointer p-3 rounded-lg transition-all ${
                      selectedVerse === verse.number
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : highlightVerse === verse.number
                          ? "bg-yellow-50 border-l-4 border-yellow-500"
                          : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleVerseClick(verse.number)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-bold text-blue-600 mt-1 min-w-[2rem]">{verse.number}</span>
                      <div className="flex-1">
                        <p className="leading-relaxed">{verse.text}</p>

                        {/* Original Language */}
                        {showOriginalLanguage && verse.originalText && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border-l-2 border-blue-300">
                            <p className="text-sm font-medium text-blue-800 mb-1">Original Text:</p>
                            <p className="text-blue-700 font-mono text-right" dir="rtl">
                              {verse.originalText}
                            </p>
                          </div>
                        )}

                        {/* Commentary */}
                        {showCommentary && verse.commentary && (
                          <div className="mt-3 p-3 bg-green-50 rounded border-l-2 border-green-300">
                            <p className="text-sm font-medium text-green-800 mb-1">Commentary:</p>
                            <p className="text-green-700 text-sm leading-relaxed">{verse.commentary}</p>
                          </div>
                        )}

                        {/* Cross References */}
                        {selectedVerse === verse.number && verse.crossReferences && (
                          <div className="mt-3 p-3 bg-purple-50 rounded border-l-2 border-purple-300">
                            <p className="text-sm font-medium text-purple-800 mb-2">Cross References:</p>
                            <div className="flex flex-wrap gap-2">
                              {verse.crossReferences.map((ref, index) => (
                                <Link
                                  key={index}
                                  href={`/bible/${ref.split(" ")[0]}/${ref.split(" ")[1]?.split(":")[0]}`}
                                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                                >
                                  {ref}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Verse Actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Bookmark className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapter Outline */}
          {chapterData.outline && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chapter Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {chapterData.outline.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Selected Verse Details */}
          {selectedVerse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verse {selectedVerse} Study</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="commentary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="commentary">Notes</TabsTrigger>
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="cross-refs">Cross-Refs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="commentary" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Detailed commentary and application notes for this verse.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="original" className="mt-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium mb-1">Hebrew/Greek:</p>
                        <p className="font-mono text-right" dir="rtl">
                          Original text would appear here
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Words:</h4>
                        <div className="space-y-1 text-xs">
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="font-medium">Word:</span> Definition and significance
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cross-refs" className="mt-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">Related passages that illuminate this verse:</p>
                      <div className="space-y-2">
                        {["Romans 8:28", "Jeremiah 29:11", "Philippians 4:13"].map((ref) => (
                          <Link
                            key={ref}
                            href={`/bible/${ref.split(" ")[0]}/${ref.split(" ")[1]?.split(":")[0]}`}
                            className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm font-medium text-blue-600">{ref}</span>
                            <p className="text-xs text-muted-foreground mt-1">Brief preview of the verse content...</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Quick Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Jump to verse:</p>
                  <div className="grid grid-cols-5 gap-1">
                    {chapterData.verses.slice(0, 20).map((verse) => (
                      <Button
                        key={verse.number}
                        variant={selectedVerse === verse.number ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleVerseClick(verse.number)}
                      >
                        {verse.number}
                      </Button>
                    ))}
                  </div>
                  {chapterData.verses.length > 20 && (
                    <p className="text-xs text-muted-foreground mt-2">+ {chapterData.verses.length - 20} more verses</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
