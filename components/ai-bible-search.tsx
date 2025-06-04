"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, BookOpen, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import VerseContextViewer from "./verse-context-viewer"

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
  const [isFallback, setIsFallback] = useState(false)

  const [searchFilters, setSearchFilters] = useState({
    testament: "all", // 'all', 'old', 'new'
    books: [] as string[],
    translation: "NIV",
    sortBy: "relevance", // 'relevance', 'biblical'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [crossReferences, setCrossReferences] = useState<SearchResult[]>([])
  const [showContextViewer, setShowContextViewer] = useState<string | null>(null)

  // Remove this line:
  // const [retryCount, setRetryCount] = useState(0)

  // Modify the handleSearch function to include retry logic
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setIsLoading(true)
      setError("")
      setResults([])
      setLimitExceeded(false)
      setIsFallback(false)

      console.log("Starting search for:", query.trim())

      // Use a try-catch block for the fetch operation itself
      let response
      try {
        response = await fetch("/api/ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            userId,
          }),
        })
      } catch (fetchError) {
        console.error("Network error during fetch:", fetchError)
        // Use fallback results immediately on network error
        setIsFallback(true)
        setResults(getFallbackResults(query.trim()))
        return
      }

      console.log("Response status:", response.status)

      // Always try to parse as JSON first
      let data
      try {
        const responseText = await response.text()
        console.log("Raw response:", responseText.substring(0, 200) + "...")

        if (!responseText.trim()) {
          throw new Error("Empty response from server")
        }

        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        // Use fallback results instead of throwing
        setIsFallback(true)
        setResults(getFallbackResults(query.trim()))
        return
      }

      console.log("Parsed response data:", data)

      // Handle API errors (even with 200 status)
      if (!data.success) {
        if (data.limitExceeded) {
          setLimitExceeded(true)
          setError(data.message || "Daily search limit exceeded")
        } else {
          // Use fallback on API error
          setIsFallback(true)
          setResults(getFallbackResults(query.trim()))
        }
        return
      }

      // Handle successful response
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        console.log("Setting results:", data.results.length, "verses found")
        setResults(data.results)

        // Show fallback notice if applicable
        if (data.fallback) {
          console.log("Using fallback results due to AI service unavailability")
          setIsFallback(true)
        }

        // Notify parent component that search was completed successfully
        if (onSearchComplete) {
          onSearchComplete()
        }
      } else {
        // No results from API, use fallback
        console.log("No results from API, using fallback")
        setIsFallback(true)
        setResults(getFallbackResults(query.trim()))
      }
    } catch (error) {
      console.error("Search error:", error)
      // Use fallback results on any error
      setIsFallback(true)
      setResults(getFallbackResults(query.trim()))
    } finally {
      setIsLoading(false)
    }
  }

  // Client-side fallback results
  const getFallbackResults = (query: string): SearchResult[] => {
    const queryLower = query.toLowerCase().replace(/\s+/g, "")

    // Handle specific verse references first
    if (queryLower.includes("john3:16") || queryLower.includes("john316")) {
      return [
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          relevanceScore: 1.0,
          context:
            "The most famous verse in the Bible, summarizing the gospel message of God's love and salvation through Christ.",
        },
      ]
    }

    if (queryLower.includes("romans8:28") || queryLower.includes("romans828")) {
      return [
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          relevanceScore: 1.0,
          context: "Paul's assurance that God sovereignly works all circumstances for the ultimate good of believers.",
        },
      ]
    }

    // Handle thematic searches
    if (queryLower.includes("love")) {
      return [
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          relevanceScore: 0.95,
          context: "The most famous verse about God's love for humanity.",
        },
        {
          reference: "1 John 4:8",
          text: "Whoever does not love does not know God, because God is love.",
          relevanceScore: 0.9,
          context: "John declares that love is not just an attribute of God, but His very essence.",
        },
      ]
    }

    if (queryLower.includes("faith")) {
      return [
        {
          reference: "Hebrews 11:1",
          text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
          relevanceScore: 0.9,
          context: "The biblical definition of faith as confident trust in God's promises.",
        },
      ]
    }

    // Default fallback
    return [
      {
        reference: "Psalm 119:105",
        text: "Your word is a lamp for my feet, a light for my path.",
        relevanceScore: 0.8,
        context: "God's Word provides guidance and illumination for life's journey.",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        relevanceScore: 0.8,
        context: "God sovereignly works all circumstances for the ultimate good of believers.",
      },
    ]
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
    // Reset states before search
    setResults([])
    setError("")
    setIsFallback(false)

    // Trigger search with a small delay to ensure state is updated
    setTimeout(() => {
      const fakeEvent = {
        preventDefault: () => {},
        target: { value: exampleQuery },
      } as any
      handleSearch(fakeEvent)
    }, 50)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-blue-50 via-amber-50 to-blue-100 dark:from-blue-900/20 dark:via-amber-900/20 dark:to-blue-800/20 rounded-2xl overflow-hidden shadow-xl border border-amber-200 dark:border-amber-800/50">
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Left Content */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300">AI Bible Search</h2>
                <p className="text-amber-700/70 dark:text-amber-400/70">Discover Scripture with AI-powered insights</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Experience the Bible like never before. Our AI understands your questions and finds the perfect verses
                with deep theological context.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>31,000+ Verses</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Heart className="w-4 h-4" />
                  <span>Contextual Guidance</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Search className="w-4 h-4" />
                  <span>Smart Search</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/ai-jesus-teaching-children.png"
                alt="AI-powered biblical teaching - Jesus with children by the lake, representing modern technology enhancing traditional biblical learning"
                width={600}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
          <input
            type="text"
            placeholder="Ask anything... 'John 3:16', 'verses about love', or 'what does the Bible say about forgiveness?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-white dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-200 dark:border-amber-800/50 shadow-lg"
            disabled={isLoading || limitExceeded}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim() || limitExceeded}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
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

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-200 dark:border-amber-800/50">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        >
          <span className="font-medium text-amber-800 dark:text-amber-300">Advanced Search Filters</span>
          <span className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}>▼</span>
        </button>

        {showFilters && (
          <div className="p-4 border-t border-amber-200 dark:border-amber-800/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Testament Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Testament</label>
                <select
                  value={searchFilters.testament}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, testament: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">All Scripture</option>
                  <option value="old">Old Testament</option>
                  <option value="new">New Testament</option>
                </select>
              </div>

              {/* Translation Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Translation</label>
                <select
                  value={searchFilters.translation}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, translation: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="NIV">NIV</option>
                  <option value="ESV">ESV</option>
                  <option value="KJV">King James</option>
                  <option value="NASB">NASB</option>
                  <option value="NLT">NLT</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort Results</label>
                <select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="relevance">By Relevance</option>
                  <option value="biblical">Biblical Order</option>
                </select>
              </div>
            </div>

            {/* Book-specific filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Specific Books (Optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {[
                  "Genesis",
                  "Exodus",
                  "Psalms",
                  "Proverbs",
                  "Isaiah",
                  "Matthew",
                  "John",
                  "Romans",
                  "Ephesians",
                  "1 Corinthians",
                  "2 Corinthians",
                  "Galatians",
                  "Philippians",
                  "Colossians",
                  "Hebrews",
                  "James",
                  "1 Peter",
                  "2 Peter",
                  "1 John",
                  "Revelation",
                ].map((book) => (
                  <label key={book} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={searchFilters.books.includes(book)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSearchFilters((prev) => ({ ...prev, books: [...prev.books, book] }))
                        } else {
                          setSearchFilters((prev) => ({ ...prev, books: prev.books.filter((b) => b !== book) }))
                        }
                      }}
                      className="rounded"
                    />
                    <span>{book}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800/50 shadow-lg">
          <p className="font-medium text-lg mb-1">Search Error</p>
          <p className="text-sm mb-3">{error}</p>
          {limitExceeded && (
            <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <p className="text-amber-800 dark:text-amber-300 font-medium">Daily Search Limit Reached</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                You've reached your daily limit for AI Bible searches.
              </p>
              <Link href="/pricing">
                <button className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200">
                  Upgrade Your Plan →
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Fallback Notice */}
      {isFallback && results.length > 0 && !error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-lg">
          <p className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Using basic search results
          </p>
          <p className="text-sm mt-1">
            Our AI search is temporarily unavailable. We've provided relevant verses based on your query.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl animate-pulse">
              <Search className="w-12 h-12 text-white animate-bounce" />
            </div>
            <p className="text-amber-800 dark:text-amber-300 font-medium text-lg">AI is analyzing your query...</p>
            <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
              Finding the most relevant Bible verses with deep insights
            </p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <BookOpen className="text-amber-600" size={20} />
            Search Results ({results.length} verses found)
          </h3>

          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-xl">{result.reference}</h4>
                <div className="flex items-center gap-3">
                  <select
                    className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded border-0"
                    defaultValue={searchFilters.translation}
                  >
                    <option value="NIV">NIV</option>
                    <option value="ESV">ESV</option>
                    <option value="KJV">KJV</option>
                    <option value="NASB">NASB</option>
                    <option value="NLT">NLT</option>
                  </select>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-medium">
                    {Math.round(result.relevanceScore * 100)}% match
                  </span>
                  <button
                    onClick={() => handleSaveVerse(result)}
                    className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-colors"
                    title="Save verse"
                  >
                    <Heart size={18} className="text-amber-600 dark:text-amber-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium">{result.text}</p>

              {result.context && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-2 border-amber-300 dark:border-amber-600">
                  <p className="text-sm text-amber-700/80 dark:text-amber-400/80 italic leading-relaxed">
                    <strong>Context:</strong> {result.context}
                  </p>
                </div>
              )}

              {/* Cross References Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <BookOpen size={16} />
                  Related Verses
                </h5>
                <div className="space-y-2">
                  {/* This would be populated by AI cross-reference lookup */}
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Romans 8:28</span> - "And we know that in all things God works for the
                    good..."
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Jeremiah 29:11</span> - "For I know the plans I have for you..."
                  </div>
                </div>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2">
                  View all cross-references →
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <BookOpen size={16} className="text-amber-600 dark:text-amber-400" />
                  <Link
                    href={`/bible/${encodeURIComponent(result.reference.split(" ")[0])}/${result.reference.split(" ")[1]?.split(":")[0] || "1"}${result.reference.includes(":") ? `?verse=${result.reference.split(":")[1]}` : ""}`}
                    className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline-offset-4 hover:underline font-medium"
                  >
                    Read full chapter →
                  </Link>
                  <button
                    onClick={() => setShowContextViewer(result.reference)}
                    className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline-offset-4 hover:underline font-medium"
                  >
                    Show more context
                  </button>
                </div>

                {/* Theological accuracy disclaimer */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span title="AI guidance should be verified with Scripture and pastoral counsel">
                    ⚠️ Verify with Scripture
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && query && results.length === 0 && !error && (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-200 dark:border-amber-800/50">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-amber-800 dark:text-amber-300 mb-2 text-lg font-medium">No results found for "{query}"</p>
          <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
            Try rephrasing your question or using different keywords
          </p>
        </div>
      )}

      {/* Example Queries */}
      {results.length === 0 && !isLoading && !error && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-amber-200 dark:border-amber-800/50">
          <h4 className="font-medium mb-6 text-amber-800 dark:text-amber-300 flex items-center gap-2 text-lg">
            <Sparkles className="text-amber-500" size={18} />
            Try these popular searches:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "John 3:16",
              "Romans 8:28",
              "Psalm 23:1",
              "verses about love",
              "what does the Bible say about forgiveness?",
              "passages about hope",
              "verses for strength",
              "biblical wisdom about relationships",
              "scriptures about faith",
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleExampleSearch(example)}
                className="text-left text-sm text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 p-4 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/50 shadow-sm hover:shadow-md"
              >
                <span className="font-medium">"{example}"</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Context Viewer Modal */}
      {showContextViewer && (
        <VerseContextViewer reference={showContextViewer} onClose={() => setShowContextViewer(null)} />
      )}
    </div>
  )
}
