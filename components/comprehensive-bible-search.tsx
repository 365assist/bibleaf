"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Book, Loader2, Database, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
  reference?: string
  relevanceScore?: number
  context?: string
}

interface BibleStats {
  available: boolean
  translations: string[]
  totalVerses: number
}

interface SearchResponse {
  success: boolean
  results?: BibleVerse[]
  verses?: BibleVerse[]
  query: string
  translation: string
  count: number
  source?: string
  error?: string
  debug?: any
}

export default function ComprehensiveBibleSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTranslation, setSelectedTranslation] = useState("kjv")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [bibleStats, setBibleStats] = useState<BibleStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    checkBibleAvailability()
  }, [])

  const checkBibleAvailability = async () => {
    try {
      console.log("Checking Bible availability...")
      const response = await fetch("/api/bible/stats")
      if (response.ok) {
        const data = await response.json()
        console.log("Bible stats response:", data)
        if (data.success) {
          setBibleStats({
            available: true,
            translations: ["kjv", "web", "asv", "ylt", "darby"],
            totalVerses: data.stats?.totalVerses || 31102,
          })
        } else {
          // Fallback stats if API fails
          setBibleStats({
            available: true,
            translations: ["kjv", "web"],
            totalVerses: 31102,
          })
        }
      } else {
        console.warn("Bible stats API failed, using fallback")
        // Fallback stats if API fails
        setBibleStats({
          available: true,
          translations: ["kjv", "web"],
          totalVerses: 31102,
        })
      }
    } catch (err) {
      console.error("Error checking Bible availability:", err)
      // Fallback stats
      setBibleStats({
        available: true,
        translations: ["kjv", "web"],
        totalVerses: 31102,
      })
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log(`Searching for: "${searchQuery}" in ${selectedTranslation}`)

      const response = await fetch("/api/bible/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          translation: selectedTranslation,
          limit: 50,
        }),
      })

      console.log("Search response status:", response.status)

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`)
      }

      const data: SearchResponse = await response.json()
      console.log("Search response data:", data)

      setDebugInfo(data.debug)

      if (data.success) {
        const results = data.results || data.verses || []
        setSearchResults(results)

        if (results.length === 0) {
          setError(
            `No verses found for "${searchQuery}". Search method: ${data.source || "unknown"}. Try different search terms or check the debug info below.`,
          )
        } else {
          console.log(`Found ${results.length} verses using ${data.source}`)
        }
      } else {
        setError(data.error || "Search failed")
        console.error("Search failed:", data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Error searching Bible: ${errorMessage}`)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatVerseReference = (verse: BibleVerse) => {
    if (verse.reference) {
      return verse.reference
    }
    const bookName = verse.book.charAt(0).toUpperCase() + verse.book.slice(1)
    return `${bookName} ${verse.chapter}:${verse.verse}`
  }

  const popularSearches = [
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
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={24} />
          Complete Bible Search
          {bibleStats?.available && (
            <Badge variant="secondary" className="ml-2">
              {bibleStats.totalVerses.toLocaleString()} verses
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Search across multiple Bible translations with comprehensive verse database
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Interface */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search the entire Bible... (e.g., 'love your enemies', 'faith hope love', 'John 3:16')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-base"
              />
            </div>
            <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kjv">KJV</SelectItem>
                <SelectItem value="web">WEB</SelectItem>
                <SelectItem value="asv">ASV</SelectItem>
                <SelectItem value="ylt">YLT</SelectItem>
                <SelectItem value="darby">DARBY</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* Popular Searches */}
          <div>
            <p className="text-sm font-medium mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term)
                    setTimeout(() => handleSearch(), 100)
                  }}
                  className="text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-blue-600" />
              <span className="text-sm font-medium">Search Debug Info</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🔍 Search Method: {debugInfo.searchMethod || "unknown"}</p>
              <p>📚 Available Translations: {debugInfo.translationsAvailable?.length || 0}</p>
              <p>🔤 Original Query: "{debugInfo.originalQuery}"</p>
              {debugInfo.errorMessage && <p className="text-red-600">❌ Error: {debugInfo.errorMessage}</p>}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-600">Search Issue</span>
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Search Results ({searchResults.length} verses found)
                {debugInfo?.searchMethod && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    via {debugInfo.searchMethod}
                  </Badge>
                )}
              </h3>
              <Badge variant="outline">{selectedTranslation.toUpperCase()}</Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.map((verse, index) => (
                <div
                  key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`}
                  className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Book size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed mb-2">"{verse.text}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {formatVerseReference(verse)}
                          </Badge>
                          {verse.relevanceScore && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(verse.relevanceScore * 100)}% match
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                          <Link href={`/bible/${verse.book}/${verse.chapter}`} target="_blank">
                            Read Chapter <ChevronRight size={12} />
                          </Link>
                        </Button>
                      </div>
                      {verse.context && <p className="text-xs text-muted-foreground mt-2 italic">{verse.context}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bible Database Status */}
        {bibleStats && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className="text-blue-600" />
              <span className="text-sm font-medium">Bible Database Status</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✅ {bibleStats.translations.length} translations available</p>
              <p>✅ {bibleStats.totalVerses.toLocaleString()} verses searchable</p>
              <p>✅ Full-text search across all books</p>
              <p>🔧 Enhanced AI-powered search with relevance scoring</p>
            </div>
          </div>
        )}

        {/* Test Search Button */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Quick Test</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("John 3:16")
                setTimeout(() => handleSearch(), 100)
              }}
            >
              Test "John 3:16"
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("love")
                setTimeout(() => handleSearch(), 100)
              }}
            >
              Test "love"
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("faith hope")
                setTimeout(() => handleSearch(), 100)
              }}
            >
              Test "faith hope"
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
