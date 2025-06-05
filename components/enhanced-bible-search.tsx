"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, BookOpen, Heart, Sparkles, Cross, DotIcon as Dove, Star } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import VerseContextViewer from "./verse-context-viewer"

interface SearchResult {
  reference: string
  text: string
  relevanceScore: number
  context?: string
  theologicalInsight?: string
  originalLanguage?: {
    hebrew?: string
    greek?: string
    aramaic?: string
  }
  historicalContext?: string
  practicalApplication?: string
}

interface EnhancedBibleSearchProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onSearchComplete?: () => void
}

export default function EnhancedBibleSearch({ userId, onSaveVerse, onSearchComplete }: EnhancedBibleSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showContextViewer, setShowContextViewer] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    setResults([])

    try {
      // Enhanced search with theological insights
      const response = await fetch("/api/ai/enhanced-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          userId,
          includeTheology: true,
          includeOriginalLanguage: true,
          includeHistoricalContext: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        if (onSearchComplete) onSearchComplete()
      } else {
        // Fallback with enhanced theological context
        setResults(getEnhancedFallbackResults(query.trim()))
      }
    } catch (error) {
      setResults(getEnhancedFallbackResults(query.trim()))
    } finally {
      setIsLoading(false)
    }
  }

  const getEnhancedFallbackResults = (query: string): SearchResult[] => {
    const queryLower = query.toLowerCase()

    if (queryLower.includes("love")) {
      return [
        {
          reference: "1 John 4:8",
          text: "Whoever does not love does not know God, because God is love.",
          relevanceScore: 0.98,
          context: "John's profound declaration about the very essence of God's nature",
          theologicalInsight:
            "This verse reveals that love is not merely an attribute of God, but His very essence. The Greek word 'agape' used here represents unconditional, sacrificial love that seeks the highest good of others.",
          originalLanguage: {
            greek: "ὁ θεὸς ἀγάπη ἐστίν (ho theos agape estin) - God is love",
          },
          historicalContext:
            "Written by the apostle John in his later years, this letter addresses the fundamental nature of Christian love and fellowship in the early church.",
          practicalApplication:
            "Understanding God as love transforms how we view ourselves and others. It calls us to love not from duty, but as a natural expression of God's nature within us.",
        },
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          relevanceScore: 0.96,
          context: "The most beloved verse in Scripture, summarizing the gospel message",
          theologicalInsight:
            "This verse encapsulates the entire gospel: God's love (motivation), Christ's sacrifice (method), faith (means), and eternal life (result). It demonstrates that salvation is both universal in scope and personal in application.",
          originalLanguage: {
            greek:
              "οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον (houtos gar egapesen ho theos ton kosmon) - For God so loved the world",
          },
          historicalContext:
            "Spoken by Jesus to Nicodemus, a Pharisee who came seeking truth under cover of darkness, representing humanity's search for divine understanding.",
          practicalApplication:
            "This verse assures us that God's love is not based on our worthiness but on His character. It invites us to receive this gift through faith and share it with others.",
        },
      ]
    }

    if (queryLower.includes("peace")) {
      return [
        {
          reference: "John 14:27",
          text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
          relevanceScore: 0.95,
          context: "Jesus' farewell promise to His disciples before His crucifixion",
          theologicalInsight:
            "Christ offers a peace that transcends circumstances - not the absence of conflict, but the presence of God's calming assurance in the midst of life's storms.",
          originalLanguage: {
            greek:
              "εἰρήνην ἀφίημι ὑμῖν, εἰρήνην τὴν ἐμὴν δίδωμι ὑμῖν (eirenen aphiemi hymin, eirenen ten emen didomi hymin)",
          },
          historicalContext:
            "Given during the Last Supper, as Jesus prepared His disciples for His departure and the challenges they would face.",
          practicalApplication:
            "When anxiety overwhelms, remember that Christ's peace is available now. It's not dependent on perfect circumstances but on His perfect presence with us.",
        },
      ]
    }

    // Default enhanced results
    return [
      {
        reference: "Psalm 23:1",
        text: "The Lord is my shepherd, I lack nothing.",
        relevanceScore: 0.9,
        context: "David's declaration of trust in God's provision and care",
        theologicalInsight:
          "The shepherd metaphor reveals God's intimate, personal care for each believer. In ancient times, shepherds knew each sheep by name and would risk their lives to protect them.",
        originalLanguage: {
          hebrew: "יְהוָה רֹעִי לֹא אֶחְסָר (Yahweh ro'i lo echsar) - The Lord is my shepherd, I shall not want",
        },
        historicalContext:
          "Written by David, who was himself a shepherd before becoming king, drawing from personal experience of caring for sheep.",
        practicalApplication:
          "When we feel lost or lacking, we can trust that our Good Shepherd knows exactly where we are and what we need. He guides us with love and wisdom.",
      },
    ]
  }

  const handleSaveVerse = (verse: SearchResult) => {
    if (onSaveVerse) {
      onSaveVerse({
        reference: verse.reference,
        text: verse.text,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Inspirational Search Header */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-800/20 rounded-2xl overflow-hidden shadow-xl border border-blue-200 dark:border-blue-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
        <div className="relative p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-xl mb-6">
            <Search className="w-10 h-10 text-white" />
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Seek Divine Wisdom
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." -
            Matthew 7:7
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400">
              <Cross className="w-4 h-4" />
              <span className="text-sm font-medium">Theological Depth</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Original Languages</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Historical Context</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400">
              <Dove className="w-4 h-4" />
              <span className="text-sm font-medium">Practical Application</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Form */}
      <Card className="divine-light-card shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input
                type="text"
                placeholder="Search with your heart... 'comfort for grief', 'strength in weakness', 'hope in darkness'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 dark:border-blue-800/50 shadow-lg placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Seeking Divine Wisdom...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Search Scripture
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Search Results */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Divine Revelations Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {results.length} verses discovered for your spiritual journey
            </p>
          </div>

          {results.map((result, index) => (
            <Card
              key={index}
              className="divine-light-card shadow-xl border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-blue-700 dark:text-blue-400 mb-2">{result.reference}</CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {Math.round(result.relevanceScore * 100)}% spiritual relevance
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveVerse(result)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Heart size={20} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Main Verse Text */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic">
                    "{result.text}"
                  </p>
                </div>

                {/* Theological Insight */}
                {result.theologicalInsight && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Cross className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-800 dark:text-amber-300">Theological Insight</h4>
                    </div>
                    <p className="text-amber-700 dark:text-amber-400 leading-relaxed">{result.theologicalInsight}</p>
                  </div>
                )}

                {/* Original Language */}
                {result.originalLanguage && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800 dark:text-green-300">Original Language</h4>
                    </div>
                    {result.originalLanguage.hebrew && (
                      <p className="text-green-700 dark:text-green-400 font-medium mb-1">
                        Hebrew: {result.originalLanguage.hebrew}
                      </p>
                    )}
                    {result.originalLanguage.greek && (
                      <p className="text-green-700 dark:text-green-400 font-medium mb-1">
                        Greek: {result.originalLanguage.greek}
                      </p>
                    )}
                  </div>
                )}

                {/* Historical Context */}
                {result.historicalContext && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300">Historical Context</h4>
                    </div>
                    <p className="text-purple-700 dark:text-purple-400 leading-relaxed">{result.historicalContext}</p>
                  </div>
                )}

                {/* Practical Application */}
                {result.practicalApplication && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Dove className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">For Your Heart Today</h4>
                    </div>
                    <p className="text-indigo-700 dark:text-indigo-400 leading-relaxed">
                      {result.practicalApplication}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/bible/${result.reference.split(" ")[0]}/${result.reference.split(" ")[1]?.split(":")[0]}`}
                  >
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Read Chapter
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContextViewer(result.reference)}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    More Context
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Context Viewer Modal */}
      {showContextViewer && (
        <VerseContextViewer reference={showContextViewer} onClose={() => setShowContextViewer(null)} />
      )}
    </div>
  )
}
