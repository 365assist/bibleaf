"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Book, Calendar, Shuffle, BarChart3, ChevronRight, Download } from "lucide-react"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

interface BibleBook {
  id: string
  name: string
  chapters: number
  testament: "old" | "new"
}

interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
  translation: string
}

interface BibleStats {
  totalTranslations: number
  totalBooks: number
  totalChapters: number
  totalVerses: number
  lastUpdated: string
  availableBooks: string[]
}

export default function TestFullBiblePage() {
  const [stats, setStats] = useState<BibleStats | null>(null)
  const [books, setBooks] = useState<BibleBook[]>([])
  const [selectedTranslation, setSelectedTranslation] = useState("kjv")
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [chapter, setChapter] = useState<BibleChapter | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)
  const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedTranslation) {
      loadBooks()
    }
  }, [selectedTranslation])

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      loadChapter()
    }
  }, [selectedBook, selectedChapter, selectedTranslation])

  const loadInitialData = async () => {
    setError(null)
    try {
      await Promise.all([loadStats(), loadDailyVerse()])
    } catch (err) {
      setError("Failed to load Bible data")
      console.error(err)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/bible/stats")
      if (!response.ok) throw new Error(`Failed to load stats: ${response.status}`)

      const data = await response.json()
      if (data.success && data.stats) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error("Error loading Bible statistics:", err)
    }
  }

  const loadBooks = async () => {
    try {
      const response = await fetch(`/api/bible/books?translation=${selectedTranslation}`)
      if (!response.ok) throw new Error(`Failed to load books: ${response.status}`)

      const data = await response.json()
      if (data.success && data.books) {
        setBooks(data.books)
        if (data.books.length > 0 && !selectedBook) {
          setSelectedBook(data.books[0].id)
        }
      }
    } catch (err) {
      console.error("Error loading books:", err)
    }
  }

  const loadChapter = async () => {
    if (!selectedBook || !selectedChapter) return

    setLoading(true)
    try {
      const response = await fetch("/api/bible/chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translation: selectedTranslation,
          book: selectedBook,
          chapter: selectedChapter,
        }),
      })

      if (!response.ok) throw new Error(`Failed to load chapter: ${response.status}`)

      const data = await response.json()
      if (data.success && data.chapter) {
        setChapter(data.chapter)
      } else {
        setChapter(null)
      }
    } catch (err) {
      console.error("Error loading chapter:", err)
      setChapter(null)
    } finally {
      setLoading(false)
    }
  }

  const loadDailyVerse = async () => {
    try {
      const response = await fetch("/api/bible/daily-verse")
      if (!response.ok) return

      const data = await response.json()
      if (data.success && data.verse) {
        setDailyVerse(data.verse)
      }
    } catch (err) {
      console.error("Error loading daily verse:", err)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bible/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          translation: selectedTranslation,
          limit: 50,
        }),
      })

      if (!response.ok) throw new Error(`Search failed: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setSearchResults(data.results || [])
      }
    } catch (err) {
      setError("Error searching Bible")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRandomVerse = async () => {
    try {
      const response = await fetch(`/api/bible/verse?random=true&translation=${selectedTranslation}`)
      if (!response.ok) return

      const data = await response.json()
      if (data.success && data.verse) {
        setRandomVerse(data.verse)
      }
    } catch (err) {
      console.error("Error getting random verse:", err)
    }
  }

  const formatVerseReference = (verse: BibleVerse) => {
    const book = books.find((b) => b.id === verse.book)
    return `${book?.name || verse.book} ${verse.chapter}:${verse.verse}`
  }

  const getBookName = (bookId: string) => {
    const book = books.find((b) => b.id === bookId)
    return book?.name || bookId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Bible Database
          </h1>
          <p className="text-xl text-muted-foreground">Full Bible translations with 31,000+ verses</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Download size={20} />
            <span className="text-sm">Complete public domain Bible translations</span>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Database Statistics */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={24} />
                Complete Bible Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalTranslations}</div>
                  <div className="text-sm text-muted-foreground">Translations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.totalBooks}</div>
                  <div className="text-sm text-muted-foreground">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalChapters}</div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.totalVerses.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Verses</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Last updated: {new Date(stats.lastUpdated).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Translation and Book Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book size={24} />
              Bible Reader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Translation</label>
                <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kjv">KJV - King James Version</SelectItem>
                    <SelectItem value="web">WEB - World English Bible</SelectItem>
                    <SelectItem value="asv">ASV - American Standard</SelectItem>
                    <SelectItem value="ylt">YLT - Young's Literal</SelectItem>
                    <SelectItem value="darby">DARBY - Darby Translation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Book</label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chapter</label>
                <Select
                  value={selectedChapter.toString()}
                  onValueChange={(value) => setSelectedChapter(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBook &&
                      books.find((b) => b.id === selectedBook) &&
                      Array.from({ length: books.find((b) => b.id === selectedBook)!.chapters }, (_, i) => i + 1).map(
                        (chapterNum) => (
                          <SelectItem key={chapterNum} value={chapterNum.toString()}>
                            Chapter {chapterNum}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={loadChapter} disabled={loading || !selectedBook}>
                  {loading ? "Loading..." : "Load Chapter"}
                </Button>
              </div>
            </div>

            {/* Chapter Display */}
            {chapter && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4">
                  {getBookName(chapter.book)} Chapter {chapter.chapter} ({chapter.translation})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  {chapter.verses.map((verse) => (
                    <div key={verse.verse} className="flex gap-3">
                      <span className="text-sm font-bold text-blue-600 min-w-[2rem]">{verse.verse}</span>
                      <span className="text-sm leading-relaxed">{verse.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Verse */}
        {dailyVerse && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={24} />
                Daily Verse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg italic mb-4">"{dailyVerse.text}"</blockquote>
              <div className="text-right">
                <Badge variant="outline">
                  {formatVerseReference(dailyVerse)} ({dailyVerse.translation})
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={24} />
              Bible Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search across all Bible books... (e.g., 'love', 'faith', 'salvation')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Search Results ({searchResults.length} verses found)</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {searchResults.map((verse, index) => (
                    <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <p className="mb-2">"{verse.text}"</p>
                      <div className="text-right">
                        <Badge variant="outline">
                          {formatVerseReference(verse)} ({verse.translation})
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Random Verse */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle size={24} />
              Random Verse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={getRandomVerse} className="mb-4">
              Get Random Verse
            </Button>

            {randomVerse && (
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <blockquote className="text-lg italic mb-4">"{randomVerse.text}"</blockquote>
                <div className="text-right">
                  <Badge variant="outline">
                    {formatVerseReference(randomVerse)} ({randomVerse.translation})
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Test Searches */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Bible Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                "love",
                "faith",
                "hope",
                "peace",
                "joy",
                "strength",
                "wisdom",
                "grace",
                "salvation",
                "forgiveness",
                "prayer",
                "trust",
                "courage",
                "mercy",
                "blessing",
                "eternal",
              ].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term)
                    setTimeout(() => handleSearch(), 100)
                  }}
                  className="justify-start"
                >
                  <ChevronRight size={16} className="mr-1" />
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
