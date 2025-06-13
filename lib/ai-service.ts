import { serverEnv, isServer } from "./env-utils"
import { openaiService } from "./openai-service"
import { bibleBlobService } from "./bible-blob-service"

// AI service for Deep Infra integration
interface AISearchResult {
  reference: string
  text: string
  relevanceScore: number
  context?: string
}

interface LifeGuidanceResult {
  guidance: string
  relevantVerses: AISearchResult[]
  practicalSteps: string[]
  prayerSuggestion?: string
}

interface ConversationalGuidanceResult {
  guidance: string
  relevantVerses: AISearchResult[]
  practicalSteps: string[]
  prayerSuggestion?: string
  followUpQuestions: string[]
}

interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface DailyVerseResult {
  reference: string
  text: string
  relevanceScore: number
  context?: string
}

export class AIService {
  private apiKey: string
  private baseUrl = "https://api.deepinfra.com/v1/inference"
  private isConfigured: boolean

  constructor() {
    // Only access server environment variables on the server
    if (isServer) {
      this.apiKey = serverEnv.DEEPINFRA_API_KEY
      this.isConfigured = !!this.apiKey

      if (!this.isConfigured) {
        console.warn("Deep Infra API key not configured. Will try OpenAI or use intelligent fallback responses.")
      }
    } else {
      // On client, don't even try to access server env vars
      this.apiKey = ""
      this.isConfigured = false
    }
  }

  async getDailyVerse(preferences?: string[]): Promise<DailyVerseResult> {
    console.log(`=== AI Service: Daily verse request ===`)
    console.log(`Preferences: ${preferences}`)

    // Try OpenAI first
    try {
      console.log("Trying OpenAI for daily verse...")
      const openaiVerse = await openaiService.getDailyVerse(preferences)
      if (openaiVerse && openaiVerse.reference) {
        console.log("OpenAI daily verse successful")
        return openaiVerse
      }
      console.log("OpenAI daily verse failed or returned empty result")
    } catch (error) {
      console.log("OpenAI daily verse failed, trying Deep Infra:", error)
    }

    // Try Deep Infra as fallback
    if (this.isConfigured) {
      try {
        console.log("Trying Deep Infra for daily verse...")

        const preferencesText =
          preferences && preferences.length > 0 ? `User preferences: ${preferences.join(", ")}. ` : ""

        const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            input: `You are a wise biblical scholar selecting an inspiring daily verse. ${preferencesText}Select a meaningful Bible verse for today's encouragement.

Respond in this JSON format:
{
  "reference": "Book Chapter:Verse",
  "text": "Complete verse text (ESV or NIV)",
  "relevanceScore": 0.95,
  "context": "Brief explanation of why this verse is meaningful for today (1-2 sentences)"
}

Choose a verse that offers hope, encouragement, or wisdom for daily life.`,
            max_new_tokens: 500,
            temperature: 0.3,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.results?.[0]?.generated_text

          if (aiResponse) {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                const result = JSON.parse(jsonMatch[0])
                console.log("Deep Infra daily verse successful")
                return {
                  reference: result.reference,
                  text: result.text,
                  relevanceScore: result.relevanceScore || 0.9,
                  context: result.context,
                }
              } catch (parseError) {
                console.error("Error parsing Deep Infra daily verse response:", parseError)
              }
            }
          }
        } else {
          console.error("Deep Infra API error:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error in Deep Infra daily verse:", error)
      }
    }

    // Fallback to intelligent daily verse selection
    console.log("Using intelligent fallback daily verse")
    return this.getIntelligentDailyVerse(preferences)
  }

  private getIntelligentDailyVerse(preferences?: string[]): DailyVerseResult {
    console.log("=== Using intelligent daily verse selection ===")

    // Curated collection of inspiring daily verses
    const dailyVerses = [
      {
        reference: "Psalm 118:24",
        text: "This is the day the Lord has made; let us rejoice and be glad in it.",
        relevanceScore: 1.0,
        context: "A reminder to find joy and gratitude in each new day that God has given us.",
      },
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        relevanceScore: 1.0,
        context: "God has good plans for our lives, giving us hope and a future filled with His purposes.",
      },
      {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
        relevanceScore: 1.0,
        context: "Through Christ's strength, we can face any challenge or situation that comes our way.",
      },
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        relevanceScore: 1.0,
        context: "God provides renewed strength to those who put their hope and trust in Him.",
      },
      {
        reference: "Proverbs 3:5-6",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        relevanceScore: 1.0,
        context: "When we trust God completely and acknowledge Him in all our decisions, He guides our path.",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        relevanceScore: 1.0,
        context: "Even in difficult circumstances, God is working everything together for our ultimate good.",
      },
      {
        reference: "Lamentations 3:22-23",
        text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
        relevanceScore: 1.0,
        context: "God's mercy and faithfulness are renewed each morning, giving us hope for each new day.",
      },
      {
        reference: "Matthew 6:26",
        text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
        relevanceScore: 1.0,
        context: "God cares for all His creation, and we are precious to Him - He will provide for our needs.",
      },
      {
        reference: "Psalm 46:1",
        text: "God is our refuge and strength, an ever-present help in trouble.",
        relevanceScore: 1.0,
        context: "In times of difficulty or uncertainty, God is our safe place and source of strength.",
      },
      {
        reference: "John 14:27",
        text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
        relevanceScore: 1.0,
        context: "Jesus offers us a supernatural peace that surpasses understanding and calms our fears.",
      },
      {
        reference: "1 Peter 5:7",
        text: "Cast all your anxiety on him because he cares for you.",
        relevanceScore: 1.0,
        context: "We can bring all our worries and concerns to God because He genuinely cares about us.",
      },
      {
        reference: "Ephesians 2:10",
        text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
        relevanceScore: 1.0,
        context: "We are God's masterpiece, created with purpose and designed to make a difference in the world.",
      },
    ]

    // Select verse based on day of year for variety, but with some randomness
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)

    // Add some preference-based selection if provided
    let selectedVerses = dailyVerses
    if (preferences && preferences.length > 0) {
      const preferenceKeywords = preferences.join(" ").toLowerCase()

      // Filter verses that might match preferences
      const matchingVerses = dailyVerses.filter((verse) => {
        const verseContent = (verse.text + " " + verse.context).toLowerCase()
        return preferences.some(
          (pref) =>
            verseContent.includes(pref.toLowerCase()) ||
            (pref.toLowerCase().includes("hope") && verseContent.includes("hope")) ||
            (pref.toLowerCase().includes("strength") && verseContent.includes("strength")) ||
            (pref.toLowerCase().includes("peace") && verseContent.includes("peace")),
        )
      })

      if (matchingVerses.length > 0) {
        selectedVerses = matchingVerses
      }
    }

    const selectedVerse = selectedVerses[dayOfYear % selectedVerses.length]
    console.log(`Selected verse: ${selectedVerse.reference}`)

    return selectedVerse
  }

  async getConversationalGuidance(
    message: string,
    conversationHistory: ConversationMessage[] = [],
    context: string[] = [],
  ): Promise<ConversationalGuidanceResult> {
    console.log(`=== AI Service: Conversational guidance request ===`)
    console.log(`Message: "${message}"`)
    console.log(`History length: ${conversationHistory.length}`)
    console.log(`Context: ${context}`)

    // Try OpenAI first
    try {
      console.log("Trying OpenAI for conversational guidance...")
      const openaiGuidance = await openaiService.getConversationalGuidance(message, conversationHistory, context)
      if (openaiGuidance && openaiGuidance.guidance) {
        console.log("OpenAI conversational guidance successful")
        return openaiGuidance
      }
      console.log("OpenAI conversational guidance failed or returned empty result")
    } catch (error) {
      console.log("OpenAI conversational guidance failed, trying Deep Infra:", error)
    }

    // Try Deep Infra as fallback
    if (this.isConfigured) {
      try {
        console.log("Trying Deep Infra for conversational guidance...")

        // Build conversation context
        const conversationContext = conversationHistory
          .slice(-4) // Last 4 messages for context
          .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
          .join("\n")

        const contextString = context.length > 0 ? `Previous topics discussed: ${context.join(", ")}` : ""

        const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            input: `You are a wise, compassionate Christian counselor and spiritual mentor. You provide deep, contextual biblical guidance in a conversational style.

Current message: "${message}"

${contextString}

Recent conversation:
${conversationContext}

Provide a comprehensive response in this JSON format:
{
  "guidance": "Thoughtful, conversational biblical guidance (3-4 paragraphs). Reference the conversation context when relevant. Provide deep insights, biblical examples, and practical application. Use a warm, pastoral tone.",
  "relevantVerses": [
    {
      "reference": "Book Chapter:Verse",
      "text": "Complete verse text",
      "relevanceScore": 0.95,
      "context": "Deep explanation of how this verse applies to their situation"
    }
  ],
  "practicalSteps": [
    "Specific, actionable step with biblical foundation",
    "Another practical step they can implement today"
  ],
  "prayerSuggestion": "A personalized prayer addressing their specific situation",
  "followUpQuestions": [
    "Thoughtful follow-up question to deepen the conversation",
    "Another question to explore related aspects"
  ]
}

Make the response conversational, contextual, and deeply pastoral. Reference their previous questions when relevant.`,
            max_new_tokens: 1200,
            temperature: 0.3,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.results?.[0]?.generated_text

          if (aiResponse) {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                const result = JSON.parse(jsonMatch[0])
                console.log("Deep Infra conversational guidance successful")
                return {
                  guidance: result.guidance,
                  relevantVerses: result.relevantVerses || [],
                  practicalSteps: result.practicalSteps || [],
                  prayerSuggestion: result.prayerSuggestion,
                  followUpQuestions: result.followUpQuestions || [],
                }
              } catch (parseError) {
                console.error("Error parsing Deep Infra conversational guidance response:", parseError)
              }
            }
          }
        } else {
          console.error("Deep Infra API error:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error in Deep Infra conversational guidance:", error)
      }
    }

    // Fallback to intelligent conversational guidance
    console.log("Using intelligent fallback conversational guidance")
    return this.getIntelligentConversationalGuidance(message, conversationHistory, context)
  }

  private getIntelligentConversationalGuidance(
    message: string,
    conversationHistory: ConversationMessage[],
    context: string[],
  ): ConversationalGuidanceResult {
    console.log("=== Using intelligent conversational guidance ===")

    const messageLower = message.toLowerCase()
    const contextTopics = context.join(" ").toLowerCase()
    const recentMessages = conversationHistory
      .slice(-2)
      .map((m) => m.content)
      .join(" ")
      .toLowerCase()

    // Analyze for conversation continuity
    const isFollowUp = conversationHistory.length > 1
    const previousTopics = this.extractTopicsFromHistory(conversationHistory)

    let guidance = ""
    let relevantVerses: AISearchResult[] = []
    let practicalSteps: string[] = []
    let prayerSuggestion = ""
    let followUpQuestions: string[] = []

    // Determine the main theme and provide contextual guidance
    if (messageLower.includes("anxiety") || messageLower.includes("worry") || messageLower.includes("fear")) {
      guidance = this.getAnxietyGuidance(isFollowUp, previousTopics, message)
      relevantVerses = this.getComprehensiveBibleSearch("anxiety fear worry").slice(0, 3)
      practicalSteps = [
        "Start each day with 5 minutes of prayer, specifically bringing your worries to God",
        "Write down your anxious thoughts and pray over each one specifically",
        "Practice the 'Philippians 4:6-7 method': prayer + thanksgiving = peace",
        "Create a 'God's faithfulness' journal to remember how He's helped you before",
        "When anxiety hits, recite Isaiah 41:10 aloud and breathe deeply",
      ]
      prayerSuggestion =
        "Lord Jesus, You know the specific anxieties weighing on my heart right now. I bring each worry to You, trusting in Your perfect love that casts out fear. Replace my anxiety with Your supernatural peace. Help me to remember Your faithfulness in the past and trust You with my future. Give me strength for today and hope for tomorrow. Amen."
      followUpQuestions = [
        "What specific situations trigger your anxiety the most?",
        "How has God helped you through anxious times before?",
        "Would you like to explore biblical examples of people who overcame fear?",
        "What practical prayer strategies have you tried?",
      ]
    } else if (messageLower.includes("forgiv") || messageLower.includes("hurt") || messageLower.includes("anger")) {
      guidance = this.getForgivenessGuidance(isFollowUp, previousTopics, message)
      relevantVerses = this.getComprehensiveBibleSearch("forgiveness").slice(0, 3)
      practicalSteps = [
        "Pray for the person who hurt you, even if it feels impossible at first",
        "Write a letter expressing your feelings (you don't have to send it)",
        "Focus on God's forgiveness of you when you struggle to forgive others",
        "Set healthy boundaries while still choosing to forgive",
        "Seek wise counsel from a pastor or Christian counselor if needed",
      ]
      prayerSuggestion =
        "Heavenly Father, forgiveness feels so difficult right now. You know the pain I'm carrying and how hard it is to let go. Please help me to forgive as You have forgiven me. Heal my heart, give me Your perspective on this situation, and help me to trust You with justice. Fill the hurt places with Your love and peace. In Jesus' name, Amen."
      followUpQuestions = [
        "What makes forgiveness feel most difficult in this situation?",
        "How has experiencing God's forgiveness changed your perspective?",
        "Would you like to explore what forgiveness does and doesn't mean?",
        "What boundaries might be healthy in this relationship?",
      ]
    } else if (
      messageLower.includes("decision") ||
      messageLower.includes("choice") ||
      messageLower.includes("guidance")
    ) {
      guidance = this.getDecisionGuidance(isFollowUp, previousTopics, message)
      relevantVerses = this.getComprehensiveBibleSearch("wisdom guidance").slice(0, 3)
      practicalSteps = [
        "Spend extended time in prayer asking specifically for God's wisdom",
        "Study relevant Bible passages that relate to your decision",
        "Seek counsel from 2-3 mature Christians you trust",
        "List pros and cons while considering biblical principles",
        "Pay attention to the peace (or lack thereof) you feel about each option",
      ]
      prayerSuggestion =
        "Lord, I need Your wisdom for this important decision. You promise to give wisdom generously to those who ask, so I'm asking for Your clear guidance. Help me to see this situation from Your perspective. Give me discernment to know Your will and courage to follow it, even if it's difficult. I trust that You will direct my steps as I seek You first. Amen."
      followUpQuestions = [
        "What are the main options you're considering?",
        "How do these choices align with biblical principles?",
        "What wise counselors do you have in your life?",
        "What does your peace level tell you about each option?",
      ]
    } else {
      // General conversational guidance
      guidance = this.getGeneralConversationalGuidance(message, isFollowUp, previousTopics)
      relevantVerses = this.getComprehensiveBibleSearch("hope strength faith").slice(0, 2)
      practicalSteps = [
        "Spend time in prayer, honestly sharing your heart with God",
        "Read and meditate on Scripture that speaks to your situation",
        "Seek wise counsel from trusted Christian friends or mentors",
        "Take one small step forward while trusting God with the outcome",
      ]
      prayerSuggestion =
        "Dear Heavenly Father, thank You for caring about every detail of my life. I bring this situation to You, knowing that You understand completely. Please grant me wisdom, peace, and strength. Help me to trust in Your perfect timing and plan. Guide my steps and help me to grow through this experience. In Jesus' name, Amen."
      followUpQuestions = [
        "What aspect of this situation concerns you most?",
        "How have you seen God work in similar situations before?",
        "What would trusting God look like in this specific case?",
        "How can I pray more specifically for you?",
      ]
    }

    return {
      guidance,
      relevantVerses,
      practicalSteps,
      prayerSuggestion,
      followUpQuestions,
    }
  }

  private getAnxietyGuidance(isFollowUp: boolean, previousTopics: string[], message: string): string {
    if (isFollowUp && previousTopics.includes("anxiety")) {
      return `I'm glad you're continuing to work through this anxiety with me. It shows real courage to keep seeking God's help. Building on what we've discussed, remember that overcoming anxiety is often a process, not a one-time event.

The Bible shows us that even great people of faith experienced anxiety. David wrote many psalms from places of fear and worry, yet he consistently turned to God for peace. In Psalm 42:11, he literally talks to his soul: "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God."

What I find beautiful about this is that David doesn't deny his feelings - he acknowledges them, then redirects his focus to God's character and faithfulness. This can be a powerful model for us. When anxiety comes, we can acknowledge it without letting it control us, then actively choose to focus on God's promises and past faithfulness.`
    }

    return `Anxiety is one of the most common struggles people face, and I want you to know that feeling anxious doesn't mean you lack faith. Even Jesus experienced deep distress in the Garden of Gethsemane. What matters is what we do with our anxiety.

The Bible gives us a beautiful prescription in Philippians 4:6-7: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." Notice the process: prayer + specific requests + thanksgiving = supernatural peace.

God doesn't want you to carry these burdens alone. When we bring our anxieties to Him with grateful hearts (remembering His past faithfulness), He promises a peace that doesn't make logical sense - it transcends understanding. This peace acts like a guard, protecting our hearts and minds from being overwhelmed.`
  }

  private getForgivenessGuidance(isFollowUp: boolean, previousTopics: string[], message: string): string {
    if (isFollowUp && previousTopics.includes("forgiveness")) {
      return `I appreciate you continuing to wrestle with forgiveness - it shows a heart that truly wants to follow Christ, even when it's difficult. Forgiveness is rarely a one-time decision; it's often a process we have to walk through step by step.

Remember, forgiveness doesn't mean the hurt wasn't real or that what happened was okay. It means we're choosing to release our right to revenge and trusting God with justice. As C.S. Lewis said, "To forgive is to set a prisoner free and discover that the prisoner was you."

Sometimes we need to forgive the same person multiple times - not because our first forgiveness wasn't real, but because the hurt keeps surfacing. Jesus told Peter to forgive "seventy-seven times" (Matthew 18:22), which was His way of saying "as many times as it takes." Each time we choose forgiveness, we're choosing freedom over bitterness.`
    }

    return `Forgiveness is one of the most challenging yet transformative aspects of following Christ. When someone has hurt us deeply, our natural response is often anger, resentment, or a desire for justice. These feelings are normal and valid - even Jesus felt righteous anger.

However, God calls us to a higher standard: to forgive as we have been forgiven (Ephesians 4:32). This doesn't mean excusing the wrong or pretending it didn't happen. Forgiveness means releasing the burden of resentment and choosing to trust God with justice.

The beautiful truth is that forgiveness is more for us than for the person who hurt us. Bitterness is like drinking poison and expecting the other person to get sick. When we forgive, we're choosing freedom over bondage, peace over turmoil. God can bring beauty from ashes and use even painful experiences for our growth and His glory.`
  }

  private getDecisionGuidance(isFollowUp: boolean, previousTopics: string[], message: string): string {
    if (isFollowUp && previousTopics.includes("decision")) {
      return `I'm glad you're taking time to seek God's wisdom in this decision. That patience itself is wisdom. Sometimes God's guidance comes through a process rather than a lightning bolt moment.

As you continue to pray and seek counsel, pay attention to the peace factor. Colossians 3:15 tells us to "let the peace of Christ rule in your hearts." The word "rule" there means "to act as an umpire." God's peace can be like an umpire in our hearts, calling "safe" or "out" on different options.

Also consider how each option aligns with what you know of God's character and His revealed will in Scripture. God will never lead you to do something that contradicts His Word. His guidance will always be consistent with His nature - loving, just, wise, and good.`
    }

    return `Making important decisions can feel overwhelming, especially when the stakes are high or the path forward isn't clear. But what a blessing that you're seeking God's guidance! This shows a heart that wants to honor Him.

God promises in James 1:5: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you." Notice that God gives wisdom "generously" and "without finding fault" - He's not reluctant or critical when we ask for help.

Seeking God's will often involves multiple channels: prayer, Scripture, wise counsel, circumstances, and the peace of God in your heart. Proverbs 3:5-6 reminds us to "trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." When we acknowledge God in our decisions, He promises to direct our paths.`
  }

  private getGeneralConversationalGuidance(message: string, isFollowUp: boolean, previousTopics: string[]): string {
    if (isFollowUp) {
      return `Thank you for continuing our conversation. I can sense that you're genuinely seeking God's heart in this matter, and that's beautiful. Sometimes the most important thing isn't getting immediate answers, but developing a deeper relationship with God through the process.

Whatever you're facing, remember that God sees you, knows your situation completely, and cares deeply about what concerns you. Romans 8:28 reminds us that "in all things God works for the good of those who love him, who have been called according to his purpose." This doesn't mean everything that happens is good, but that God can work even difficult circumstances for our ultimate good.

I'm here to continue walking through this with you. Feel free to share more specifically about what's on your heart, or ask any follow-up questions that come to mind.`
    }

    return `Thank you for sharing what's on your heart. It takes courage to be vulnerable and seek guidance, and I'm honored that you've chosen to have this conversation.

Whatever you're facing, please know that you're not alone. God sees your situation and cares deeply about what concerns you. The Bible reminds us in 1 Peter 5:7 to "cast all your anxiety on him because he cares for you." The word "cares" there means He's genuinely concerned and invested in your wellbeing.

Life's challenges can feel overwhelming, but they're also opportunities for growth and deeper faith. God often uses difficult seasons to develop our character, strengthen our trust in Him, and prepare us to help others who face similar struggles. I'd love to explore this situation with you more deeply and help you discover what God might be saying through it.`
  }

  private extractTopicsFromHistory(history: ConversationMessage[]): string[] {
    const topics: string[] = []
    const keywords = {
      anxiety: ["anxiety", "anxious", "worry", "worried", "fear", "afraid"],
      forgiveness: ["forgive", "forgiveness", "hurt", "anger", "angry"],
      decision: ["decision", "choice", "choose", "guidance", "wisdom"],
      relationship: ["relationship", "marriage", "family", "friend"],
      faith: ["faith", "believe", "trust", "doubt"],
      prayer: ["pray", "prayer", "praying"],
    }

    for (const message of history) {
      if (message.role === "user") {
        const content = message.content.toLowerCase()
        for (const [topic, words] of Object.entries(keywords)) {
          if (words.some((word) => content.includes(word))) {
            if (!topics.includes(topic)) {
              topics.push(topic)
            }
          }
        }
      }
    }

    return topics
  }

  async searchBible(query: string): Promise<AISearchResult[]> {
    // Client-side safety check
    if (!isServer) {
      console.log("Client-side AI search, using intelligent fallback")
      return this.getIntelligentSearchResults(query)
    }

    console.log(`=== Comprehensive Bible Search Request ===`)
    console.log(`Query: "${query}"`)

    try {
      // First, try to search the actual Bible database using bibleBlobService
      console.log("Attempting comprehensive Bible database search...")
      const bibleResults = await this.searchCompleteBibleDatabase(query)

      if (bibleResults && bibleResults.length > 0) {
        console.log("Bible database search successful, found", bibleResults.length, "results")
        return bibleResults
      }

      console.log("Bible database search returned no results, trying AI services...")
    } catch (error) {
      console.error("Bible database search failed:", error)
    }

    // Try OpenAI first for comprehensive search
    try {
      console.log("Attempting OpenAI Bible search...")
      const openaiResults = await openaiService.searchBible(query)
      if (openaiResults && openaiResults.length > 0) {
        console.log("OpenAI search successful, found", openaiResults.length, "results")
        return openaiResults
      }
    } catch (error) {
      console.log("OpenAI search failed, trying Deep Infra:", error)
    }

    // Try Deep Infra for comprehensive search
    try {
      if (this.isConfigured) {
        console.log("Attempting comprehensive Deep Infra Bible search...")
        const apiResults = await this.callComprehensiveBibleSearch(query)
        if (apiResults && apiResults.length > 0) {
          console.log("Deep Infra comprehensive search successful, returning", apiResults.length, "results")
          return apiResults
        }
        console.log("Deep Infra search failed or returned no results, falling back to intelligent results")
      }
    } catch (error) {
      console.error("Deep Infra API call failed:", error)
    }

    // Enhanced intelligent fallback with comprehensive search
    console.log("Using enhanced intelligent Bible search")
    const fallbackResults = this.getComprehensiveBibleSearch(query)
    console.log("Enhanced fallback results:", fallbackResults.length, "verses found")
    return fallbackResults
  }

  // NEW: Search the complete Bible database using bibleBlobService
  private async searchCompleteBibleDatabase(query: string): Promise<AISearchResult[]> {
    try {
      console.log("=== Searching Complete Bible Database ===")

      // Get all available translations
      const translations = await bibleBlobService.listAvailableTranslations()
      console.log("Available translations:", translations)

      if (translations.length === 0) {
        console.log("No translations available in blob storage")
        return []
      }

      const allResults: Array<AISearchResult & { translation: string }> = []

      // Search across all translations
      for (const translationId of translations) {
        try {
          console.log(`Searching translation: ${translationId}`)

          // Use bibleBlobService to search this translation
          const verses = await bibleBlobService.searchBible(translationId, query, 20)
          console.log(`Found ${verses.length} verses in ${translationId}`)

          // Convert to AISearchResult format
          for (const verse of verses) {
            const relevanceScore = this.calculateRelevanceScore(query, verse.text)
            const context = this.generateContext(verse.book, verse.chapter, verse.verse, verse.text)

            allResults.push({
              reference: `${this.formatBookName(verse.book)} ${verse.chapter}:${verse.verse}`,
              text: verse.text,
              relevanceScore,
              context,
              translation: verse.translation,
            })
          }
        } catch (error) {
          console.error(`Error searching translation ${translationId}:`, error)
          continue
        }
      }

      // Sort by relevance score and remove duplicates
      const uniqueResults = this.removeDuplicateVerses(allResults)
      const sortedResults = uniqueResults
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10) // Return top 10 results
        .map(({ translation, ...result }) => result) // Remove translation field

      console.log(`Returning ${sortedResults.length} results from Bible database`)
      return sortedResults
    } catch (error) {
      console.error("Error in searchCompleteBibleDatabase:", error)
      return []
    }
  }

  // Helper method to calculate relevance score
  private calculateRelevanceScore(query: string, verseText: string): number {
    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2)
    const textLower = verseText.toLowerCase()

    let score = 0
    let totalMatches = 0

    for (const term of queryTerms) {
      const matches = (textLower.match(new RegExp(term, "g")) || []).length
      if (matches > 0) {
        score += matches * (term.length / 3) // Longer terms get higher weight
        totalMatches += matches
      }
    }

    // Bonus for multiple term matches
    if (totalMatches > 1) {
      score *= 1.2
    }

    // Normalize score to 0-1 range
    return Math.min(score / 10, 1.0)
  }

  // Helper method to generate context
  private generateContext(book: string, chapter: number, verse: number, text: string): string {
    const bookName = this.formatBookName(book)
    const themes = this.identifyThemes(text)

    if (themes.length > 0) {
      return `This verse from ${bookName} speaks about ${themes.join(", ")}. It provides biblical insight into these important spiritual themes.`
    }

    return `This verse from ${bookName} chapter ${chapter} offers biblical wisdom and guidance for life.`
  }

  // Helper method to identify themes in verse text
  private identifyThemes(text: string): string[] {
    const textLower = text.toLowerCase()
    const themes: string[] = []

    const themeKeywords = {
      love: ["love", "beloved", "loving"],
      faith: ["faith", "believe", "trust"],
      hope: ["hope", "hopeful", "future"],
      peace: ["peace", "peaceful", "rest"],
      strength: ["strength", "strong", "power"],
      wisdom: ["wisdom", "wise", "understanding"],
      forgiveness: ["forgive", "forgiveness", "mercy"],
      salvation: ["salvation", "saved", "eternal life"],
      prayer: ["pray", "prayer", "ask"],
      guidance: ["guide", "path", "way", "direction"],
    }

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some((keyword) => textLower.includes(keyword))) {
        themes.push(theme)
      }
    }

    return themes
  }

  // Helper method to format book names
  private formatBookName(book: string): string {
    const bookMap: Record<string, string> = {
      genesis: "Genesis",
      exodus: "Exodus",
      leviticus: "Leviticus",
      numbers: "Numbers",
      deuteronomy: "Deuteronomy",
      joshua: "Joshua",
      judges: "Judges",
      ruth: "Ruth",
      "1samuel": "1 Samuel",
      "2samuel": "2 Samuel",
      "1kings": "1 Kings",
      "2kings": "2 Kings",
      "1chronicles": "1 Chronicles",
      "2chronicles": "2 Chronicles",
      ezra: "Ezra",
      nehemiah: "Nehemiah",
      esther: "Esther",
      job: "Job",
      psalms: "Psalms",
      proverbs: "Proverbs",
      ecclesiastes: "Ecclesiastes",
      songofsolomon: "Song of Solomon",
      isaiah: "Isaiah",
      jeremiah: "Jeremiah",
      lamentations: "Lamentations",
      ezekiel: "Ezekiel",
      daniel: "Daniel",
      hosea: "Hosea",
      joel: "Joel",
      amos: "Amos",
      obadiah: "Obadiah",
      jonah: "Jonah",
      micah: "Micah",
      nahum: "Nahum",
      habakkuk: "Habakkuk",
      zephaniah: "Zephaniah",
      haggai: "Haggai",
      zechariah: "Zechariah",
      malachi: "Malachi",
      matthew: "Matthew",
      mark: "Mark",
      luke: "Luke",
      john: "John",
      acts: "Acts",
      romans: "Romans",
      "1corinthians": "1 Corinthians",
      "2corinthians": "2 Corinthians",
      galatians: "Galatians",
      ephesians: "Ephesians",
      philippians: "Philippians",
      colossians: "Colossians",
      "1thessalonians": "1 Thessalonians",
      "2thessalonians": "2 Thessalonians",
      "1timothy": "1 Timothy",
      "2timothy": "2 Timothy",
      titus: "Titus",
      philemon: "Philemon",
      hebrews: "Hebrews",
      james: "James",
      "1peter": "1 Peter",
      "2peter": "2 Peter",
      "1john": "1 John",
      "2john": "2 John",
      "3john": "3 John",
      jude: "Jude",
      revelation: "Revelation",
    }

    return bookMap[book.toLowerCase()] || book
  }

  private async callComprehensiveBibleSearch(query: string): Promise<AISearchResult[]> {
    const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        input: `You are an expert biblical scholar with comprehensive knowledge of the entire Bible. Search for verses related to: "${query}"

Instructions:
1. Find ALL relevant verses that match the query, including exact verse references if mentioned
2. Search for keywords, themes, concepts, and related topics
3. Include verses from both Old and New Testament
4. Provide deep theological insights and context
5. Consider original Hebrew/Greek meanings when relevant

Return 5-8 verses in this JSON format:
[
  {
    "reference": "Book Chapter:Verse",
    "text": "Complete verse text (ESV or NIV)",
    "relevanceScore": 0.95,
    "context": "Deep theological insight explaining the verse's meaning, historical context, and application"
  }
]

Query: "${query}"`,
        max_new_tokens: 1200,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.results?.[0]?.generated_text

    if (aiResponse) {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          const results = JSON.parse(jsonMatch[0])
          return results.map((result: any) => ({
            reference: result.reference,
            text: result.text,
            relevanceScore: result.relevanceScore || 0.9,
            context: result.context,
          }))
        } catch (parseError) {
          console.error("Error parsing comprehensive AI response:", parseError)
        }
      }
    }

    return []
  }

  private getComprehensiveBibleSearch(query: string): AISearchResult[] {
    console.log(`=== Comprehensive Bible Search ===`)
    console.log(`Analyzing query: "${query}"`)

    const queryLower = query.toLowerCase()

    // First, check for exact verse references
    const exactRefs = this.findExactVerseReferences(query)
    if (exactRefs.length > 0) {
      console.log(`Found ${exactRefs.length} exact verse references`)
      return exactRefs
    }

    // Comprehensive Bible verse database
    const bibleDatabase = this.getBibleDatabase()
    const results: AISearchResult[] = []

    // Extract search terms
    const searchTerms = this.extractSearchTerms(queryLower)
    console.log(`Extracted search terms:`, searchTerms)

    // Search by themes
    for (const [themeName, verses] of Object.entries(bibleDatabase.themes)) {
      if (searchTerms.some((term) => term.includes(themeName) || themeName.includes(term))) {
        results.push(...verses.slice(0, 3))
        console.log(`Found theme match: ${themeName}`)
      }
    }

    // Search by keywords in verse text
    const keywordMatches = this.searchByKeywords(queryLower, bibleDatabase)
    results.push(...keywordMatches)

    // Search by book names
    for (const [bookName, verses] of Object.entries(bibleDatabase.books)) {
      if (searchTerms.some((term) => term.includes(bookName) || bookName.includes(term))) {
        results.push(...verses.slice(0, 2))
        console.log(`Found book match: ${bookName}`)
      }
    }

    // Remove duplicates and limit results
    const uniqueResults = this.removeDuplicateVerses(results)
    const finalResults = uniqueResults.slice(0, 8)

    // Calculate relevance scores
    const scoredResults = finalResults.map((result, index) => ({
      ...result,
      relevanceScore: Math.max(0.95 - index * 0.05, 0.7),
    }))

    console.log(`Final results: ${scoredResults.length} verses`)
    return scoredResults
  }

  private findExactVerseReferences(query: string): AISearchResult[] {
    console.log(`Searching for exact verse references in: "${query}"`)

    // Update the exact verses database with better key matching
    const exactVerses: { [key: string]: { text: string; context: string } } = {
      // Add multiple key variations for John 3:16
      "john 3:16": {
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        context:
          "The most famous verse in the Bible, summarizing the gospel message. God's love (agape) is demonstrated through the ultimate sacrifice - giving His Son for humanity's salvation.",
      },
      "john3:16": {
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        context:
          "The most famous verse in the Bible, summarizing the gospel message. God's love (agape) is demonstrated through the ultimate sacrifice - giving His Son for humanity's salvation.",
      },
      "john 3 16": {
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        context:
          "The most famous verse in the Bible, summarizing the gospel message. God's love (agape) is demonstrated through the ultimate sacrifice - giving His Son for humanity's salvation.",
      },
      // John
      "john 14:6": {
        text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
        context:
          "Jesus' exclusive claim to be the only path to God. This verse establishes Christianity's distinctive doctrine that salvation comes only through Christ, not through good works or other religions.",
      },
      "john 1:1": {
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        context:
          "John's profound declaration of Jesus' deity. The 'Word' (Logos) was a concept both Jews and Greeks understood - God's self-expression and reason behind creation.",
      },

      // Romans
      "romans 8:28": {
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        context:
          "Paul's assurance that God sovereignly works all circumstances for the ultimate good of believers. The 'good' refers to conformity to Christ's image (v.29), not necessarily earthly comfort.",
      },
      "romans 10:9": {
        text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.",
        context:
          "The simple yet profound path to salvation. 'Jesus is Lord' (Kyrios) was a radical declaration in the Roman world. Heart belief involves the whole person, not just intellectual assent.",
      },
      "romans 3:23": {
        text: "For all have sinned and fall short of the glory of God.",
        context:
          "Paul's universal declaration of human sinfulness. This verse establishes the need for salvation - no one is righteous enough to earn God's favor through their own efforts.",
      },

      // Psalms
      "psalm 23:1": {
        text: "The Lord is my shepherd, I lack nothing.",
        context:
          "David's most famous psalm. The shepherd metaphor was deeply meaningful in an agricultural society. God provides, protects, guides, and cares for His people like a good shepherd.",
      },
      "psalm 119:105": {
        text: "Your word is a lamp for my feet, a light for my path.",
        context:
          "From the longest chapter in the Bible, celebrating God's Word. In ancient times, a small lamp provided just enough light for the next step - God's Word guides us step by step.",
      },
      "psalm 46:1": {
        text: "God is our refuge and strength, an ever-present help in trouble.",
        context:
          "A declaration of God's reliability in times of crisis. The Hebrew 'maoz' (refuge) suggests a fortress or stronghold - God is our ultimate security.",
      },

      // Philippians
      "philippians 4:13": {
        text: "I can do all this through him who gives me strength.",
        context:
          "Paul's declaration of divine empowerment, written from prison. The context shows this isn't about achieving anything we want, but about contentment and endurance through Christ's strength in all circumstances.",
      },
      "philippians 4:6-7": {
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
        context:
          "Paul's prescription for anxiety. Prayer with thanksgiving transforms our perspective, and God's supernatural peace guards our hearts and minds like a military garrison.",
      },

      // Jeremiah
      "jeremiah 29:11": {
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        context:
          "God's promise to the exiled Israelites, applicable to all believers. The Hebrew 'shalom' (prosper) means wholeness and peace, not just material success. God's plans are always for our ultimate good.",
      },

      // Isaiah
      "isaiah 40:31": {
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        context:
          "The Hebrew 'qavah' (hope/wait) implies active expectation. God provides different types of strength: soaring (supernatural), running (sustained effort), walking (daily endurance).",
      },
      "isaiah 41:10": {
        text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
        context:
          "God's promise of presence and strength in times of fear. The 'righteous right hand' represents God's power and justice working on our behalf.",
      },

      // Proverbs
      "proverbs 3:5-6": {
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        context:
          "The foundation of biblical wisdom - trusting God over human reasoning. The Hebrew 'yashar' (straight) means God will make our paths level and clear when we acknowledge Him.",
      },

      // Matthew
      "matthew 6:33": {
        text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
        context:
          "Jesus' teaching on priorities. When we put God's kingdom first, He promises to provide for our needs. This doesn't guarantee wealth but assures God's faithful provision.",
      },
      "matthew 28:19-20": {
        text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.",
        context:
          "The Great Commission - Jesus' final command to His disciples. This establishes the church's mission to evangelize and disciple all nations, with the promise of Christ's presence.",
      },

      // Ephesians
      "ephesians 2:8-9": {
        text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
        context:
          "Salvation is entirely God's work, not human achievement. Grace (unmerited favor) through faith (trust) excludes any human boasting. It's a gift, not a wage.",
      },

      // 1 Corinthians
      "1 corinthians 13:4-7": {
        text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
        context:
          "Paul's famous definition of love in the 'Love Chapter.' This describes agape love - unconditional, sacrificial love that mirrors God's love for us.",
      },

      // 2 Corinthians
      "2 corinthians 12:9": {
        text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.",
        context:
          "God's response to Paul's thorn in the flesh. Divine strength is most evident when human strength fails. The Greek 'dunamis' (power) is the root of 'dynamite' - explosive power.",
      },

      // James
      "james 1:5": {
        text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
        context:
          "God's promise to provide wisdom to those who ask. The Greek 'sophia' (wisdom) is practical wisdom for living, not just knowledge. God gives without reproach or hesitation.",
      },

      // 1 Peter
      "1 peter 5:7": {
        text: "Cast all your anxiety on him because he cares for you.",
        context:
          "Peter's encouragement to release our worries to God. The Greek 'merimna' (anxiety) refers to the mental distraction that comes from worry. God genuinely cares about our concerns.",
      },

      // Hebrews
      "hebrews 11:1": {
        text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
        context:
          "The biblical definition of faith. The Greek word 'pistis' implies trust, confidence, and conviction. Faith is not blind belief but confident trust based on God's character and promises.",
      },
    }

    const results: AISearchResult[] = []
    const queryNormalized = query.toLowerCase().trim().replace(/\s+/g, " ")

    // Check for direct matches with multiple variations
    for (const [reference, verseData] of Object.entries(exactVerses)) {
      const refNormalized = reference.replace(/\s+/g, " ")
      const refNoSpaces = reference.replace(/\s+/g, "")
      const queryNoSpaces = queryNormalized.replace(/\s+/g, "")

      if (
        queryNormalized.includes(refNormalized) ||
        refNormalized.includes(queryNormalized) ||
        queryNoSpaces.includes(refNoSpaces) ||
        refNoSpaces.includes(queryNoSpaces)
      ) {
        results.push({
          reference: this.formatReference(reference),
          text: verseData.text,
          relevanceScore: 1.0,
          context: verseData.context,
        })
        console.log(`Found exact match: ${reference}`)
      }
    }

    // Also check for partial matches (e.g., "john 3" should find "john 3:16")
    if (results.length === 0) {
      for (const [reference, verseData] of Object.entries(exactVerses)) {
        const refParts = reference.split(":")[0] // Get "john 3" from "john 3:16"
        if (queryNormalized.includes(refParts) || refParts.includes(queryNormalized)) {
          results.push({
            reference: this.formatReference(reference),
            text: verseData.text,
            relevanceScore: 0.9,
            context: verseData.context,
          })
          console.log(`Found partial match: ${reference}`)
        }
      }
    }

    return results
  }

  private formatReference(reference: string): string {
    // Convert "john 3:16" to "John 3:16"
    const parts = reference.split(" ")
    if (parts.length >= 2) {
      const book = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
      const chapterVerse = parts.slice(1).join(" ")
      return `${book} ${chapterVerse}`
    }
    return reference.charAt(0).toUpperCase() + reference.slice(1)
  }

  private getBibleDatabase() {
    return {
      themes: {
        love: [
          {
            reference: "1 John 4:8",
            text: "Whoever does not love does not know God, because God is love.",
            context:
              "John declares that love is not just an attribute of God, but His very essence. This means that to know God is to experience and express love.",
          },
          {
            reference: "Romans 8:38-39",
            text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
            context:
              "Paul's triumphant declaration of the unbreakable nature of God's love. No force in the universe can sever the love relationship between God and His children.",
          },
          {
            reference: "1 Corinthians 13:13",
            text: "And now these three remain: faith, hope and love. But the greatest of these is love.",
            context:
              "Paul concludes his famous 'love chapter' by emphasizing that love surpasses even faith and hope in importance and permanence.",
          },
          {
            reference: "John 15:13",
            text: "Greater love has no one than this: to lay down one's life for one's friends.",
            context:
              "Jesus defines the ultimate expression of love as self-sacrifice, foreshadowing His own sacrificial death on the cross.",
          },
        ],
        faith: [
          {
            reference: "Romans 10:17",
            text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
            context:
              "Faith is not self-generated but comes through hearing God's Word. The Greek 'rhema' suggests not just reading but receiving a personal word from God.",
          },
          {
            reference: "Mark 9:23",
            text: "Everything is possible for one who believes.",
            context:
              "Jesus' response to a desperate father. This doesn't mean faith is a magic formula, but that God's power is unlimited when we trust Him completely.",
          },
          {
            reference: "Hebrews 11:6",
            text: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.",
            context:
              "Faith is essential in our relationship with God. It involves both believing in His existence and trusting in His good character.",
          },
          {
            reference: "James 2:26",
            text: "As the body without the spirit is dead, so faith without deeds is dead.",
            context: "James emphasizes that genuine faith always produces action. True belief transforms behavior.",
          },
        ],
        hope: [
          {
            reference: "Romans 15:13",
            text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
            context:
              "Paul's benediction emphasizing that hope is not wishful thinking but confident expectation based on God's character, empowered by the Holy Spirit.",
          },
          {
            reference: "Hebrews 6:19",
            text: "We have this hope as an anchor for the soul, firm and secure.",
            context:
              "Biblical hope is compared to an anchor that keeps us stable amid life's storms. It's not uncertain wishing but confident expectation.",
          },
          {
            reference: "1 Peter 1:3",
            text: "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.",
            context:
              "Christian hope is 'living' because it's based on the resurrection of Jesus. His victory over death gives us confidence in God's promises.",
          },
        ],
        peace: [
          {
            reference: "John 14:27",
            text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
            context:
              "Jesus' farewell gift to His disciples. The Greek 'eirene' and Hebrew 'shalom' mean more than absence of conflict - it's wholeness, harmony, and well-being.",
          },
          {
            reference: "Isaiah 26:3",
            text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
            context:
              "The Hebrew literally says 'shalom shalom' (peace peace), emphasizing complete or perfect peace that comes from focusing our minds on God.",
          },
          {
            reference: "Colossians 3:15",
            text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
            context:
              "The word 'rule' means to act as an umpire or referee. God's peace should be the deciding factor in our decisions and relationships.",
          },
        ],
        strength: [
          {
            reference: "Psalm 46:1",
            text: "God is our refuge and strength, an ever-present help in trouble.",
            context:
              "A declaration of God's reliability in times of crisis. The Hebrew 'maoz' (refuge) suggests a fortress or stronghold - God is our ultimate security.",
          },
          {
            reference: "Isaiah 40:29",
            text: "He gives strength to the weary and increases the power of the weak.",
            context:
              "God specializes in strengthening those who have reached the end of their own resources. His power is most evident in our weakness.",
          },
          {
            reference: "Nehemiah 8:10",
            text: "Do not grieve, for the joy of the Lord is your strength.",
            context:
              "Joy that comes from relationship with God provides strength that goes beyond physical or emotional energy - it's spiritual empowerment.",
          },
        ],
        wisdom: [
          {
            reference: "Proverbs 9:10",
            text: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
            context:
              "The Hebrew 'yirah' (fear) means reverent awe, not terror. True wisdom starts with proper respect for God's character, authority, and holiness.",
          },
          {
            reference: "James 3:17",
            text: "But the wisdom that comes from heaven is first of all pure; then peace-loving, considerate, submissive, full of mercy and good fruit, impartial and sincere.",
            context:
              "James contrasts earthly wisdom with godly wisdom, which is characterized by moral purity and relational health.",
          },
          {
            reference: "Proverbs 3:7",
            text: "Do not be wise in your own eyes; fear the Lord and shun evil.",
            context:
              "True wisdom involves humility - recognizing our limitations and dependence on God. Self-sufficiency is the enemy of wisdom.",
          },
        ],
        forgiveness: [
          {
            reference: "Ephesians 4:32",
            text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
            context:
              "The motivation for forgiveness is God's forgiveness of us. The Greek 'charizomai' (forgive) is related to 'charis' (grace) - we extend grace because we've received it.",
          },
          {
            reference: "Matthew 6:14-15",
            text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
            context:
              "Jesus establishes a direct connection between receiving God's forgiveness and extending forgiveness to others. Unforgiveness blocks our experience of God's forgiveness.",
          },
          {
            reference: "Colossians 3:13",
            text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
            context:
              "The standard for our forgiveness is Christ's forgiveness of us - complete, sacrificial, and undeserved. We're called to the same radical forgiveness.",
          },
          {
            reference: "Luke 23:34",
            text: "Jesus said, 'Father, forgive them, for they do not know what they are doing.'",
            context:
              "Even while being crucified, Jesus exemplified forgiveness. His example shows that forgiveness is possible even in the face of extreme injustice.",
          },
        ],
        salvation: [
          {
            reference: "Acts 4:12",
            text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.",
            context:
              "Peter's bold declaration of Christ's exclusivity for salvation. In a pluralistic world, this remains Christianity's distinctive claim - Jesus is the only way to God.",
          },
          {
            reference: "Romans 6:23",
            text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.",
            context:
              "Paul contrasts what we earn through sin (death) with what God gives freely (eternal life). Salvation is not earned but received as a gift.",
          },
          {
            reference: "Titus 3:5",
            text: "He saved us, not because of righteous things we had done, but because of his mercy.",
            context:
              "Salvation is based entirely on God's mercy, not our moral achievements. This eliminates both pride and despair.",
          },
        ],
        prayer: [
          {
            reference: "1 Thessalonians 5:17",
            text: "Pray continually.",
            context:
              "Paul's call for constant prayer doesn't mean non-stop talking but maintaining an attitude of dependence on and communication with God throughout daily life.",
          },
          {
            reference: "Philippians 4:6",
            text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
            context:
              "Prayer is the biblical alternative to anxiety. The antidote to worry is bringing our concerns to God with gratitude.",
          },
          {
            reference: "James 5:16",
            text: "The prayer of a righteous person is powerful and effective.",
            context:
              "Prayer has real power to change situations. The effectiveness of prayer is connected to the righteous character of the one praying.",
          },
        ],
        anxiety: [
          {
            reference: "Philippians 4:6-7",
            text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
            context:
              "Paul's prescription for anxiety. Prayer with thanksgiving transforms our perspective, and God's supernatural peace guards our hearts and minds like a military garrison.",
          },
          {
            reference: "1 Peter 5:7",
            text: "Cast all your anxiety on him because he cares for you.",
            context:
              "Peter's encouragement to release our worries to God. The Greek 'merimna' (anxiety) refers to the mental distraction that comes from worry. God genuinely cares about our concerns.",
          },
          {
            reference: "Matthew 6:25-26",
            text: "Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes? Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
            context:
              "Jesus addresses worry by reminding us of God's care for creation and our value to Him. If God cares for birds, how much more does He care for us?",
          },
          {
            reference: "Isaiah 41:10",
            text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
            context:
              "God's promise of presence and strength in times of fear. The 'righteous right hand' represents God's power and justice working on our behalf.",
          },
        ],
        guidance: [
          {
            reference: "Proverbs 3:5-6",
            text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            context:
              "The foundation of biblical wisdom - trusting God over human reasoning. The Hebrew 'yashar' (straight) means God will make our paths level and clear when we acknowledge Him.",
          },
          {
            reference: "Psalm 32:8",
            text: "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.",
            context:
              "God's promise of personal guidance. The image of His 'loving eye' suggests both careful attention and affection.",
          },
          {
            reference: "James 1:5",
            text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
            context:
              "God's promise to provide wisdom to those who ask. The Greek 'sophia' (wisdom) is practical wisdom for living, not just knowledge. God gives without reproach or hesitation.",
          },
          {
            reference: "Psalm 119:105",
            text: "Your word is a lamp for my feet, a light for my path.",
            context:
              "From the longest chapter in the Bible, celebrating God's Word. In ancient times, a small lamp provided just enough light for the next step - God's Word guides us step by step.",
          },
        ],
        comfort: [
          {
            reference: "2 Corinthians 1:3-4",
            text: "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those who are in any trouble with the comfort we ourselves receive from God.",
            context:
              "God's comfort has a purpose beyond our personal relief - it equips us to comfort others. Our suffering can become ministry when we share how God comforted us.",
          },
          {
            reference: "Psalm 23:4",
            text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
            context:
              "David finds comfort not in the absence of danger but in the presence of God. The shepherd's rod (for protection) and staff (for guidance) represent God's care.",
          },
          {
            reference: "Matthew 5:4",
            text: "Blessed are those who mourn, for they will be comforted.",
            context:
              "Jesus' counterintuitive teaching that mourning can lead to blessing. God's comfort meets us in our deepest grief.",
          },
          {
            reference: "Isaiah 66:13",
            text: "As a mother comforts her child, so will I comfort you.",
            context:
              "God's comfort is compared to a mother's tender care - intimate, nurturing, and responsive to our needs.",
          },
        ],
        healing: [
          {
            reference: "Psalm 147:3",
            text: "He heals the brokenhearted and binds up their wounds.",
            context:
              "God's healing extends beyond physical ailments to emotional and spiritual brokenness. The image of binding wounds suggests careful, personal attention.",
          },
          {
            reference: "Jeremiah 17:14",
            text: "Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.",
            context:
              "Jeremiah's prayer acknowledges that true healing comes only from God. When God heals, the healing is complete.",
          },
          {
            reference: "James 5:14-15",
            text: "Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord. And the prayer offered in faith will make the sick person well; the Lord will raise them up.",
            context:
              "James provides practical instructions for seeking healing through prayer and the support of the church community.",
          },
          {
            reference: "Exodus 15:26",
            text: "For I am the Lord, who heals you.",
            context:
              "God reveals Himself as Jehovah-Rapha, 'the Lord who heals.' Healing is part of God's character and covenant relationship with His people.",
          },
        ],
        purpose: [
          {
            reference: "Jeremiah 29:11",
            text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
            context:
              "God's promise to the exiled Israelites, applicable to all believers. The Hebrew 'shalom' (prosper) means wholeness and peace, not just material success. God's plans are always for our ultimate good.",
          },
          {
            reference: "Romans 8:28",
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
            context:
              "Paul's assurance that God sovereignly works all circumstances for the ultimate good of believers. The 'good' refers to conformity to Christ's image (v.29), not necessarily earthly comfort.",
          },
          {
            reference: "Ephesians 2:10",
            text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
            context:
              "The Greek word 'poiema' (handiwork) is where we get 'poem' - we are God's masterpiece, created with purpose and design.",
          },
          {
            reference: "Proverbs 19:21",
            text: "Many are the plans in a person's heart, but it is the Lord's purpose that prevails.",
            context:
              "Human plans are subordinate to God's sovereign purposes. This brings both humility and confidence - our plans may fail, but God's purposes never will.",
          },
        ],
      },
      books: {
        john: [
          {
            reference: "John 1:14",
            text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
            context:
              "The incarnation - God becoming human. The Greek 'skenoo' (dwelling) means 'to tabernacle' - God pitched His tent among us.",
          },
          {
            reference: "John 10:10",
            text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.",
            context:
              "Jesus contrasts His mission with the enemy's. The abundant life Jesus offers is not just eternal life after death but a rich, meaningful life now.",
          },
          {
            reference: "John 11:25-26",
            text: "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die; and whoever lives by believing in me will never die. Do you believe this?'",
            context:
              "Jesus' fifth 'I am' statement, made to Martha before raising Lazarus. He claims not just to give resurrection but to be resurrection itself.",
          },
        ],
        psalms: [
          {
            reference: "Psalm 1:1-2",
            text: "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the Lord, and who meditates on his law day and night.",
            context:
              "The opening of the Psalter, contrasting the righteous and wicked. True blessing comes from delighting in and meditating on God's Word.",
          },
          {
            reference: "Psalm 19:1",
            text: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
            context:
              "David's celebration of general revelation - how creation itself testifies to God's existence and attributes.",
          },
          {
            reference: "Psalm 51:10",
            text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.",
            context:
              "David's prayer after his sin with Bathsheba. He recognizes that true repentance requires divine heart surgery, not just behavior modification.",
          },
        ],
        romans: [
          {
            reference: "Romans 5:8",
            text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
            context:
              "God's love is proven by its timing and recipients. Christ died for us when we were enemies, not after we became worthy.",
          },
          {
            reference: "Romans 8:1",
            text: "Therefore, there is now no condemnation for those who are in Christ Jesus.",
            context:
              "Paul's triumphant declaration of the believer's freedom from condemnation. The legal verdict has been rendered once for all - not guilty!",
          },
          {
            reference: "Romans 12:1-2",
            text: "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship. Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
            context:
              "Paul transitions from doctrine to application. True worship is not just singing but surrendering our entire lives to God. Mind renewal leads to discernment of God's will.",
          },
        ],
        matthew: [
          {
            reference: "Matthew 5:16",
            text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
            context:
              "Jesus calls His followers to visible faith that points others to God. Good works should not be done for self-promotion but for God's glory.",
          },
          {
            reference: "Matthew 11:28-30",
            text: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
            context:
              "Jesus' invitation to the exhausted and overwhelmed. The 'yoke' was a rabbi's teaching and interpretation of Scripture. Jesus offers a relationship that refreshes rather than burdens.",
          },
        ],
        isaiah: [
          {
            reference: "Isaiah 53:5",
            text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
            context:
              "Isaiah's prophecy of the suffering Messiah, written 700 years before Christ. This verse describes substitutionary atonement - Christ taking our punishment.",
          },
          {
            reference: "Isaiah 55:8-9",
            text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.",
            context:
              "God's reminder of the vast difference between divine and human perspective. This should produce both humility and trust when we don't understand God's actions.",
          },
        ],
      },
    }
  }

  private extractSearchTerms(query: string): string[] {
    const stopWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "about",
      "what",
      "does",
      "bible",
      "say",
      "verse",
      "verses",
      "scripture",
      "says",
    ]
    const words = query.toLowerCase().split(/\s+/)
    return words.filter((word) => word.length > 2 && !stopWords.includes(word))
  }

  private searchByKeywords(query: string, database: any): AISearchResult[] {
    const results: AISearchResult[] = []
    const keywords = this.extractSearchTerms(query)

    const allVerses = [
      ...Object.values(database.themes).flat(),
      ...Object.values(database.books).flat(),
    ] as AISearchResult[]

    for (const verse of allVerses) {
      const verseText = verse.text.toLowerCase()
      const verseContext = verse.context?.toLowerCase() || ""

      for (const keyword of keywords) {
        if (verseText.includes(keyword) || verseContext.includes(keyword)) {
          results.push(verse)
          break
        }
      }
    }

    return results
  }

  private removeDuplicateVerses(verses: AISearchResult[]): AISearchResult[] {
    const seen = new Set<string>()
    return verses.filter((verse) => {
      if (seen.has(verse.reference)) {
        return false
      }
      seen.add(verse.reference)
      return true
    })
  }

  private getIntelligentSearchResults(query: string): AISearchResult[] {
    return this.getComprehensiveBibleSearch(query)
  }

  async getLifeGuidance(situation: string): Promise<LifeGuidanceResult> {
    console.log(`=== AI Service: Life guidance request ===`)
    console.log(`Situation: "${situation}"`)
    console.log(`Is server: ${isServer}`)
    console.log(`Deep Infra configured: ${this.isConfigured}`)

    // Try OpenAI first
    try {
      console.log("Trying OpenAI for guidance...")
      const openaiGuidance = await openaiService.getLifeGuidance(situation)
      if (openaiGuidance && openaiGuidance.guidance) {
        console.log("OpenAI guidance successful")
        return openaiGuidance
      }
      console.log("OpenAI guidance failed or returned empty result")
    } catch (error) {
      console.log("OpenAI guidance failed, trying Deep Infra:", error)
    }

    // Try Deep Infra as fallback
    if (this.isConfigured) {
      try {
        console.log("Trying Deep Infra for guidance...")
        const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            input: `You are a wise, compassionate Christian counselor. Provide biblical guidance for this situation: "${situation}"

Respond in this JSON format:
{
  "guidance": "Thoughtful biblical guidance (2-3 paragraphs)",
  "relevantVerses": [
    {
      "reference": "Book Chapter:Verse",
      "text": "Complete verse text",
      "relevanceScore": 0.95,
      "context": "How this verse applies to their situation"
    }
  ],
  "practicalSteps": [
    "Specific actionable step",
    "Another practical step"
  ],
  "prayerSuggestion": "A personalized prayer for their situation"
}`,
            max_new_tokens: 1000,
            temperature: 0.3,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.results?.[0]?.generated_text

          if (aiResponse) {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                const result = JSON.parse(jsonMatch[0])
                console.log("Deep Infra guidance successful")
                return {
                  guidance: result.guidance,
                  relevantVerses: result.relevantVerses || [],
                  practicalSteps: result.practicalSteps || [],
                  prayerSuggestion: result.prayerSuggestion,
                }
              } catch (parseError) {
                console.error("Error parsing Deep Infra guidance response:", parseError)
              }
            }
          }
        } else {
          console.error("Deep Infra API error:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error in Deep Infra guidance:", error)
      }
    }

    // Fallback to intelligent guidance
    console.log("Using intelligent fallback guidance")
    return this.getIntelligentGuidance(situation)
  }

  private getIntelligentGuidance(situation: string): LifeGuidanceResult {
    const situationLower = situation.toLowerCase()

    let guidance = ""
    let relevantVerses: AISearchResult[] = []
    let practicalSteps: string[] = []
    let prayerSuggestion = ""

    if (situationLower.includes("anxiety") || situationLower.includes("worry") || situationLower.includes("fear")) {
      guidance = `Anxiety is a common human experience, and God understands your fears. The Bible offers profound comfort for anxious hearts. In Philippians 4:6-7, Paul gives us a practical prescription: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."

Notice the process: prayer + specific requests + thanksgiving = supernatural peace. God doesn't want you to carry these burdens alone. When we bring our anxieties to Him with grateful hearts, He promises a peace that doesn't make logical sense - it transcends understanding.

Remember that even Jesus experienced deep distress in the Garden of Gethsemane. Feeling anxious doesn't mean you lack faith; it means you're human. What matters is what you do with your anxiety - bring it to the One who cares for you.`

      relevantVerses = this.getComprehensiveBibleSearch("anxiety fear worry").slice(0, 3)
      practicalSteps = [
        "Start each day with 5 minutes of prayer, bringing your specific worries to God",
        "Practice the 'Philippians 4:6-7 method': prayer + thanksgiving = peace",
        "Write down your anxious thoughts and pray over each one",
        "When anxiety hits, recite Isaiah 41:10 aloud and breathe deeply",
      ]
      prayerSuggestion =
        "Lord Jesus, You know the anxieties weighing on my heart. I bring each worry to You, trusting in Your perfect love that casts out fear. Replace my anxiety with Your supernatural peace. Help me remember Your faithfulness and trust You with my future. Amen."
    } else if (
      situationLower.includes("forgiv") ||
      situationLower.includes("hurt") ||
      situationLower.includes("anger")
    ) {
      guidance = `Forgiveness is one of the most challenging yet transformative aspects of following Christ. When someone has hurt us deeply, our natural response is often anger or resentment. These feelings are normal and valid - even Jesus felt righteous anger.

However, God calls us to a higher standard: to forgive as we have been forgiven (Ephesians 4:32). This doesn't mean excusing the wrong or pretending it didn't happen. Forgiveness means releasing the burden of resentment and choosing to trust God with justice.

The beautiful truth is that forgiveness is more for us than for the person who hurt us. Bitterness is like drinking poison and expecting the other person to get sick. When we forgive, we're choosing freedom over bondage, peace over turmoil.`

      relevantVerses = this.getComprehensiveBibleSearch("forgiveness").slice(0, 3)
      practicalSteps = [
        "Pray for the person who hurt you, even if it feels impossible at first",
        "Write a letter expressing your feelings (you don't have to send it)",
        "Focus on God's forgiveness of you when you struggle to forgive others",
        "Set healthy boundaries while still choosing to forgive",
      ]
      prayerSuggestion =
        "Heavenly Father, forgiveness feels so difficult right now. You know the pain I'm carrying. Please help me to forgive as You have forgiven me. Heal my heart and fill the hurt places with Your love and peace. In Jesus' name, Amen."
    } else if (
      situationLower.includes("decision") ||
      situationLower.includes("choice") ||
      situationLower.includes("guidance")
    ) {
      guidance = `Making important decisions can feel overwhelming, especially when the stakes are high. But what a blessing that you're seeking God's guidance! This shows a heart that wants to honor Him.

God promises in James 1:5: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you." Notice that God gives wisdom "generously" and "without finding fault" - He's not reluctant when we ask for help.

Seeking God's will often involves multiple channels: prayer, Scripture, wise counsel, circumstances, and the peace of God in your heart. Trust in the Lord with all your heart, and He will direct your paths.`

      relevantVerses = this.getComprehensiveBibleSearch("wisdom guidance").slice(0, 3)
      practicalSteps = [
        "Spend extended time in prayer asking specifically for God's wisdom",
        "Study relevant Bible passages that relate to your decision",
        "Seek counsel from 2-3 mature Christians you trust",
        "Pay attention to the peace you feel about each option",
      ]
      prayerSuggestion =
        "Lord, I need Your wisdom for this decision. You promise to give wisdom generously, so I'm asking for Your clear guidance. Help me see from Your perspective and give me courage to follow Your will. Amen."
    } else {
      guidance = `Thank you for sharing what's on your heart. Whatever you're facing, please know that you're not alone. God sees your situation and cares deeply about what concerns you.

The Bible reminds us in 1 Peter 5:7 to "cast all your anxiety on him because he cares for you." Life's challenges can feel overwhelming, but they're also opportunities for growth and deeper faith.

God often uses difficult seasons to develop our character, strengthen our trust in Him, and prepare us to help others who face similar struggles.`

      relevantVerses = this.getComprehensiveBibleSearch("hope strength faith").slice(0, 2)
      practicalSteps = [
        "Spend time in prayer, honestly sharing your heart with God",
        "Read and meditate on Scripture that speaks to your situation",
        "Seek wise counsel from trusted Christian friends",
        "Take one small step forward while trusting God with the outcome",
      ]
      prayerSuggestion =
        "Dear Heavenly Father, thank You for caring about every detail of my life. I bring this situation to You, knowing You understand completely. Please grant me wisdom, peace, and strength. Guide my steps and help me grow through this experience. In Jesus' name, Amen."
    }

    return {
      guidance,
      relevantVerses,
      practicalSteps,
      prayerSuggestion,
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
