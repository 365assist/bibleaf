"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Loader2, Heart } from "lucide-react"

interface LifeGuidanceProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onGuidanceComplete?: () => void
}

export default function LifeGuidance({ userId, onSaveVerse, onGuidanceComplete }: LifeGuidanceProps) {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bibleVerses, setBibleVerses] = useState<{ reference: string; text: string }[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    try {
      setIsLoading(true)
      setError("")
      setResponse("")
      setBibleVerses([])

      const response = await fetch("/api/ai/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          userId,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        throw new Error("Server returned non-JSON response. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        if (data.limitExceeded) {
          setError(data.message || "Daily guidance limit exceeded")
        } else {
          throw new Error(data.error || "Failed to get guidance")
        }
        return
      }

      setResponse(data.guidance || "")

      if (data.verses && Array.isArray(data.verses)) {
        setBibleVerses(data.verses)
      }

      // Notify parent component that guidance was completed successfully
      console.log("Guidance completed successfully, calling onGuidanceComplete")
      if (onGuidanceComplete) {
        onGuidanceComplete()
      }
    } catch (error) {
      console.error("Guidance error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to get guidance. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    if (onSaveVerse) {
      onSaveVerse(verse)
    }
  }

  const handleExampleQuestion = (question: string) => {
    setQuery(question)
    // Trigger search automatically with a slight delay to ensure state is updated
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSubmit(fakeEvent)
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Guidance Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <textarea
            placeholder="Ask for spiritual guidance... 'How can I find peace during difficult times?' or 'What does the Bible say about making important decisions?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 min-h-[100px] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              Getting Guidance...
            </>
          ) : (
            <>
              <MessageCircle size={16} />
              Get Biblical Guidance
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          <p className="font-medium">Guidance Error</p>
          <p className="text-sm mt-1">{error}</p>
          {error.includes("limit") && (
            <button
              onClick={() => (window.location.href = "/dashboard?activeTab=profile")}
              className="text-sm underline mt-2 hover:no-underline"
            >
              Upgrade your plan →
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
            <p className="text-muted-foreground">AI is analyzing your question...</p>
            <p className="text-sm text-muted-foreground">Finding biblical wisdom and guidance</p>
          </div>
        </div>
      )}

      {/* Guidance Response */}
      {!isLoading && response && (
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Biblical Guidance</h3>
            <div className="prose prose-sm max-w-none">
              {response.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Bible Verses */}
          {bibleVerses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Relevant Bible Verses</h3>
              {bibleVerses.map((verse, index) => (
                <div key={index} className="bg-muted/30 border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-primary">{verse.reference}</h4>
                    <button
                      onClick={() => handleSaveVerse(verse)}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                      title="Save verse"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                  <p className="mt-2 text-foreground">{verse.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Example Questions */}
      {!response && !isLoading && !error && (
        <div className="bg-muted/30 p-6 rounded-lg">
          <h4 className="font-medium mb-3">Try asking:</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              "How can I find peace during difficult times?",
              "What does the Bible say about making important decisions?",
              "How can I strengthen my faith when I have doubts?",
              "What guidance does the Bible offer for dealing with grief?",
              "How should I approach conflicts with others according to the Bible?",
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleExampleQuestion(example)}
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
