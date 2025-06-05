"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Heart, Book } from "lucide-react"
import { AIDisclaimer } from "@/components/ai-disclaimer"
import { useToast } from "@/hooks/use-toast"

export default function InteractiveDemo() {
  const [searchQuery, setSearchQuery] = useState("")
  const [guidanceQuery, setGuidanceQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [guidanceResult, setGuidanceResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingGuidance, setIsGettingGuidance] = useState(false)
  const [activeTab, setActiveTab] = useState<"search" | "guidance">("search")
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          userId: "demo-user", // Add a demo userId for the interactive demo
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        throw new Error("Search failed")
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to search at the moment. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleGuidance = async () => {
    if (!guidanceQuery.trim()) return

    setIsGettingGuidance(true)
    try {
      const response = await fetch("/api/ai/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: guidanceQuery,
          userId: "demo-user", // Add a demo userId for the interactive demo
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGuidanceResult(data)
      } else {
        throw new Error("Guidance request failed")
      }
    } catch (error) {
      toast({
        title: "Guidance Error",
        description: "Unable to provide guidance at the moment. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGettingGuidance(false)
    }
  }

  const handleFeedback = () => {
    toast({
      title: "Feedback Noted",
      description: "Thank you for your feedback! This helps us improve our AI responses.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-white">Experience AI-Powered Bible Study</h2>
        <p className="text-xl text-amber-100 mb-8">Try our intelligent search and guidance features right now</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            onClick={() => setActiveTab("search")}
            className={`mr-2 ${activeTab === "search" ? "bg-white text-amber-600" : "text-white hover:bg-white/20"}`}
          >
            <Search className="h-4 w-4 mr-2" />
            Bible Search
          </Button>
          <Button
            variant={activeTab === "guidance" ? "default" : "ghost"}
            onClick={() => setActiveTab("guidance")}
            className={activeTab === "guidance" ? "bg-white text-amber-600" : "text-white hover:bg-white/20"}
          >
            <Heart className="h-4 w-4 mr-2" />
            Life Guidance
          </Button>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="mb-6">
        <AIDisclaimer onFeedback={handleFeedback} />
      </div>

      {activeTab === "search" && (
        <Card className="divine-light-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-amber-600" />
              AI Bible Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search for verses about love, hope, strength..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="divine-button">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>

            {/* Search Results */}
            <div className="space-y-4" aria-live="polite">
              {searchResults.map((result, index) => (
                <Card key={index} className="border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {result.reference}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((result.relevanceScore || 0.9) * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 italic">"{result.text}"</p>
                    {result.context && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Context:</strong> {result.context}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "guidance" && (
        <Card className="divine-light-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-amber-600" />
              AI Life Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Textarea
                placeholder="Describe your situation or question... (e.g., 'I'm struggling with anxiety about my future')"
                value={guidanceQuery}
                onChange={(e) => setGuidanceQuery(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleGuidance} disabled={isGettingGuidance} className="divine-button">
                {isGettingGuidance ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Get Biblical Guidance
              </Button>
            </div>

            {/* Guidance Results */}
            {guidanceResult && (
              <div className="space-y-6" aria-live="polite">
                <Card className="border-amber-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Book className="h-5 w-5 mr-2 text-amber-600" />
                      Biblical Guidance
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{guidanceResult.guidance}</p>

                    {guidanceResult.relevantVerses && guidanceResult.relevantVerses.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Relevant Verses:</h4>
                        <div className="space-y-2">
                          {guidanceResult.relevantVerses.map((verse: any, index: number) => (
                            <div key={index} className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded">
                              <Badge variant="secondary" className="mb-2">
                                {verse.reference}
                              </Badge>
                              <p className="text-sm italic mb-1">"{verse.text}"</p>
                              {verse.context && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">{verse.context}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {guidanceResult.practicalSteps && guidanceResult.practicalSteps.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Practical Steps:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {guidanceResult.practicalSteps.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {guidanceResult.prayerSuggestion && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded">
                        <h4 className="font-medium mb-2">Suggested Prayer:</h4>
                        <p className="text-sm italic text-blue-800 dark:text-blue-200">
                          {guidanceResult.prayerSuggestion}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <p className="text-amber-100 mb-4">Ready to dive deeper into Scripture with AI assistance?</p>
        <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
          <a href="/auth/signup">Start Your Free Account</a>
        </Button>
      </div>
    </div>
  )
}
