"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Play, Pause, RotateCcw } from "lucide-react"

interface DemoStep {
  id: string
  type: "search" | "guidance"
  query: string
  response: {
    verse?: {
      reference: string
      text: string
    }
    insight: string
    relevance?: number
  }
  delay: number
}

const demoSteps: DemoStep[] = [
  {
    id: "search-1",
    type: "search",
    query: "How can I find peace in difficult times?",
    response: {
      verse: {
        reference: "Philippians 4:6-7",
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      },
      insight:
        "This passage teaches us that peace comes through prayer and surrendering our worries to God. The 'peace that transcends understanding' is a supernatural calm that God provides when we trust Him with our concerns.",
      relevance: 95,
    },
    delay: 2000,
  },
  {
    id: "guidance-1",
    type: "guidance",
    query: "I'm struggling with forgiveness",
    response: {
      verse: {
        reference: "Matthew 6:14-15",
        text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
      },
      insight:
        "Forgiveness is both a command and a gift. Jesus teaches that our forgiveness of others is connected to God's forgiveness of us. This doesn't mean we excuse harmful behavior, but we release the burden of resentment for our own spiritual health.",
      relevance: 92,
    },
    delay: 2500,
  },
  {
    id: "search-2",
    type: "search",
    query: "What does the Bible say about God's love?",
    response: {
      verse: {
        reference: "1 John 4:8",
        text: "Whoever does not love does not know God, because God is love.",
      },
      insight:
        "This verse reveals that love isn't just something God does - it's who God is. His very nature is love, which means every action He takes toward us flows from perfect, unconditional love.",
      relevance: 98,
    },
    delay: 1800,
  },
]

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayedQuery, setDisplayedQuery] = useState("")
  const [showResponse, setShowResponse] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

  const currentDemo = demoSteps[currentStep]

  // Auto-advance demo
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
        setShowResponse(false)
        setDisplayedQuery("")
        setTypingComplete(false)
      } else {
        setIsPlaying(false)
      }
    }, currentDemo.delay + 3000)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, currentDemo.delay])

  // Typing effect
  useEffect(() => {
    if (!isPlaying) return

    setDisplayedQuery("")
    setShowResponse(false)
    setTypingComplete(false)

    let index = 0
    const typeTimer = setInterval(() => {
      if (index < currentDemo.query.length) {
        setDisplayedQuery(currentDemo.query.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeTimer)
        setTypingComplete(true)
        setTimeout(() => setShowResponse(true), 500)
      }
    }, 50)

    return () => clearInterval(typeTimer)
  }, [currentStep, isPlaying, currentDemo.query])

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
  }

  const pauseDemo = () => {
    setIsPlaying(false)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setDisplayedQuery("")
    setShowResponse(false)
    setTypingComplete(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">See BibleAF in Action</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Watch how our AI-powered search and guidance features work
        </p>
        <div className="flex justify-center gap-2">
          <Button
            onClick={startDemo}
            disabled={isPlaying}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Play size={16} className="mr-2" />
            Start Demo
          </Button>
          <Button onClick={pauseDemo} disabled={!isPlaying} variant="outline" className="border-amber-300">
            <Pause size={16} className="mr-2" />
            Pause
          </Button>
          <Button onClick={resetDemo} variant="outline" className="border-amber-300">
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-xl">
        <CardContent className="p-6">
          {/* Demo Interface */}
          <div className="space-y-4">
            {/* Search/Guidance Type Indicator */}
            <div className="flex items-center gap-2 mb-4">
              {currentDemo.type === "search" ? (
                <>
                  <Search className="text-amber-600" size={20} />
                  <span className="font-semibold text-amber-600">AI Bible Search</span>
                </>
              ) : (
                <>
                  <MessageCircle className="text-green-600" size={20} />
                  <span className="font-semibold text-green-600">Life Guidance</span>
                </>
              )}
            </div>

            {/* Input Field */}
            <div className="relative">
              <Input
                value={displayedQuery}
                readOnly
                placeholder={isPlaying ? "Typing..." : "Click 'Start Demo' to see AI in action"}
                className="pr-12 text-lg py-3 border-amber-200 dark:border-amber-800 focus:border-amber-500"
              />
              {typingComplete && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Response */}
            {showResponse && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                {/* Verse Card */}
                {currentDemo.response.verse && (
                  <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                          {currentDemo.response.verse.reference}
                        </h4>
                        {currentDemo.response.relevance && (
                          <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                            {currentDemo.response.relevance}% relevant
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{currentDemo.response.verse.text}"
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* AI Insight */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <MessageCircle size={16} />
                      AI Insight
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentDemo.response.insight}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Demo Progress */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? "bg-amber-500" : index < currentStep ? "bg-amber-300" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 text-center">
            <Search className="text-amber-600 mx-auto mb-2" size={24} />
            <h4 className="font-semibold mb-1">Smart Search</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find verses by meaning, not just keywords</p>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 text-center">
            <MessageCircle className="text-green-600 mx-auto mb-2" size={24} />
            <h4 className="font-semibold mb-1">AI Insights</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get contextual explanations and applications</p>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 text-center">
            <div className="text-purple-600 mx-auto mb-2 font-bold text-lg">95%</div>
            <h4 className="font-semibold mb-1">Accuracy</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Highly relevant biblical responses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
