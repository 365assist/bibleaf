import OpenAI from "openai"
import { serverEnv, isServer } from "./env"

// AI service using OpenAI
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

export class OpenAIService {
  private openai: OpenAI | null = null
  private isConfigured: boolean

  constructor() {
    // Only initialize on the server
    if (isServer) {
      const apiKey = serverEnv.OPENAI_API_KEY
      this.isConfigured = !!apiKey

      if (this.isConfigured) {
        this.openai = new OpenAI({
          apiKey: apiKey,
        })
        console.log("OpenAI service initialized successfully")
      } else {
        console.warn("OpenAI API key not configured")
      }
    } else {
      this.isConfigured = false
    }
  }

  async searchBible(query: string): Promise<AISearchResult[]> {
    if (!isServer || !this.isConfigured || !this.openai) {
      console.log("OpenAI not available, using fallback")
      return this.getFallbackSearchResults(query)
    }

    try {
      console.log(`OpenAI Bible search query: "${query}"`)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are a biblical scholar and theologian. Your task is to find relevant Bible verses for user queries.

Return your response as a JSON array with exactly 3-5 verses in this format:
[
  {
    "reference": "Book Chapter:Verse",
    "text": "The exact verse text from a standard Bible translation",
    "relevanceScore": 0.95,
    "context": "Brief explanation of why this verse is relevant to the query"
  }
]

Use accurate Bible references and verse text. Focus on verses that directly address the user's query.`,
          },
          {
            role: "user",
            content: `Find relevant Bible verses for: "${query}"`,
          },
        ],
      })

      const response = completion.choices[0]?.message?.content
      if (response) {
        try {
          const results = JSON.parse(response)
          if (Array.isArray(results)) {
            console.log("OpenAI search successful, returning results")
            return results.map((result: any) => ({
              reference: result.reference || "Unknown",
              text: result.text || "",
              relevanceScore: result.relevanceScore || 0.8,
              context: result.context || "",
            }))
          }
        } catch (parseError) {
          console.error("Error parsing OpenAI response:", parseError)
        }
      }

      return this.getFallbackSearchResults(query)
    } catch (error) {
      console.error("OpenAI API error:", error)
      return this.getFallbackSearchResults(query)
    }
  }

  async getLifeGuidance(situation: string): Promise<LifeGuidanceResult> {
    if (!isServer || !this.isConfigured || !this.openai) {
      console.log("OpenAI not available, using fallback guidance")
      return this.getFallbackGuidance(situation)
    }

    try {
      console.log(`OpenAI life guidance request: "${situation}"`)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: `You are a wise Christian counselor and pastor. Provide compassionate, biblical guidance for people facing life challenges.

Return your response as JSON in this exact format:
{
  "guidance": "2-3 paragraphs of compassionate biblical guidance",
  "relevantVerses": [
    {
      "reference": "Book Chapter:Verse",
      "text": "Exact verse text",
      "relevanceScore": 0.95,
      "context": "How this verse applies to their situation"
    }
  ],
  "practicalSteps": [
    "Specific actionable step",
    "Another practical step"
  ],
  "prayerSuggestion": "A heartfelt prayer for their situation"
}

Be compassionate, biblically sound, and practical. Include 2-3 relevant Bible verses.`,
          },
          {
            role: "user",
            content: `Someone is facing this situation: "${situation}". Please provide biblical guidance and support.`,
          },
        ],
      })

      const response = completion.choices[0]?.message?.content
      if (response) {
        try {
          const result = JSON.parse(response)
          console.log("OpenAI guidance successful")
          return {
            guidance: result.guidance || "",
            relevantVerses: result.relevantVerses || [],
            practicalSteps: result.practicalSteps || [],
            prayerSuggestion: result.prayerSuggestion || "",
          }
        } catch (parseError) {
          console.error("Error parsing OpenAI guidance response:", parseError)
        }
      }

      return this.getFallbackGuidance(situation)
    } catch (error) {
      console.error("OpenAI guidance error:", error)
      return this.getFallbackGuidance(situation)
    }
  }

  async getDailyVerse(userPreferences?: string[]): Promise<AISearchResult> {
    if (!isServer || !this.isConfigured || !this.openai) {
      return this.getFallbackDailyVerse()
    }

    try {
      const preferencesText = userPreferences?.length
        ? ` The user is interested in themes like: ${userPreferences.join(", ")}.`
        : ""

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.6,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `Select an encouraging Bible verse for today. Return as JSON:
{
  "reference": "Book Chapter:Verse",
  "text": "The exact verse text",
  "relevanceScore": 1.0,
  "context": "Why this verse is encouraging for today"
}`,
          },
          {
            role: "user",
            content: `Please select an encouraging Bible verse for today.${preferencesText}`,
          },
        ],
      })

      const response = completion.choices[0]?.message?.content
      if (response) {
        try {
          const result = JSON.parse(response)
          return {
            reference: result.reference || "Psalm 118:24",
            text: result.text || "This is the day the Lord has made; let us rejoice and be glad in it.",
            relevanceScore: 1.0,
            context: result.context || "A reminder to find joy in each new day",
          }
        } catch (parseError) {
          console.error("Error parsing OpenAI daily verse response:", parseError)
        }
      }

      return this.getFallbackDailyVerse()
    } catch (error) {
      console.error("OpenAI daily verse error:", error)
      return this.getFallbackDailyVerse()
    }
  }

  private getFallbackSearchResults(query: string): AISearchResult[] {
    // Simple keyword-based fallback
    const queryLower = query.toLowerCase()

    if (queryLower.includes("love")) {
      return [
        {
          reference: "1 Corinthians 13:4-5",
          text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
          relevanceScore: 0.9,
          context: "The definition of true love",
        },
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          relevanceScore: 0.95,
          context: "God's ultimate expression of love",
        },
      ]
    }

    if (queryLower.includes("fear") || queryLower.includes("anxiety")) {
      return [
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          relevanceScore: 0.95,
          context: "God's promise of presence in times of fear",
        },
        {
          reference: "Philippians 4:6-7",
          text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
          relevanceScore: 0.9,
          context: "How to handle anxiety through prayer",
        },
      ]
    }

    // Default verses for general queries
    return [
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        relevanceScore: 0.8,
        context: "God's good plans for our lives",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        relevanceScore: 0.8,
        context: "God's promise to work everything for good",
      },
    ]
  }

  private getFallbackGuidance(situation: string): LifeGuidanceResult {
    return {
      guidance: `Thank you for sharing what you're going through. Life's challenges can feel overwhelming, but remember that you're not alone in this journey. God sees your situation and cares deeply about what you're experiencing.

The Bible reminds us that God works all things together for good for those who love Him. Even in difficult times, He is present with you, offering strength, wisdom, and peace. Take time to bring your concerns to Him in prayer, and trust that He will guide your steps.

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
          relevanceScore: 0.9,
          context: "God as our source of strength in difficult times",
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

  private getFallbackDailyVerse(): AISearchResult {
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
    ]

    const randomVerse = verses[Math.floor(Math.random() * verses.length)]
    return {
      reference: randomVerse.reference,
      text: randomVerse.text,
      relevanceScore: 1.0,
      context: randomVerse.context,
    }
  }
}

export const openaiService = new OpenAIService()
