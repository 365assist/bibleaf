"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface BibleStats {
  database: {
    isReady: boolean
    translations: number
    books: number
    verses: number
    translationStats: Array<{ translation: string; verses: number }>
  }
  translations: number
  books: number
  availableTranslations: Array<{
    id: string
    name: string
    abbreviation: string
    isPublicDomain: boolean
  }>
  testaments: {
    old: number
    new: number
  }
}

interface SearchResult {
  reference: string
  text: string
  translation: string
  book: string
  chapter: number
  verse: number
}

export default function TestLocalBible() {
  const [stats, setStats] = useState<BibleStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [dailyVerse, setDailyVerse] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchDailyVerse()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/bible/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchDailyVerse = async () => {
    try {
      const response = await fetch("/api/bible/daily-verse")
      const data = await response.json()
      if (data.success) {
        setDailyVerse(data.verse)
      }
    } catch (error) {
      console.error("Error fetching daily verse:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/bible/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          translation: "kjv",
          limit: 10,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSearchResults(data.results)
      }
    } catch (error) {
      console.error("Error searching Bible:", error)
    } finally {
      setLoading(false)
    }
  }

  const testChapter = async () => {
    try {
      const response = await fetch("/api/bible/chapter?book=john&chapter=3&translation=kjv")
      const data = await response.json()
      console.log("Chapter test:", data)
    } catch (error) {
      console.error("Error testing chapter:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Local Bible Database Test</h1>
        <p className="text-muted-foreground">Testing our own Bible database with public domain translations</p>
      </div>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Database Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.database.verses}</div>
                <div className="text-sm text-muted-foreground">Total Verses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.books}</div>
                <div className="text-sm text-muted-foreground">Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.translations}</div>
                <div className="text-sm text-muted-foreground">Translations</div>
              </div>
              <div className="text-center">
                <Badge variant={stats.database.isReady ? "default" : "destructive"}>
                  {stats.database.isReady ? "Ready" : "Not Ready"}
                </Badge>
              </div>
            </div>
          ) : (
            <div>Loading stats...</div>
          )}
        </CardContent>
      </Card>

      {/* Available Translations */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Available Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.availableTranslations.map((translation) => (
                <Badge key={translation.id} variant="outline">
                  {translation.abbreviation} - {translation.name}
                  {translation.isPublicDomain && " (Public Domain)"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Verse */}
      {dailyVerse && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Verse</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">"{dailyVerse.text}"</blockquote>
            <p className="text-sm text-muted-foreground mt-2">
              — {dailyVerse.reference} ({dailyVerse.translation})
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Bible Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for verses (e.g., 'love', 'faith', 'hope')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Search Results ({searchResults.length})</h3>
              {searchResults.map((result, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4">
                  <p className="text-sm">{result.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.reference} ({result.translation})
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Test Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testChapter} variant="outline">
              Test John 3 (Check Console)
            </Button>
            <Button onClick={fetchStats} variant="outline">
              Refresh Stats
            </Button>
            <Button onClick={fetchDailyVerse} variant="outline">
              Refresh Daily Verse
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">To populate the Bible database:</p>
          <ol className="text-sm space-y-1 ml-4 list-decimal">
            <li>
              Run the download script: <code className="bg-gray-100 px-1 rounded">node scripts/download-bibles.js</code>
            </li>
            <li>This will download public domain Bible translations (KJV, WEB, ASV)</li>
            <li>
              Files will be saved to <code className="bg-gray-100 px-1 rounded">public/data/bibles/</code>
            </li>
            <li>The app will automatically load the data on startup</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            Currently using sample data. Run the download script to get complete Bible texts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
