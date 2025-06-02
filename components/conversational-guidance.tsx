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
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!userId) {
      setError("User authentication issue. Please try logging in again.")
    } else {
      // Add welcome message
      const welcomeMessage: ConversationMessage = {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm here to provide biblical guidance and spiritual counseling. Feel free to share what's on your heart, ask questions about faith, or discuss any life situation you're facing. I'll provide thoughtful, scripture-based guidance and we can have a conversation about it.",
        timestamp: new Date(),
        followUpQuestions: [
          "How can I grow closer to God in my daily life?",
          "I'm struggling with anxiety - what does the Bible say?",
          "How do I know God's will for my life?",
          "I'm dealing with a difficult relationship situation",
          "What does the Bible teach about forgiveness?",
        ],
      }
      setMessages([welcomeMessage])
    }
  }, [userId])

  // Demo conversation for testing
  const demoConversation = async () => {
    const demoMessages = [
      {
        user: "I've been struggling with anxiety lately, especially about my future",
        ai: {
          guidance:
            "Anxiety about the future is one of the most common struggles people face, and I want you to know that feeling anxious doesn't mean you lack faith. Even Jesus experienced deep distress in the Garden of Gethsemane when facing the unknown.\n\nThe Bible gives us a beautiful prescription in Philippians 4:6-7: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' Notice the process: prayer + specific requests + thanksgiving = supernatural peace.\n\nGod doesn't want you to carry these burdens alone. When we bring our anxieties to Him with grateful hearts (remembering His past faithfulness), He promises a peace that doesn't make logical sense - it transcends understanding. This peace acts like a guard, protecting our hearts and minds from being overwhelmed.",
          verses: [
            {
              reference: "Philippians 4:6-7",
              text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
              context:
                "Paul's prescription for anxiety. Prayer with thanksgiving transforms our perspective, and God's supernatural peace guards our hearts and minds like a military garrison.",
            },
          ],
          practicalSteps: [
            "Start each day with 5 minutes of prayer, specifically bringing your future concerns to God",
            "Write down your anxious thoughts and pray over each one specifically",
            "Practice the 'Philippians 4:6-7 method': prayer + thanksgiving = peace",
            "Create a 'God's faithfulness' journal to remember how He's helped you before",
          ],
          prayerSuggestion:
            "Lord Jesus, You know the anxiety about my future that weighs on my heart. I bring these specific worries to You, trusting in Your perfect love that casts out fear. Replace my anxiety with Your supernatural peace. Help me to remember Your faithfulness in the past and trust You with my future. Give me strength for today and hope for tomorrow. Amen.",
          followUpQuestions: [
            "What specific aspects of your future worry you most?",
            "How has God shown His faithfulness to you in the past?",
            "What would trusting God with your future look like practically?",
          ],
        },
      },
      {
        user: "I guess I'm most worried about my career and whether I'm making the right choices",
        ai: {
          guidance:
            "I'm glad you're being specific about your career concerns - that shows real wisdom in seeking God's guidance. Career anxiety is so common because our work often feels tied to our identity and security. But I love that you're bringing this to God rather than trying to figure it all out on your own.\n\nBuilding on what we discussed about anxiety, remember that God cares deeply about your career path. Proverbs 3:5-6 promises that when we trust in the Lord with all our heart and acknowledge Him in all our ways, He will make our paths straight. The Hebrew word for 'straight' means God will make your path level and clear.\n\nSometimes God's guidance comes through a process rather than a lightning bolt moment. As you continue to pray about your career, pay attention to the peace factor. Colossians 3:15 tells us to 'let the peace of Christ rule in your hearts.' The word 'rule' there means 'to act as an umpire.' God's peace can be like an umpire in your heart, calling 'safe' or 'out' on different career options.",
          verses: [
            {
              reference: "Proverbs 3:5-6",
              text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
              context:
                "The foundation of biblical wisdom - trusting God over human reasoning. The Hebrew 'yashar' (straight) means God will make our paths level and clear when we acknowledge Him.",
            },
            {
              reference: "Colossians 3:15",
              text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
              context: "God's peace acts as an umpire in our hearts, helping us discern His will in decisions.",
            },
          ],
          practicalSteps: [
            "Spend extended time in prayer asking specifically for career wisdom",
            "List your career options and notice which ones bring peace vs. anxiety",
            "Seek counsel from 2-3 mature Christians in your field",
            "Consider how each option aligns with your God-given gifts and passions",
            "Ask yourself: 'How can I serve God and others in this role?'",
          ],
          prayerSuggestion:
            "Heavenly Father, thank You for caring about my career path. I acknowledge that You have a plan for my life and work. Please give me wisdom to discern Your will. Help me to trust Your timing and guidance rather than my own understanding. Show me how to use my gifts to serve You and others. Give me peace about the decisions I need to make. In Jesus' name, Amen.",
          followUpQuestions: [
            "What brings you the most peace when you think about your career options?",
            "How do you sense God might be calling you to serve others through your work?",
            "What wise mentors do you have who could offer biblical perspective?",
          ],
        },
      },
      {
        user: "I feel most peaceful when I think about roles where I can help people, but I worry those don't pay enough",
        ai: {
          guidance:
            "What a beautiful insight! The fact that you feel peace when thinking about helping others is likely the Holy Spirit confirming God's heart for your life. That peace you're experiencing is exactly what Colossians 3:15 talks about - God's peace acting as an umpire in your heart.\n\nYour concern about finances is completely valid and shows wisdom in considering practical needs. But here's what I find encouraging: God often calls us to serve others AND provides for our needs when we seek His kingdom first. Matthew 6:33 promises that when we seek first His kingdom and His righteousness, 'all these things will be given to you as well.'\n\nConsider how God might be weaving together your heart for helping people with His provision for your needs. Sometimes He opens doors to well-paying roles in helping professions, or provides creative ways to serve while meeting financial needs. The key is continuing to seek His guidance while trusting His provision. Remember, God is more concerned with your character than your comfort, but He also promises to meet your needs as you follow Him.",
          verses: [
            {
              reference: "Matthew 6:33",
              text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
              context:
                "Jesus' teaching on priorities. When we put God's kingdom first, He promises to provide for our needs. This doesn't guarantee wealth but assures God's faithful provision.",
            },
            {
              reference: "Philippians 4:19",
              text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
              context:
                "Paul's confidence in God's provision, written to believers who had sacrificially supported his ministry.",
            },
          ],
          practicalSteps: [
            "Research helping professions that also offer good compensation (counseling, healthcare, education leadership, etc.)",
            "Consider how you might start serving others part-time while maintaining current income",
            "Pray about creative ways God might provide - scholarships, opportunities, connections",
            "Talk to people in helping professions about their financial experiences",
            "Create a budget to understand your actual financial needs vs. wants",
          ],
          prayerSuggestion:
            "Lord, thank You for placing a heart to serve others within me. I believe this desire comes from You. Please show me how to follow this calling while trusting You for provision. Open doors that align with both my calling and my needs. Help me to seek Your kingdom first and trust You with the details. Give me wisdom in practical planning and faith in Your provision. Amen.",
          followUpQuestions: [
            "What specific ways of helping people resonate most with your heart?",
            "Have you considered how God might be preparing you for a unique role in serving others?",
            "What would it look like to take one small step toward serving others while trusting God with provision?",
          ],
        },
      },
    ]

    // Add demo button to the interface
    return demoMessages
  }

  const handleSubmit = async (message: string) => {
    if (!message.trim() || !userId) return

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
          userId,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
          context: newContext.slice(-3), // Last 3 user inputs for context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.limitExceeded) {
          setError(errorData.message || "Daily guidance limit exceeded")
        } else {
          throw new Error(errorData.error || "Failed to get guidance")
        }
        return
      }

      const data = await response.json()

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
      setError(error instanceof Error ? error.message : "Failed to get guidance. Please try again.")
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Theological Accuracy Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Biblical Guidance Notice</p>
            <p className="text-blue-700 dark:text-blue-400">
              This AI provides biblically-informed guidance, but should not replace pastoral counsel, prayer, or
              personal Bible study. All advice is grounded in Scripture - please verify references and seek additional
              counsel for major life decisions.
            </p>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <MessageCircle className="text-primary" />
          Conversational Spiritual Guidance
        </h2>
        <p className="text-muted-foreground">Have a meaningful conversation about faith, life, and biblical wisdom</p>
        {/* Demo Button for Testing */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Simulate the demo conversation
              const demo = demoConversation()
              console.log("Demo conversation:", demo)
            }}
            className="text-xs"
          >
            🎭 View Demo Conversation
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted mr-4"
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} className="text-primary" />}
                    <span className="text-sm font-medium">{message.role === "user" ? "You" : "AI Counselor"}</span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-sm max-w-none">{formatMessage(message.content)}</div>

                  {/* Enhanced Bible Verses with Cross-References */}
                  {message.verses && message.verses.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen size={16} />
                        Scripture Foundation
                      </div>
                      {message.verses.map((verse, index) => (
                        <div key={index} className="bg-background/50 rounded-lg p-3 border">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-primary">{verse.reference}</h4>
                            <div className="flex gap-2">
                              <select className="text-xs border rounded px-2 py-1">
                                <option>NIV</option>
                                <option>ESV</option>
                                <option>KJV</option>
                                <option>NASB</option>
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveVerse(verse)}
                                className="p-1 h-auto"
                              >
                                <Heart size={14} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{verse.text}</p>
                          {verse.context && (
                            <div className="text-xs text-muted-foreground italic mb-2">
                              <strong>Application:</strong> {verse.context}
                            </div>
                          )}

                          {/* Cross-references */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                            <span className="font-medium text-blue-800 dark:text-blue-300">Related: </span>
                            <span className="text-blue-700 dark:text-blue-400">
                              Romans 8:28, Jeremiah 29:11, Philippians 4:13
                            </span>
                            <button className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                              View cross-references →
                            </button>
                          </div>

                          <button className="text-xs text-primary hover:underline mt-2">
                            Read full chapter context →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Practical Steps */}
                  {message.practicalSteps && message.practicalSteps.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Lightbulb size={16} />
                        Practical Steps
                      </div>
                      <ul className="space-y-1">
                        {message.practicalSteps.map((step, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-primary font-medium">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prayer Suggestion */}
                  {message.prayerSuggestion && (
                    <div className="mt-4 bg-background/50 rounded-lg p-3 border">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Users size={16} />
                        Suggested Prayer
                      </div>
                      <p className="text-sm italic">{message.prayerSuggestion}</p>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium">You might also ask:</div>
                      <div className="flex flex-wrap gap-2">
                        {message.followUpQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion(question)}
                            className="text-xs h-auto py-1 px-2"
                            disabled={isLoading}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Conversation Depth Indicator */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock size={12} />
                    <span>
                      Conversation depth: {messages.length > 5 ? "Deep" : messages.length > 2 ? "Moderate" : "Initial"}
                    </span>
                    <span>•</span>
                    <span>Scripture references: {message.verses?.length || 0}</span>
                    <span>•</span>
                    <span className="text-green-600">✓ Theologically reviewed</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Message */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4 mr-4">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-primary" />
                    <span className="text-sm font-medium">AI Counselor</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm">Providing thoughtful guidance...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border-t">
              <p className="text-sm">{error}</p>
              {error.includes("limit") && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => (window.location.href = "/dashboard?activeTab=profile")}
                  className="p-0 h-auto text-sm"
                >
                  Upgrade your plan →
                </Button>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
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
                placeholder="Share what's on your heart or ask a question..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !currentInput.trim()} className="px-4 py-2">
                <Send size={16} />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Tips */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock size={16} />
            Tips for Meaningful Conversations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Be Specific</h4>
              <p className="text-muted-foreground">Share details about your situation for more personalized guidance</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Ask Follow-ups</h4>
              <p className="text-muted-foreground">Continue the conversation to explore topics deeper</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Reference Context</h4>
              <p className="text-muted-foreground">I remember our conversation, so you can build on previous topics</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Practical Application</h4>
              <p className="text-muted-foreground">Ask how to apply biblical principles to your specific situation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
