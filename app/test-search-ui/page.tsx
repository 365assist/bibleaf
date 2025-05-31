"use client"

import { useState } from "react"
import { Search, BookOpen, Heart, Sparkles, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock search results for testing
const mockSearchResults = [
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    relevanceScore: 0.95,
    context: "Paul writes about finding contentment in all circumstances and relying on God's strength.",
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    relevanceScore: 0.88,
    context: "God's promise to the exiles in Babylon about His good plans for their future.",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    relevanceScore: 0.82,
    context: "Paul explains how God works through all circumstances for the benefit of believers.",
  },
  {
    reference: "Isaiah 41:10",
    text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
    relevanceScore: 0.79,
    context: "God's reassurance to Israel about His presence and support during difficult times.",
  },
]

export default function TestSearchUI() {
  const [currentView, setCurrentView] = useState<
    "header" | "loading" | "results" | "no-results" | "error" | "limit-exceeded"
  >("header")
  const [query, setQuery] = useState("verses about strength and hope")

  const handleSaveVerse = (verse: any) => {
    alert(`Saved verse: ${verse.reference}`)
  }

  const renderHeader = () => (
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
  )

  const renderSearchForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
        <input
          type="text"
          placeholder="Ask anything... 'verses about overcoming fear' or 'what does the Bible say about forgiveness?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-200 dark:border-amber-800/50 shadow-sm"
        />
      </div>

      <button
        type="button"
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200"
      >
        <Search size={16} />
        Search Bible
      </button>
    </div>
  )

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg animate-pulse">
          <Search className="w-10 h-10 text-white animate-bounce" />
        </div>
        <p className="text-amber-800 dark:text-amber-300 font-medium">AI is analyzing your query...</p>
        <p className="text-sm text-amber-700/70 dark:text-amber-400/70">Finding the most relevant Bible verses</p>
      </div>
    </div>
  )

  const renderSearchResults = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <BookOpen className="text-amber-600" size={18} />
        Search Results ({mockSearchResults.length} verses found)
      </h3>

      {mockSearchResults.map((result, index) => (
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
  )

  const renderNoResults = () => (
    <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-amber-200 dark:border-amber-800/50">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-amber-500" />
      </div>
      <p className="text-amber-800 dark:text-amber-300 mb-2">No results found for "{query}"</p>
      <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
        Try rephrasing your question or using different keywords
      </p>
    </div>
  )

  const renderError = () => (
    <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={18} />
        <p className="font-medium text-lg">Search Error</p>
      </div>
      <p className="text-sm mb-3">Failed to connect to the AI service. Please try again.</p>
    </div>
  )

  const renderLimitExceeded = () => (
    <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={18} />
        <p className="font-medium text-lg">Search Error</p>
      </div>
      <p className="text-sm mb-3">Daily search limit exceeded</p>
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
    </div>
  )

  const renderExampleQueries = () => (
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
            className="text-left text-sm text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 p-3 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800/50 shadow-sm hover:shadow"
          >
            "{example}"
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen divine-light-bg">
      <div className="divine-light-overlay min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Test Controls */}
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-amber-200 dark:border-amber-800/50">
            <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Search UI Visual Test
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Test different states of the AI Bible Search interface to verify visual improvements.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "header", label: "Header Only" },
                { key: "loading", label: "Loading State" },
                { key: "results", label: "Search Results" },
                { key: "no-results", label: "No Results" },
                { key: "error", label: "Error State" },
                { key: "limit-exceeded", label: "Limit Exceeded" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === key
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Interface */}
          <div className="space-y-6">
            {/* Always show header */}
            {renderHeader()}

            {/* Always show search form */}
            {renderSearchForm()}

            {/* Show different states based on selection */}
            {currentView === "loading" && renderLoadingState()}
            {currentView === "results" && renderSearchResults()}
            {currentView === "no-results" && renderNoResults()}
            {currentView === "error" && renderError()}
            {currentView === "limit-exceeded" && renderLimitExceeded()}

            {/* Show example queries when not showing results */}
            {!["results", "loading"].includes(currentView) && renderExampleQueries()}
          </div>

          {/* Visual Improvements Summary */}
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800/50">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Visual Improvements Implemented
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Color & Contrast:</h4>
                <ul className="space-y-1 text-green-600 dark:text-green-400">
                  <li>• Enhanced text readability with better contrast</li>
                  <li>• Consistent amber/gold theme throughout</li>
                  <li>• Proper dark mode color adjustments</li>
                  <li>• Clear visual hierarchy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Layout & Design:</h4>
                <ul className="space-y-1 text-green-600 dark:text-green-400">
                  <li>• Left border accent on verse cards</li>
                  <li>• Improved spacing and padding</li>
                  <li>• Better shadow and hover effects</li>
                  <li>• Enhanced loading animations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
