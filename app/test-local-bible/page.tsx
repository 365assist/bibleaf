"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BarChart3, Calendar, Shuffle } from "lucide-react"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

interface BibleStats {
  totalTranslations: number
  totalBooks: number
  totalChapters: number
  totalVerses: number
  lastUpdated: string
  availableBooks: string[]
  sampleVerses: Array<{
    book: string
    chapter: number
    verse: number
    text: string
  }>
}

export default function TestLocalBiblePage() {
  const [stats, setStats] = useState<BibleStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)
  const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
    loadDailyVerse()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/bible/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError("Failed to load Bible statistics")
      }
    } catch (err) {
      setError("Error loading Bible statistics")
      console.error(err)
    }
  }

  const loadDailyVerse = async () => {
    try {
      const response = await fetch("/api/bible/daily-verse")
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
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.verses)
      } else {
        setError("Search failed")
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
      const response = await fetch("/api/bible/verse?random=true")
      const data = await response.json()

      if (data.success && data.verse) {
        setRandomVerse(data.verse)
      }
    } catch (err) {
      console.error("Error getting random verse:", err)
    }
  }

  const formatVerseReference = (verse: BibleVerse) => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Local Bible Database Test
          </h1>
          <p className="text-xl text-muted-foreground">Testing our self-hosted Bible database system</p>
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
          <Card className="mb-8 divine-light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={24} />
                Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.totalTranslations}</div>
                  <div className="text-sm text-muted-foreground">Translations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.totalBooks}</div>
                  <div className="text-sm text-muted-foreground">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.totalChapters}</div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.totalVerses}</div>
                  <div className="text-sm text-muted-foreground">Verses</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Available Books:</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.availableBooks.map((book) => (
                    <Badge key={book} variant="secondary">
                      {book}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(stats.lastUpdated).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Verse */}
        {dailyVerse && (
          <Card className="mb-8 divine-light-card">
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
        <Card className="mb-8 divine-light-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={24} />
              Bible Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for verses... (e.g., 'love', 'faith', 'hope')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
        <Card className="mb-8 divine-light-card">
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
        <Card className="divine-light-card">
          <CardHeader>
            <CardTitle>Quick Test Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["love", "faith", "hope", "peace", "joy", "strength", "wisdom", "grace"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term)
                    handleSearch()
                  }}
                >
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
