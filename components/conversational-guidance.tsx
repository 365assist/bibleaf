"use client"
import { useState, useEffect, useRef } from "react"
import {
  MessageCircle,
  Loader2,
  Heart,
  Send,
  User,
  Bot,
  BookOpen,
  Lightbulb,
  Users,
  AlertCircle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Star,
  Crown,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  verses?: { reference: string; text: string; context?: string }[]
  practicalSteps?: string[]
  prayerSuggestion?: string
  followUpQuestions?: string[]
}

interface ConversationalGuidanceProps {
  userId: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onGuidanceComplete?: () => void
}

export default function ConversationalGuidance({
  userId,
  onSaveVerse,
  onGuidanceComplete,
}: ConversationalGuidanceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [showStarterQuestions, setShowStarterQuestions] = useState(true)
  const [limitExceeded, setLimitExceeded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Starter conversation topics
  const starterTopics = [
    {
      icon: "😰",
      title: "Anxiety & Worry",
      question: "I've been feeling anxious lately and need biblical guidance on finding peace",
      description: "Find peace through God's promises",
    },
    {
      icon: "💔",
      title: "Forgiveness",
      question: "I'm struggling to forgive someone who hurt me deeply",
      description: "Learn about God's heart for forgiveness",
    },
    {
      icon: "🤔",
      title: "Life Direction",
      question: "I'm unsure about God's will for my life and need guidance on making decisions",
      description: "Discover God's plan for your future",
    },
    {
      icon: "💑",
      title: "Relationships",
      question: "I'm having difficulties in my relationships and need biblical wisdom",
      description: "Build healthy, God-honoring relationships",
    },
    {
      icon: "🙏",
      title: "Growing in Faith",
      question: "How can I grow closer to God and strengthen my relationship with Him?",
      description: "Deepen your spiritual journey",
    },
    {
      icon: "😢",
      title: "Grief & Loss",
      question: "I'm dealing with loss and need comfort from God's Word",
      description: "Find hope in times of sorrow",
    },
  ]

  useEffect(() => {
    // More robust user ID validation
    const isValidUserId = userId && userId.trim() !== "" && userId !== "undefined" && userId !== "null"

    if (!isValidUserId) {
      console.log("Invalid userId:", userId)
      setError("Please ensure you're logged in to use Heart to Heart conversations.")
      setMessages([]) // Clear messages if invalid user
    } else {
      console.log("Valid userId:", userId)
      setError("")

      // Add welcome message - make sure it's always added
      const welcomeMessage: ConversationMessage = {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content:
          "Welcome to Heart to Heart! 🕊️\n\nI'm your Divine Counselor, here to provide biblical guidance and spiritual support. This is a safe space where you can share what's on your heart.\n\n✨ **How this works:**\n• Share your thoughts, struggles, or questions\n• I'll provide scripture-based guidance\n• We can have a meaningful conversation about your situation\n• Everything is confidential and judgment-free\n\nChoose a topic below to get started, or simply type what's on your heart. Remember, you are deeply loved by God! 💝",
        timestamp: new Date(),
      }

      // Force set the welcome message
      setMessages([welcomeMessage])
      console.log("Welcome message set:", welcomeMessage)
    }
  }, [userId])

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return

    // Hide starter questions once conversation begins
    setShowStarterQuestions(false)

    // Check userId again before submitting
    const isValidUserId = userId && userId.trim() !== "" && userId !== "undefined" && userId !== "null"
    if (!isValidUserId) {
      setError("Please log in again to continue your conversation.")
      return
    }

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")
    setIsLoading(true)
    setError("")

    // Add to conversation context
    const newContext = [...conversationContext, message.trim()]
    setConversationContext(newContext)

    try {
      const response = await fetch("/api/ai/conversational-guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          userId: userId,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
          context: newContext.slice(-3), // Last 3 user inputs for context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.limitExceeded) {
          setLimitExceeded(true)
          setError(errorData.message || "You've reached your daily limit of 5 guidance requests.")
        } else {
          throw new Error(errorData.error || "Failed to get guidance")
        }
        return
      }

      const data = await response.json()

      if (data.limitExceeded) {
        setLimitExceeded(true)
        setError(data.message || "You've reached your daily limit of 5 guidance requests.")
        return
      }

      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.guidance || "",
        timestamp: new Date(),
        verses: data.verses || [],
        practicalSteps: data.practicalSteps || [],
        prayerSuggestion: data.prayerSuggestion,
        followUpQuestions: data.followUpQuestions || [],
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (onGuidanceComplete) {
        onGuidanceComplete()
      }
    } catch (error) {
      console.error("Conversational guidance error:", error)

      // Provide a compassionate fallback response
      const fallbackMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm experiencing some technical difficulties right now, but I want you to know that God sees your heart and cares deeply about what you're going through. His love for you never fails, and He promises to be with you in every situation.\n\nIn the meantime, here's a verse for your heart: 'Cast all your anxiety on him because he cares for you.' - 1 Peter 5:7\n\nPlease try again in a moment, and know that you're in my prayers. 🙏",
        timestamp: new Date(),
        verses: [
          {
            reference: "1 Peter 5:7",
            text: "Cast all your anxiety on him because he cares for you.",
            context:
              "God invites us to bring all our worries to Him because He genuinely cares about every detail of our lives.",
          },
          {
            reference: "Psalm 46:1",
            text: "God is our refuge and strength, an ever-present help in trouble.",
            context: "God is always available to help us in times of need, even when technology fails us.",
          },
        ],
        prayerSuggestion:
          "Lord, even when things don't work as expected, I trust that You are working in my life. Help me to find peace in Your presence and strength in Your promises. Thank You for Your constant love and care. Amen.",
      }

      setMessages((prev) => [...prev, fallbackMessage])
      setError(
        "I'm having trouble connecting right now, but God's love for you remains constant. Please try again in a moment.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSubmit(question)
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    if (onSaveVerse) {
      onSaveVerse(verse)
    }
  }

  const formatMessage = (content: string) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-3 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  // Show authentication error if userId is invalid
  if (!userId || userId.trim() === "" || userId === "undefined" || userId === "null") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">Authentication Required</h3>
            <p className="text-amber-600 dark:text-amber-400 mb-4">
              Please log in to access Heart to Heart conversations. Your spiritual journey is important to us, and we
              want to provide you with personalized guidance.
            </p>
            <Button
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show limit exceeded screen
  if (limitExceeded) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>

            <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-3">
              Daily Conversation Limit Reached
            </h2>
            <p className="text-lg text-amber-600 dark:text-amber-500 mb-6">
              You've used all 5 of your free Heart to Heart conversations today
            </p>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-amber-200 dark:border-amber-700/50 mb-6">
              <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-4">
                Continue Your Spiritual Journey
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Unlimited Conversations</h4>
                  <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                    Have as many Heart to Heart conversations as you need
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Deeper Insights</h4>
                  <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                    Access advanced biblical commentary and cross-references
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Personalized Experience</h4>
                  <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                    Tailored guidance based on your spiritual journey
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/pricing")}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLimitExceeded(false)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30 px-8 py-3"
                >
                  Continue Tomorrow
                </Button>
              </div>
            </div>

            <div className="text-sm text-amber-600/70 dark:text-amber-500/70 space-y-1">
              <p>Your daily conversation limit resets at midnight UTC.</p>
              <p>You can still read the Bible and explore verses without limits!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <MessageCircle className="text-amber-600" />
          Heart to Heart Conversations
        </h2>
        <p className="text-muted-foreground">Your safe space for biblical guidance and spiritual support</p>
      </div>

      {/* Starter Topics - Only show when conversation hasn't started */}
      {showStarterQuestions && messages.length <= 1 && (
        <Card className="divine-light-card">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                What's on your heart today?
              </h3>
              <p className="text-amber-600/80 dark:text-amber-500/80 text-sm">
                Choose a topic below or share whatever you'd like to discuss
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {starterTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickQuestion(topic.question)}
                  className="h-auto p-4 text-left border-amber-200 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 group"
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{topic.icon}</span>
                      <span className="font-medium text-amber-700 dark:text-amber-400">{topic.title}</span>
                    </div>
                    <p className="text-xs text-amber-600/70 dark:text-amber-500/70 text-left">{topic.description}</p>
                    <ArrowRight className="w-4 h-4 text-amber-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-amber-600/70 dark:text-amber-500/70 mb-2">Or type your own question below ↓</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="divine-light-card shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-amber-50/50 dark:bg-amber-950/20">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4 shadow-sm",
                    message.role === "user"
                      ? "bg-amber-600 text-white ml-4"
                      : "bg-white dark:bg-gray-800/90 border-2 border-amber-300 dark:border-amber-500/50 mr-4 shadow-md",
                  )}
                >
                  {/* Message Header */}
                  <div className="flex items-center gap-2 mb-3">
                    {message.role === "user" ? (
                      <User size={16} className="text-amber-100" />
                    ) : (
                      <Bot size={18} className="text-amber-600 dark:text-amber-400" />
                    )}
                    <span
                      className={`font-medium ${message.role === "user" ? "text-sm" : "text-base text-amber-700 dark:text-amber-300"}`}
                    >
                      {message.role === "user" ? "You" : "Divine Counselor"}
                    </span>
                    <span
                      className={`text-xs ${
                        message.role === "user" ? "text-amber-200" : "text-amber-700/70 dark:text-amber-400/70"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div
                    className={`prose max-w-none ${
                      message.role === "user"
                        ? "prose-invert text-sm"
                        : "prose-amber text-base text-gray-800 dark:text-gray-100 font-medium"
                    }`}
                  >
                    {formatMessage(message.content)}
                  </div>

                  {/* Enhanced Bible Verses */}
                  {message.verses && message.verses.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                        <BookOpen size={16} />
                        Scripture Foundation
                      </div>
                      {message.verses.map((verse, index) => (
                        <div
                          key={index}
                          className="bg-amber-50/80 dark:bg-amber-900/30 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-amber-700 dark:text-amber-400">{verse.reference}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveVerse(verse)}
                              className="p-1 h-auto text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                              title="Save this verse"
                            >
                              <Heart size={14} />
                            </Button>
                          </div>
                          <p className="text-sm mb-2 italic">&ldquo;{verse.text}&rdquo;</p>
                          {verse.context && (
                            <div className="text-xs text-amber-700 dark:text-amber-400">
                              <strong>💡 Application:</strong> {verse.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Practical Steps */}
                  {message.practicalSteps && message.practicalSteps.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                        <Lightbulb size={16} />
                        Practical Steps
                      </div>
                      <ul className="space-y-2">
                        {message.practicalSteps.map((step, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 font-medium bg-amber-100 dark:bg-amber-900/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span className="flex-1">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prayer Suggestion */}
                  {message.prayerSuggestion && (
                    <div className="mt-4 bg-amber-50/80 dark:bg-amber-900/30 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2 text-amber-700 dark:text-amber-400">
                        <Users size={16} />
                        Suggested Prayer
                      </div>
                      <p className="text-sm italic">&ldquo;{message.prayerSuggestion}&rdquo;</p>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <HelpCircle size={14} />
                        Continue the conversation:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.followUpQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion(question)}
                            className="text-xs h-auto py-1 px-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                            disabled={isLoading}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Message */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800/90 border-2 border-amber-300 dark:border-amber-500/50 rounded-lg p-4 mr-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <Bot size={18} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-base font-medium text-amber-700 dark:text-amber-300">Divine Counselor</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="animate-spin text-amber-600 dark:text-amber-400" size={16} />
                    <span className="text-base">Seeking wisdom from Scripture...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-t">
              <p className="text-sm">{error}</p>
              {error.includes("limit") && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => (window.location.href = "/pricing")}
                  className="p-0 h-auto text-sm text-red-600"
                >
                  Upgrade your plan →
                </Button>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-amber-200 dark:border-amber-800/50 bg-white dark:bg-gray-800 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(currentInput)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={
                  showStarterQuestions ? "Or type your own question here..." : "Share what's on your heart..."
                }
                className="flex-1 px-4 py-3 border border-amber-200 dark:border-amber-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !currentInput.trim()}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Send size={16} />
              </Button>
            </form>

            {/* Input hints */}
            <div className="mt-2 text-xs text-amber-600/70 dark:text-amber-500/70 text-center">
              💡 Tip: Be specific about your situation for more personalized guidance
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Help */}
      <Card className="divine-light-card">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Star size={16} />
            How to Get the Most from Heart to Heart
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-amber-600">1.</span>
              <div>
                <h4 className="font-medium mb-1 text-amber-700 dark:text-amber-400">Be Open & Honest</h4>
                <p className="text-amber-600/80 dark:text-amber-500/80">
                  Share your real feelings and struggles - this is a judgment-free space
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-600">2.</span>
              <div>
                <h4 className="font-medium mb-1 text-amber-700 dark:text-amber-400">Ask Follow-up Questions</h4>
                <p className="text-amber-600/80 dark:text-amber-500/80">
                  Dive deeper into topics that resonate with you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-600">3.</span>
              <div>
                <h4 className="font-medium mb-1 text-amber-700 dark:text-amber-400">Save Meaningful Verses</h4>
                <p className="text-amber-600/80 dark:text-amber-500/80">
                  Click the heart icon to save verses that speak to you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-600">4.</span>
              <div>
                <h4 className="font-medium mb-1 text-amber-700 dark:text-amber-400">Take Your Time</h4>
                <p className="text-amber-600/80 dark:text-amber-500/80">
                  There's no rush - reflect on the guidance you receive
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
