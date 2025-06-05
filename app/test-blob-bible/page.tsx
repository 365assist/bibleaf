"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BarChart3, Calendar, Shuffle, Upload, Cloud } from "lucide-react"

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
}

interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  year: number
  copyright: string
  isPublicDomain: boolean
}

export default function TestBlobBiblePage() {
  const [stats, setStats] = useState<BibleStats | null>(null)
  const [translations, setTranslations] = useState<BibleTranslation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)
  const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setError(null)
    try {
      await Promise.all([loadStats(), loadTranslations(), loadDailyVerse()])
    } catch (err) {
      setError("Failed to load initial Bible data from blob storage")
      console.error(err)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/bible/stats")
      if (!response.ok) {
        throw new Error(`Failed to load stats: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.stats) {
        setStats(data.stats)
      } else {
        throw new Error(data.error || "Invalid stats data")
      }
    } catch (err) {
      console.error("Error loading Bible statistics:", err)
      throw err
    }
  }

  const loadTranslations = async () => {
    try {
      const response = await fetch("/api/bible/translations")
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.translations) {
        setTranslations(data.translations)
      } else {
        throw new Error(data.error || "Invalid translations data")
      }
    } catch (err) {
      console.error("Error loading Bible translations:", err)
      throw err
    }
  }

  const loadDailyVerse = async () => {
    try {
      const response = await fetch("/api/bible/daily-verse")
      if (!response.ok) {
        throw new Error(`Failed to load daily verse: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.verse) {
        setDailyVerse(data.verse)
      } else {
        console.warn("Daily verse not available:", data.error)
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          translation: "kjv",
          limit: 20,
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setSearchResults(data.results || [])
      } else {
        throw new Error(data.error || "Search failed")
      }
    } catch (err) {
      setError("Error searching Bible in blob storage")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRandomVerse = async () => {
    try {
      const response = await fetch("/api/bible/verse?random=true")
      if (!response.ok) {
        throw new Error(`Failed to get random verse: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.verse) {
        setRandomVerse(data.verse)
      } else {
        console.warn("Random verse not available:", data.error)
      }
    } catch (err) {
      console.error("Error getting random verse:", err)
    }
  }

  const uploadSampleData = async () => {
    setUploading(true)
    try {
      // This would trigger the upload script
      const response = await fetch("/api/bible/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "upload-samples",
        }),
      })

      if (response.ok) {
        console.log("Sample data upload initiated")
        // Reload data after upload
        setTimeout(() => {
          loadInitialData()
        }, 2000)
      }
    } catch (err) {
      console.error("Error uploading sample data:", err)
    } finally {
      setUploading(false)
    }
  }

  const formatVerseReference = (verse: BibleVerse) => {
    return `${verse.book} ${verse.chapter}:${verse.verse}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blob Storage Bible Database
          </h1>
          <p className="text-xl text-muted-foreground">Testing Bible data stored in Vercel Blob</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Cloud size={20} />
            <span className="text-sm">Powered by Vercel Blob Storage</span>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Upload Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={24} />
              Blob Storage Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={uploadSampleData} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Sample Data"}
              </Button>
              <Button onClick={loadInitialData} variant="outline">
                Refresh Data
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Upload sample Bible data to Vercel Blob storage for testing
            </p>
          </CardContent>
        </Card>

        {/* Database Statistics */}
        {stats ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={24} />
                Blob Storage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalTranslations}</div>
                  <div className="text-sm text-muted-foreground">Translations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
                  <div className="text-sm text-muted-foreground">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalChapters}</div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalVerses}</div>
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
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <div className="animate-pulse">Loading Bible statistics from blob storage...</div>
            </CardContent>
          </Card>
        )}

        {/* Available Translations */}
        {translations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Translations in Blob Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {translations.map((translation) => (
                  <Badge key={translation.id} variant="outline">
                    {translation.abbreviation} - {translation.name} ({translation.year})
                    {translation.isPublicDomain && " 🔓"}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Verse */}
        {dailyVerse ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={24} />
                Daily Verse from Blob Storage
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
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={24} />
                Daily Verse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-pulse">Loading daily verse from blob storage...</div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={24} />
              Bible Search in Blob Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for verses... (e.g., 'love', 'faith', 'hope')"
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
              Random Verse from Blob Storage
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
                    setTimeout(() => handleSearch(), 100)
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
