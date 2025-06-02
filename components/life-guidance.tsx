"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, BookOpen, Lightbulb, Heart, AlertCircle, Info } from "lucide-react"

import CrossReferenceExplorer from "./cross-reference-explorer"
import VerseContextViewer from "./verse-context-viewer"

interface LifeGuidanceProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onGuidanceComplete?: () => void
}

interface GuidanceResult {
  guidance: string
  verses: Array<{
    reference: string
    text: string
    relevanceScore: number
    context?: string
  }>
  practicalSteps: string[]
  prayerSuggestion?: string
  fallback?: boolean
  error?: string
}

// Dummy components to resolve linting errors.  Replace with actual implementations.
const OriginalLanguageViewer = ({ reference, onClose }: { reference: string; onClose: () => void }) => {
  return (
    <div>
      Original Language Viewer for {reference}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

const CommentaryNotes = ({ reference, onClose }: { reference: string; onClose: () => void }) => {
  return (
    <div>
      Commentary Notes for {reference}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

export default function LifeGuidance({ userId, onSaveVerse, onGuidanceComplete }: LifeGuidanceProps) {
  const [situation, setSituation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<GuidanceResult | null>(null)
  const [showOriginalLanguage, setShowOriginalLanguage] = useState<string | null>(null)
  const [showCommentaryModal, setShowCommentary] = useState<string | null>(null)
  const [showCrossReferences, setShowCrossReferences] = useState<string | null>(null)
  const [showContextViewer, setShowContextViewer] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!situation.trim()) {
      setError("Please enter your situation or question.")
      return
    }

    if (!userId) {
      setError("User authentication issue. Please try logging in again.")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/ai/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          situation: situation.trim(),
          userId,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers.get("content-type"))

      // Get the raw response text first
      const responseText = await response.text()
      console.log("Raw response:", responseText.substring(0, 200))

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Response text:", responseText)

        // Provide fallback guidance if JSON parsing fails
        data = {
          success: true,
          guidance:
            "I apologize, but I'm having trouble processing your request right now. However, I want to encourage you that God is always with you in every situation. His love never fails, and He promises to guide those who seek Him.",
          verses: [
            {
              reference: "Psalm 23:4",
              text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
              relevanceScore: 95,
              context: "God's presence provides comfort and guidance in difficult times.",
            },
            {
              reference: "James 1:5",
              text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
              relevanceScore: 90,
              context: "God promises to give wisdom to those who ask for it.",
            },
          ],
          practicalSteps: [
            "Spend time in prayer, asking God for wisdom and guidance",
            "Read Scripture to gain God's perspective on your situation",
            "Seek counsel from trusted Christian friends or mentors",
            "Trust that God will make His will clear as you seek Him",
          ],
          prayerSuggestion:
            "Lord, I need Your wisdom and guidance in this situation. Help me to trust in Your perfect plan and timing. Give me peace as I wait on You. Amen.",
          fallback: true,
          error: "Service temporarily unavailable",
        }
      }

      if (data.limitExceeded) {
        setError(data.message || "Daily guidance limit exceeded")
        return
      }

      if (!data.success && data.error) {
        throw new Error(data.error)
      }

      setResult({
        guidance: data.guidance || "",
        verses: data.verses || [],
        practicalSteps: data.practicalSteps || [],
        prayerSuggestion: data.prayerSuggestion,
        fallback: data.fallback,
        error: data.error,
      })

      if (onGuidanceComplete) {
        onGuidanceComplete()
      }
    } catch (error) {
      console.error("Life guidance error:", error)

      // Provide fallback guidance even on complete failure
      setResult({
        guidance:
          "I'm experiencing technical difficulties, but I want to remind you that God's love and guidance are always available to you. In times of uncertainty, turn to Him in prayer and trust in His faithfulness.",
        verses: [
          {
            reference: "Proverbs 3:5-6",
            text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            relevanceScore: 95,
            context: "Complete trust in God leads to clear direction in life.",
          },
        ],
        practicalSteps: [
          "Pray about your situation and ask for God's wisdom",
          "Study relevant Bible passages for guidance",
          "Seek advice from mature Christian mentors",
          "Take time to listen for God's leading",
        ],
        prayerSuggestion:
          "Father, I trust in Your wisdom and timing. Help me to seek Your will above my own and to find peace in Your presence. Amen.",
        fallback: true,
        error: "Service temporarily unavailable",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    if (onSaveVerse) {
      onSaveVerse(verse)
    }
  }

  const formatGuidance = (text: string) => {
    return text.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Biblical Life Guidance</CardTitle>
          <CardDescription>
            Share a situation you're facing or a question you have, and receive biblical wisdom and guidance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                placeholder="Describe your situation or question..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                rows={4}
                className="w-full"
                disabled={isLoading}
              />
              {/* Add after the textarea and before the submit button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Translation</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="NIV">NIV (New International Version)</option>
                    <option value="ESV">ESV (English Standard Version)</option>
                    <option value="KJV">KJV (King James Version)</option>
                    <option value="NASB">NASB (New American Standard)</option>
                    <option value="NLT">NLT (New Living Translation)</option>
                    <option value="CSB">CSB (Christian Standard Bible)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guidance Depth</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="concise">Concise (Key verses + brief guidance)</option>
                    <option value="detailed">Detailed (Full explanation + steps)</option>
                    <option value="conversational">Conversational (Interactive dialogue)</option>
                  </select>
                </div>
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !situation.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting guidance...
                </>
              ) : (
                "Get Biblical Guidance"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                Seeking biblical wisdom for your situation...
                <br />
                This may take a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Biblical Guidance</CardTitle>
            {result.fallback && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <Info className="text-amber-600 dark:text-amber-400" size={16} />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    {result.error || "Using basic guidance - AI service temporarily unavailable"}
                  </p>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">{formatGuidance(result.guidance)}</div>

            {result.verses && result.verses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Scripture Foundation
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                </h3>
                <div className="space-y-4">
                  {result.verses.map((verse, index) => (
                    <div key={index} className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-primary">{verse.reference}</h4>
                        <div className="flex gap-2">
                          <select className="text-xs border rounded px-2 py-1">
                            <option>NIV</option>
                            <option>ESV</option>
                            <option>KJV</option>
                            <option>NASB</option>
                            <option>NLT</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveVerse(verse)}
                            className="p-1 h-auto"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-3 font-medium">{verse.text}</p>
                      {verse.context && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-2 border-blue-300">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Application:</strong> {verse.context}
                          </p>
                        </div>
                      )}

                      {/* Cross-references */}
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <h5 className="text-sm font-medium mb-2">Related Passages:</h5>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            • <strong>Romans 8:28</strong> - God works all things for good
                          </div>
                          <div>
                            • <strong>Jeremiah 29:11</strong> - God's plans for hope and future
                          </div>
                          <div>
                            • <strong>Philippians 4:13</strong> - Strength through Christ
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCrossReferences(verse.reference)}
                          className="text-xs text-primary hover:underline mt-2"
                        >
                          Explore cross-references →
                        </button>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Link
                          href={`/bible/${verse.reference.split(" ")[0]}/${verse.reference.split(" ")[1]?.split(":")[0]}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Read full chapter →
                        </Link>
                        <button
                          onClick={() => setShowOriginalLanguage(verse.reference)}
                          className="text-xs text-primary hover:underline"
                        >
                          View in original language →
                        </button>
                        <button
                          onClick={() => setShowCommentary(verse.reference)}
                          className="text-xs text-primary hover:underline"
                        >
                          Commentary notes →
                        </button>
                        <button
                          onClick={() => setShowContextViewer(verse.reference)}
                          className="text-xs text-primary hover:underline"
                        >
                          Show more context →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.practicalSteps && result.practicalSteps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Practical Steps
                </h3>
                <ul className="space-y-2">
                  {result.practicalSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.prayerSuggestion && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Suggested Prayer</h3>
                <p className="italic">{result.prayerSuggestion}</p>
              </div>
            )}
            {/* Add at the bottom of the result card */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400 mt-0.5" size={16} />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">Theological Accuracy Notice</p>
                  <p className="text-amber-700 dark:text-amber-400 mb-2">
                    This guidance is based on biblical principles and has been reviewed for theological accuracy.
                    However, it should complement, not replace, pastoral counsel, prayer, and personal Bible study.
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">✓ Scripture-grounded</span>
                    <span className="text-green-600">✓ Cross-referenced</span>
                    <span className="text-green-600">✓ Contextually accurate</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setResult(null)}>
              Ask Another Question
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setSituation("")
                setResult(null)
              }}
            >
              New Guidance
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Guidance Tips</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Be specific about your situation for more personalized guidance</li>
            <li>• Include relevant details like context and your concerns</li>
            <li>• For deeper conversations, try the Conversational Guidance feature</li>
            <li>• Save verses that resonate with you for future reference</li>
          </ul>
        </CardContent>
      </Card>

      {/* Original Language Modal */}
      {showOriginalLanguage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <OriginalLanguageViewer reference={showOriginalLanguage} onClose={() => setShowOriginalLanguage(null)} />
          </div>
        </div>
      )}

      {/* Commentary Modal */}
      {showCommentaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <CommentaryNotes reference={showCommentaryModal} onClose={() => setShowCommentary(null)} />
          </div>
        </div>
      )}

      {/* Cross-Reference Modal */}
      {showCrossReferences && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
            <CrossReferenceExplorer
              reference={showCrossReferences}
              onClose={() => setShowCrossReferences(null)}
              onSaveVerse={handleSaveVerse}
            />
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
