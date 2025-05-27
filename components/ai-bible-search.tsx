"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, BookOpen, Heart } from "lucide-react"

interface SearchResult {
  reference: string
  text: string
  relevanceScore: number
  context?: string
}

interface AIBibleSearchProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
}

export default function AIBibleSearch({ userId, onSaveVerse }: AIBibleSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setIsLoading(true)
      setError("")
      setResults([])

      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limitExceeded) {
          setError(data.message || "Daily search limit exceeded")
        } else {
          throw new Error(data.error || "Search failed")
        }
        return
      }

      setResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveVerse = async (verse: SearchResult) => {
    if (onSaveVerse) {
      onSaveVerse({
        reference: verse.reference,
        text: verse.text,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Ask anything... 'verses about overcoming fear' or 'what does the Bible say about forgiveness?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Searching...
            </>
          ) : (
            <>
              <Search size={16} />
              Search Bible
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          <p className="font-medium">Search Error</p>
          <p className="text-sm mt-1">{error}</p>
          {error.includes("limit") && (
            <button
              onClick={() => (window.location.href = "/dashboard/profile")}
              className="text-sm underline mt-2 hover:no-underline"
            >
              Upgrade your plan →
            </button>
          )}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>

          {results.map((result, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-primary text-lg">{result.reference}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {Math.round(result.relevanceScore * 100)}% match
                  </span>
                  <button
                    onClick={() => handleSaveVerse(result)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    title="Save verse"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>

              <p className="text-foreground leading-relaxed text-base">{result.text}</p>

              {result.context && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground italic">{result.context}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <BookOpen size={14} className="text-muted-foreground" />
                <button className="text-sm text-primary hover:text-primary/80">Read full chapter →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Example Queries */}
      {results.length === 0 && !isLoading && !error && (
        <div className="bg-muted/30 p-6 rounded-lg">
          <h4 className="font-medium mb-3">Try asking:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "verses about overcoming anxiety",
              "what does the Bible say about forgiveness?",
              "passages about God's love",
              "verses for strength in difficult times",
              "biblical wisdom about relationships",
              "scriptures about hope and faith",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-background transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
