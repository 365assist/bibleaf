"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, BookOpen, Heart, Sparkles } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  reference: string
  text: string
  relevanceScore: number
  context?: string
}

interface AIBibleSearchProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onSearchComplete?: () => void
}

export default function AIBibleSearch({ userId, onSaveVerse, onSearchComplete }: AIBibleSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [limitExceeded, setLimitExceeded] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setIsLoading(true)
      setError("")
      setResults([])
      setLimitExceeded(false)

      console.log("Starting search for:", query.trim())

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

      console.log("Response status:", response.status)

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        throw new Error("Server returned non-JSON response. Please try again.")
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        if (data.limitExceeded) {
          setLimitExceeded(true)
          setError(data.message || "Daily search limit exceeded")
        } else {
          throw new Error(data.error || "Search failed")
        }
        return
      }

      if (data.results && Array.isArray(data.results)) {
        console.log("Setting results:", data.results)
        setResults(data.results)

        // Notify parent component that search was completed successfully
        console.log("Search completed successfully, calling onSearchComplete")
        if (onSearchComplete) {
          onSearchComplete()
        }
      } else {
        console.warn("No results in response or results not an array:", data)
        setResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to search. Please try again.")
      }
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

  const handleExampleSearch = (exampleQuery: string) => {
    setQuery(exampleQuery)
    // Trigger search automatically with a slight delay to ensure state is updated
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSearch(fakeEvent)
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* AI Search Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800/50 shadow-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300">AI Bible Search</h2>
            <p className="text-amber-700/70 dark:text-amber-400/70">Ask anything about Scripture</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
          <input
            type="text"
            placeholder="Ask anything... 'verses about overcoming fear' or 'what does the Bible say about forgiveness?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-200 dark:border-amber-800/50 shadow-sm"
            disabled={isLoading || limitExceeded}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim() || limitExceeded}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Searching Scripture...
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
        <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50 shadow-md">
          <p className="font-medium text-lg mb-1">Search Error</p>
          <p className="text-sm mb-3">{error}</p>
          {limitExceeded && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md border border-amber-200 dark:border-amber-800/50">
              <p className="text-amber-800 dark:text-amber-300 font-medium">Daily Search Limit Reached</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                You've reached your daily limit for AI Bible searches.
              </p>
              <Link href="/pricing">
                <button className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md text-sm font-medium shadow-sm transition-all duration-200">
                  Upgrade Your Plan →
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg animate-pulse">
              <Search className="w-10 h-10 text-white animate-bounce" />
            </div>
            <p className="text-amber-800 dark:text-amber-300 font-medium">AI is analyzing your query...</p>
            <p className="text-sm text-amber-700/70 dark:text-amber-400/70">Finding the most relevant Bible verses</p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <BookOpen className="text-amber-600" size={18} />
            Search Results ({results.length} verses found)
          </h3>

          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 space-y-4 border-l-4 border-amber-500 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-lg">{result.reference}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                    {Math.round(result.relevanceScore * 100)}% match
                  </span>
                  <button
                    onClick={() => handleSaveVerse(result)}
                    className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-colors"
                    title="Save verse"
                  >
                    <Heart size={16} className="text-amber-600 dark:text-amber-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">{result.text}</p>

              {result.context && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border-l-2 border-amber-300 dark:border-amber-600">
                  <p className="text-sm text-amber-700/80 dark:text-amber-400/80 italic">{result.context}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <BookOpen size={14} className="text-amber-600 dark:text-amber-400" />
                <Link
                  href={`/bible/${encodeURIComponent(result.reference.split(" ")[0])}/${result.reference.split(" ")[1]?.split(":")[0] || "1"}${result.reference.includes(":") ? `?verse=${result.reference.split(":")[1]}` : ""}`}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline-offset-4 hover:underline"
                >
                  Read full chapter →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && query && results.length === 0 && !error && (
        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-amber-200 dark:border-amber-800/50">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-amber-800 dark:text-amber-300 mb-2">No results found for "{query}"</p>
          <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
            Try rephrasing your question or using different keywords
          </p>
        </div>
      )}

      {/* Example Queries */}
      {results.length === 0 && !isLoading && !error && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-amber-200 dark:border-amber-800/50">
          <h4 className="font-medium mb-4 text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Sparkles className="text-amber-500" size={16} />
            Try asking:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                onClick={() => handleExampleSearch(example)}
                className="text-left text-sm text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 p-3 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800/50 shadow-sm hover:shadow"
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
