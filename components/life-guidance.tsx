"use client"

import type React from "react"

import { useState } from "react"
import { Compass, Loader2, Heart, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

interface GuidanceResult {
  guidance: string
  relevantVerses: Array<{
    reference: string
    text: string
    relevanceScore: number
    context?: string
  }>
  practicalSteps: string[]
  prayerSuggestion?: string
}

interface LifeGuidanceProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
}

export default function LifeGuidance({ userId, onSaveVerse }: LifeGuidanceProps) {
  const [situation, setSituation] = useState("")
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!situation.trim()) return

    try {
      setIsLoading(true)
      setError("")
      setGuidance(null)

      const response = await fetch("/api/ai/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation: situation.trim(),
          userId,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
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

      setGuidance(data.guidance)
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

  const handleSaveVerse = async (verse: { reference: string; text: string }) => {
    if (onSaveVerse) {
      onSaveVerse(verse)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Describe your situation or question:</label>
          <textarea
            placeholder="Share what you're going through... For example: 'I'm struggling with forgiving someone who hurt me deeply' or 'I'm facing a difficult decision about my career and need wisdom'"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full p-4 border border-border rounded-lg h-32 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !situation.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Getting guidance...
            </>
          ) : (
            <>
              <Compass size={16} />
              Get Spiritual Guidance
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

      {/* Guidance Results */}
      {guidance && (
        <div className="space-y-6">
          {/* Main Guidance */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Compass className="text-primary" size={20} />
              Spiritual Guidance
            </h3>
            <div className="prose prose-sm max-w-none">
              {guidance.guidance.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Relevant Verses */}
          {guidance.relevantVerses.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <BookOpen className="text-primary" size={20} />
                Relevant Bible Verses
              </h4>

              {guidance.relevantVerses.map((verse, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-primary">{verse.reference}</h5>
                    <button
                      onClick={() => handleSaveVerse(verse)}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                      title="Save verse"
                    >
                      <Heart size={16} className="text-muted-foreground hover:text-red-500" />
                    </button>
                  </div>

                  <p className="text-foreground leading-relaxed mb-3 text-base">{verse.text}</p>

                  {verse.context && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm text-muted-foreground italic">{verse.context}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <BookOpen size={14} className="text-muted-foreground" />
                    <Link
                      href={`/bible/${encodeURIComponent(verse.reference.split(" ")[0])}/${verse.reference.split(" ")[1]?.split(":")[0] || "1"}${verse.reference.includes(":") ? `?verse=${verse.reference.split(":")[1]}` : ""}`}
                      className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                    >
                      Read full chapter →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Practical Steps */}
          {guidance.practicalSteps.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Lightbulb className="text-primary" size={20} />
                Practical Steps
              </h4>
              <ol className="space-y-3">
                {guidance.practicalSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Prayer Suggestion */}
          {guidance.prayerSuggestion && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-3 text-primary">Suggested Prayer</h4>
              <p className="text-foreground italic leading-relaxed">{guidance.prayerSuggestion}</p>
            </div>
          )}
        </div>
      )}

      {/* Example Situations */}
      {!guidance && !isLoading && !error && (
        <div className="bg-muted/30 border border-border p-6 rounded-lg">
          <h4 className="font-medium mb-3 text-foreground">Example situations you can ask about:</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              "I'm struggling with anxiety about the future",
              "I need to forgive someone who hurt me",
              "I'm facing a difficult decision about my career",
              "I'm dealing with loneliness and isolation",
              "I'm having trouble trusting God during hard times",
              "I need wisdom for a relationship conflict",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setSituation(example)}
                className="text-left text-sm text-muted-foreground hover:text-foreground p-3 rounded hover:bg-background transition-colors border border-transparent hover:border-border"
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
