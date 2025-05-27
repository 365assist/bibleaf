import { env } from "./env"

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

export class AIService {
  private apiKey: string
  private baseUrl = "https://api.deepinfra.com/v1/inference"
  private isConfigured: boolean

  constructor() {
    this.apiKey = env.DEEPINFRA_API_KEY
    this.isConfigured = !!this.apiKey

    if (!this.isConfigured) {
      console.warn("Deep Infra API key not configured. Using fallback responses.")
    }
  }

  async searchBible(query: string): Promise<AISearchResult[]> {
    // Always return fallback for now to test the UI
    console.log(`Bible search query: "${query}"`)

    if (!this.isConfigured) {
      console.log("Using fallback search results")
      return this.getFallbackSearchResults(query)
    }

    try {
      const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          input: `You are a biblical scholar. Find relevant Bible verses for: "${query}"

Return exactly 3-5 verses in this JSON format:
[
  {
    "reference": "Book Chapter:Verse",
    "text": "The actual verse text",
    "relevanceScore": 0.95,
    "context": "Why this verse is relevant"
  }
]`,
          max_new_tokens: 800,
          temperature: 0.3,
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
              relevanceScore: result.relevanceScore || 0.8,
              context: result.context,
            }))
          } catch (parseError) {
            console.error("Error parsing AI response:", parseError)
          }
        }
      }

      return this.getFallbackSearchResults(query)
    } catch (error) {
      console.error("Error in AI Bible search:", error)
      return this.getFallbackSearchResults(query)
    }
  }

  async getLifeGuidance(situation: string): Promise<LifeGuidanceResult> {
    console.log(`Life guidance request: "${situation}"`)

    if (!this.isConfigured) {
      console.log("Using fallback guidance")
      return this.getFallbackGuidance(situation)
    }

    try {
      const response = await fetch(`${this.baseUrl}/meta-llama/Llama-2-70b-chat-hf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          input: `You are a wise Christian counselor. Someone is facing: "${situation}"

Provide guidance in this JSON format:
{
  "guidance": "Compassionate biblical guidance (2-3 paragraphs)",
  "relevantVerses": [
    {
      "reference": "Book Chapter:Verse",
      "text": "Exact verse text",
      "relevanceScore": 0.95,
      "context": "How this applies"
    }
  ],
  "practicalSteps": [
    "Specific actionable step",
    "Another practical step"
  ],
  "prayerSuggestion": "A heartfelt prayer"
}`,
          max_new_tokens: 1000,
          temperature: 0.4,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.results?.[0]?.generated_text

      if (aiResponse) {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const result = JSON.parse(jsonMatch[0])
            return {
              guidance: result.guidance,
              relevantVerses: result.relevantVerses || [],
              practicalSteps: result.practicalSteps || [],
              prayerSuggestion: result.prayerSuggestion,
            }
          } catch (parseError) {
            console.error("Error parsing AI guidance response:", parseError)
          }
        }
      }

      return this.getFallbackGuidance(situation)
    } catch (error) {
      console.error("Error in AI life guidance:", error)
      return this.getFallbackGuidance(situation)
    }
  }

  async getDailyVerse(userPreferences?: string[]): Promise<AISearchResult> {
    const verses = [
      {
        reference: "Psalm 118:24",
        text: "This is the day the Lord has made; let us rejoice and be glad in it.",
        context: "A reminder to find joy and gratitude in each new day",
      },
      {
        reference: "Lamentations 3:22-23",
        text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
        context: "God's mercy and faithfulness renewed each morning",
      },
      {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
        context: "Strength and capability through Christ",
      },
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        context: "God's good plans and hope for the future",
      },
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        context: "Renewed strength through hope in God",
      },
    ]

    const randomVerse = verses[Math.floor(Math.random() * verses.length)]
    return {
      reference: randomVerse.reference,
      text: randomVerse.text,
      relevanceScore: 1.0,
      context: randomVerse.context,
    }
  }

  private getFallbackSearchResults(query: string): AISearchResult[] {
    const queryLower = query.toLowerCase()

    if (queryLower.includes("fear") || queryLower.includes("afraid") || queryLower.includes("anxiety")) {
      return [
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          relevanceScore: 0.95,
          context: "God's promise of presence and strength in times of fear",
        },
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          relevanceScore: 0.92,
          context: "Comfort and protection in difficult times",
        },
        {
          reference: "Philippians 4:6-7",
          text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          relevanceScore: 0.9,
          context: "How to find peace through prayer instead of anxiety",
        },
      ]
    }

    if (queryLower.includes("love")) {
      return [
        {
          reference: "1 Corinthians 13:4-5",
          text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
          relevanceScore: 0.98,
          context: "The definition and characteristics of true love",
        },
        {
          reference: "1 John 4:19",
          text: "We love because he first loved us.",
          relevanceScore: 0.94,
          context: "The source of our ability to love others",
        },
      ]
    }

    if (queryLower.includes("forgiv")) {
      return [
        {
          reference: "Ephesians 4:32",
          text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          relevanceScore: 0.96,
          context: "The call to forgive others as God has forgiven us",
        },
        {
          reference: "Matthew 6:14-15",
          text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
          relevanceScore: 0.93,
          context: "The importance of forgiveness in our relationship with God",
        },
      ]
    }

    // Default hope verses
    return [
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        relevanceScore: 0.96,
        context: "God's good plans and hope for the future",
      },
      {
        reference: "Romans 15:13",
        text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        relevanceScore: 0.92,
        context: "God as the source of hope, joy, and peace",
      },
    ]
  }

  private getFallbackGuidance(situation: string): LifeGuidanceResult {
    return {
      guidance: `Thank you for sharing what you're going through. Life's challenges can feel overwhelming, but remember that you're not alone in this journey. God sees your situation and cares deeply about what you're experiencing.

The Bible reminds us that God works all things together for good for those who love Him (Romans 8:28). Even in difficult times, He is present with you, offering strength, wisdom, and peace. Take time to bring your concerns to Him in prayer, and trust that He will guide your steps.

Consider seeking wise counsel from trusted friends, family, or spiritual mentors who can offer support and perspective. Remember that growth often comes through challenges, and God can use this experience to develop your character and deepen your faith.`,
      relevantVerses: [
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          relevanceScore: 0.9,
          context: "God's promise to work everything for good",
        },
        {
          reference: "Psalm 46:1",
          text: "God is our refuge and strength, an ever-present help in trouble.",
          relevanceScore: 0.88,
          context: "God as our source of strength in difficult times",
        },
        {
          reference: "Proverbs 3:5-6",
          text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          relevanceScore: 0.85,
          context: "Trusting God's guidance over our own understanding",
        },
      ],
      practicalSteps: [
        "Spend time in prayer, honestly sharing your feelings and concerns with God",
        "Read and meditate on relevant Bible passages for comfort and guidance",
        "Seek wise counsel from trusted Christian friends, family, or mentors",
        "Take practical steps while trusting God with the outcome",
        "Practice gratitude by focusing on God's blessings in your life",
      ],
      prayerSuggestion:
        "Dear Heavenly Father, I bring this situation to You, knowing that You care about every detail of my life. Please grant me wisdom, peace, and strength to navigate this challenge. Help me to trust in Your perfect timing and plan. Guide my steps and help me to grow through this experience. In Jesus' name, Amen.",
    }
  }
}

export const aiService = new AIService()
