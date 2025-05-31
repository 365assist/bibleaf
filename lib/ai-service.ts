import { serverEnv, isServer } from "./env-utils"
import { openaiService } from "./openai-service"

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

  async searchBible(query: string): Promise<AISearchResult[]> {
    // Client-side safety check
    if (!isServer) {
      console.log("Client-side AI search, using intelligent fallback")
      return this.getIntelligentSearchResults(query)
    }

    console.log(`Bible search query: "${query}"`)

    // Try OpenAI first
    try {
      const openaiResults = await openaiService.searchBible(query)
      if (openaiResults && openaiResults.length > 0) {
        console.log("OpenAI search successful")
        return openaiResults
      }
    } catch (error) {
      console.log("OpenAI search failed, trying Deep Infra:", error)
    }

    // Try Deep Infra as fallback
    try {
      if (this.isConfigured) {
        console.log("Attempting API call to Deep Infra")
        const apiResults = await this.callDeepInfraAPI(query)
        if (apiResults && apiResults.length > 0) {
          console.log("Deep Infra API call successful, returning results")
          return apiResults
        }
        console.log("Deep Infra API call failed or returned no results, falling back to intelligent results")
      }
    } catch (error) {
      console.error("Deep Infra API call failed:", error)
    }

    // Always return intelligent fallback results
    console.log("Using intelligent fallback search results")
    const fallbackResults = this.getIntelligentSearchResults(query)
    console.log("Fallback results:", fallbackResults)
    return fallbackResults
  }

  async getLifeGuidance(situation: string): Promise<LifeGuidanceResult> {
    console.log(`Life guidance request: "${situation}"`)

    // Try OpenAI first
    try {
      const openaiGuidance = await openaiService.getLifeGuidance(situation)
      if (openaiGuidance && openaiGuidance.guidance) {
        console.log("OpenAI guidance successful")
        return openaiGuidance
      }
    } catch (error) {
      console.log("OpenAI guidance failed, trying Deep Infra:", error)
    }

    // Try Deep Infra as fallback
    if (this.isConfigured) {
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

        if (response.ok) {
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
                console.error("Error parsing Deep Infra guidance response:", parseError)
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in Deep Infra life guidance:", error)
      }
    }

    // Fallback to intelligent guidance
    return this.getIntelligentGuidance(situation)
  }

  async getDailyVerse(userPreferences?: string[]): Promise<AISearchResult> {
    // Try OpenAI first
    try {
      const openaiVerse = await openaiService.getDailyVerse(userPreferences)
      if (openaiVerse && openaiVerse.text) {
        console.log("OpenAI daily verse successful")
        return openaiVerse
      }
    } catch (error) {
      console.log("OpenAI daily verse failed, using fallback:", error)
    }

    // Skip Deep Infra API call and use fallback verses directly
    // This avoids JSON parsing errors and ensures reliable operation
    return this.getRandomDailyVerse(userPreferences)
  }

  private async callDeepInfraAPI(query: string): Promise<AISearchResult[]> {
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

    return []
  }

  private getRandomDailyVerse(userPreferences?: string[]): AISearchResult {
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
      {
        reference: "Proverbs 3:5-6",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        context: "Trusting God's guidance over our own understanding",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        context: "God's promise to work everything for good",
      },
      {
        reference: "John 3:16",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        context: "The ultimate expression of God's love for humanity",
      },
    ]

    // If we have user preferences, we could filter verses based on those
    // For now, just return a random verse
    const randomVerse = verses[Math.floor(Math.random() * verses.length)]
    return {
      reference: randomVerse.reference,
      text: randomVerse.text,
      relevanceScore: 1.0,
      context: randomVerse.context,
    }
  }

  private getIntelligentSearchResults(query: string): AISearchResult[] {
    const queryLower = query.toLowerCase()

    // Analyze the query for keywords and themes
    const keywords = {
      fear: ["fear", "afraid", "anxiety", "anxious", "worry", "worried", "scared", "terror", "panic"],
      love: ["love", "loving", "beloved", "affection", "compassion", "care", "caring"],
      forgiveness: ["forgiv", "mercy", "pardon", "grace", "redemption"],
      strength: ["strength", "strong", "power", "mighty", "courage", "brave", "endure"],
      peace: ["peace", "calm", "rest", "tranquil", "serenity", "quiet"],
      hope: ["hope", "hopeful", "future", "promise", "trust", "faith"],
      wisdom: ["wisdom", "wise", "understanding", "knowledge", "discernment", "guidance"],
      prayer: ["pray", "prayer", "praying", "petition", "intercession"],
      salvation: ["salvation", "saved", "eternal life", "heaven", "redemption"],
      trials: ["trial", "suffering", "hardship", "difficulty", "trouble", "persecution"],
      joy: ["joy", "joyful", "happiness", "glad", "rejoice", "celebration"],
      faith: ["faith", "believe", "trust", "confidence", "conviction"],
    }

    // Find matching themes
    const matchedThemes = Object.entries(keywords)
      .filter(([theme, words]) => words.some((word) => queryLower.includes(word)))
      .map(([theme]) => theme)

    // If no specific themes found, look for general spiritual topics
    if (matchedThemes.length === 0) {
      if (queryLower.includes("god") || queryLower.includes("lord") || queryLower.includes("jesus")) {
        matchedThemes.push("faith")
      } else if (queryLower.includes("life") || queryLower.includes("living")) {
        matchedThemes.push("wisdom")
      } else {
        matchedThemes.push("hope") // Default to hope
      }
    }

    console.log("Matched themes for query:", matchedThemes)

    // Verse database organized by themes
    const verseDatabase = {
      fear: [
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          context: "God's promise of presence and strength in times of fear",
        },
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          context: "Comfort and protection in difficult times",
        },
        {
          reference: "Philippians 4:6-7",
          text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          context: "How to find peace through prayer instead of anxiety",
        },
        {
          reference: "2 Timothy 1:7",
          text: "For God has not given us a spirit of fear, but of power, love and sound mind.",
          context: "God gives us power, love, and sound judgment instead of fear",
        },
      ],
      love: [
        {
          reference: "1 Corinthians 13:4-5",
          text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
          context: "The definition and characteristics of true love",
        },
        {
          reference: "1 John 4:19",
          text: "We love because he first loved us.",
          context: "The source of our ability to love others",
        },
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          context: "The ultimate expression of God's love for humanity",
        },
        {
          reference: "Romans 8:38-39",
          text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
          context: "Nothing can separate us from God's love",
        },
      ],
      forgiveness: [
        {
          reference: "Ephesians 4:32",
          text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          context: "The call to forgive others as God has forgiven us",
        },
        {
          reference: "Matthew 6:14-15",
          text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
          context: "The importance of forgiveness in our relationship with God",
        },
        {
          reference: "1 John 1:9",
          text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
          context: "God's promise to forgive when we confess our sins",
        },
        {
          reference: "Colossians 3:13",
          text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
          context: "Forgiving others as Christ forgave us",
        },
      ],
      strength: [
        {
          reference: "Philippians 4:13",
          text: "I can do all this through him who gives me strength.",
          context: "Strength and capability through Christ",
        },
        {
          reference: "Isaiah 40:31",
          text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
          context: "Renewed strength through hope in God",
        },
        {
          reference: "2 Corinthians 12:9",
          text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.",
          context: "God's strength is perfected in our weakness",
        },
        {
          reference: "Psalm 46:1",
          text: "God is our refuge and strength, an ever-present help in trouble.",
          context: "God as our source of strength in difficult times",
        },
      ],
      peace: [
        {
          reference: "John 14:27",
          text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
          context: "Jesus' gift of peace that surpasses worldly peace",
        },
        {
          reference: "Philippians 4:7",
          text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          context: "God's peace that guards our hearts and minds",
        },
        {
          reference: "Isaiah 26:3",
          text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
          context: "Perfect peace through trusting in God",
        },
        {
          reference: "Romans 5:1",
          text: "Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ.",
          context: "Peace with God through faith in Christ",
        },
      ],
      hope: [
        {
          reference: "Jeremiah 29:11",
          text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
          context: "God's good plans and hope for the future",
        },
        {
          reference: "Romans 15:13",
          text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
          context: "God as the source of hope, joy, and peace",
        },
        {
          reference: "Psalm 42:11",
          text: "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.",
          context: "Finding hope in God during times of discouragement",
        },
        {
          reference: "Hebrews 11:1",
          text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
          context: "The relationship between faith and hope",
        },
      ],
      wisdom: [
        {
          reference: "Proverbs 3:5-6",
          text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          context: "Trusting God's guidance over our own understanding",
        },
        {
          reference: "James 1:5",
          text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
          context: "God's promise to give wisdom to those who ask",
        },
        {
          reference: "Proverbs 9:10",
          text: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
          context: "True wisdom begins with reverence for God",
        },
        {
          reference: "Ecclesiastes 3:1",
          text: "There is a time for everything, and a season for every activity under the heavens.",
          context: "Understanding God's timing in all things",
        },
      ],
      prayer: [
        {
          reference: "1 Thessalonians 5:17",
          text: "Pray continually.",
          context: "The call to maintain constant communication with God",
        },
        {
          reference: "Matthew 6:9-11",
          text: "This, then, is how you should pray: 'Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven. Give us today our daily bread.'",
          context: "Jesus' model for prayer",
        },
        {
          reference: "Philippians 4:6",
          text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
          context: "Bringing all concerns to God through prayer",
        },
        {
          reference: "James 5:16",
          text: "Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective.",
          context: "The power of prayer and confession",
        },
      ],
      salvation: [
        {
          reference: "Romans 10:9",
          text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.",
          context: "The path to salvation through faith in Jesus",
        },
        {
          reference: "Ephesians 2:8-9",
          text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
          context: "Salvation as a gift of grace, not earned by works",
        },
        {
          reference: "Acts 4:12",
          text: "Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.",
          context: "Jesus as the only way to salvation",
        },
        {
          reference: "2 Corinthians 5:17",
          text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
          context: "The transformation that comes with salvation",
        },
      ],
      trials: [
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          context: "God's promise to work everything for good",
        },
        {
          reference: "James 1:2-3",
          text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.",
          context: "Finding joy in trials because they develop perseverance",
        },
        {
          reference: "1 Peter 5:7",
          text: "Cast all your anxiety on him because he cares for you.",
          context: "God's care for us in times of trouble",
        },
        {
          reference: "2 Corinthians 4:17",
          text: "For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.",
          context: "Eternal perspective on temporary troubles",
        },
      ],
      joy: [
        {
          reference: "Nehemiah 8:10",
          text: "Do not grieve, for the joy of the Lord is your strength.",
          context: "Finding strength through joy in the Lord",
        },
        {
          reference: "Psalm 16:11",
          text: "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",
          context: "Joy found in God's presence",
        },
        {
          reference: "Galatians 5:22",
          text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness.",
          context: "Joy as a fruit of the Spirit",
        },
        {
          reference: "John 15:11",
          text: "I have told you this so that my joy may be in you and that your joy may be complete.",
          context: "Complete joy through Jesus",
        },
      ],
      faith: [
        {
          reference: "Hebrews 11:6",
          text: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.",
          context: "The necessity of faith in our relationship with God",
        },
        {
          reference: "Romans 10:17",
          text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
          context: "How faith develops through hearing God's word",
        },
        {
          reference: "Mark 9:23",
          text: "Everything is possible for one who believes.",
          context: "The power of belief and faith",
        },
        {
          reference: "2 Corinthians 5:7",
          text: "For we live by faith, not by sight.",
          context: "Living by faith rather than what we can see",
        },
      ],
    }

    // Select verses based on matched themes
    let selectedVerses: AISearchResult[] = []

    for (const theme of matchedThemes) {
      const themeVerses = verseDatabase[theme as keyof typeof verseDatabase] || []
      selectedVerses.push(...themeVerses.slice(0, 2)) // Take up to 2 verses per theme
    }

    // If we have too many verses, prioritize by relevance
    if (selectedVerses.length > 4) {
      selectedVerses = selectedVerses.slice(0, 4)
    }

    // If we don't have enough verses, add some general hope verses
    if (selectedVerses.length < 2) {
      selectedVerses.push(...verseDatabase.hope.slice(0, 3))
    }

    // Calculate relevance scores based on keyword matches
    const results = selectedVerses.map((verse, index) => ({
      reference: verse.reference,
      text: verse.text,
      relevanceScore: Math.max(0.95 - index * 0.05, 0.8), // Decreasing relevance
      context: verse.context,
    }))

    console.log("Generated intelligent search results:", results)
    return results
  }

  private getIntelligentGuidance(situation: string): LifeGuidanceResult {
    const situationLower = situation.toLowerCase()

    // Analyze the situation for themes
    let guidance = ""
    let relevantVerses: AISearchResult[] = []
    let practicalSteps: string[] = []
    let prayerSuggestion = ""

    if (situationLower.includes("forgiv") || situationLower.includes("hurt") || situationLower.includes("anger")) {
      guidance = `Forgiveness is one of the most challenging yet transformative aspects of the Christian faith. When someone has hurt us deeply, our natural response is often anger, resentment, or a desire for justice. However, God calls us to a higher standard - to forgive as we have been forgiven.

Remember that forgiveness doesn't mean excusing the wrong or pretending it didn't happen. It means releasing the burden of resentment and choosing to trust God with justice. Forgiveness is often a process, not a one-time decision, and it's okay to take time to work through your emotions while seeking God's help.

God understands your pain and wants to heal your heart. As you choose to forgive, you'll find freedom from the bitterness that can poison your soul. Trust that God can bring beauty from ashes and use even this painful experience for your growth and His glory.`

      relevantVerses = this.getIntelligentSearchResults("forgiveness").slice(0, 3)

      practicalSteps = [
        "Pray for the person who hurt you, even if it feels difficult at first",
        "Write down your feelings in a journal and bring them to God in prayer",
        "Seek wise counsel from a trusted pastor, counselor, or mature Christian friend",
        "Focus on God's forgiveness of you when you struggle to forgive others",
        "Set healthy boundaries while still choosing to forgive",
        "Remember that forgiveness is a process - be patient with yourself",
      ]

      prayerSuggestion =
        "Dear Heavenly Father, I come to You with a heart that is hurting. You know the pain I'm carrying and the struggle I have with forgiveness. Please help me to release this burden to You and to forgive as You have forgiven me. Heal my heart, give me Your perspective, and help me to trust You with justice. Fill me with Your love and peace. In Jesus' name, Amen."
    } else if (
      situationLower.includes("anxiet") ||
      situationLower.includes("worry") ||
      situationLower.includes("fear") ||
      situationLower.includes("stress")
    ) {
      guidance = `Anxiety and worry are common human experiences, but God doesn't want you to carry these burdens alone. When we're anxious, our minds often race with "what if" scenarios, but God invites us to bring our concerns to Him and trust in His perfect love and care.

Remember that anxiety often stems from trying to control things that are beyond our control. God wants you to cast your cares on Him because He cares for you deeply. This doesn't mean your feelings aren't valid - it means you have a loving Father who wants to help you through them.

Practice bringing your anxious thoughts to God in prayer, focusing on His promises rather than your fears. God's peace, which surpasses all understanding, can guard your heart and mind as you trust in Him. Take things one day at a time, and remember that God's grace is sufficient for each moment.`

      relevantVerses = this.getIntelligentSearchResults("fear anxiety").slice(0, 3)

      practicalSteps = [
        "Practice deep breathing while reciting Bible verses about God's peace",
        "Write down your worries and pray over each one specifically",
        "Establish a daily quiet time for prayer and Bible reading",
        "Focus on what you can control and surrender what you cannot to God",
        "Consider talking to a Christian counselor if anxiety persists",
        "Practice gratitude by listing things you're thankful for each day",
      ]

      prayerSuggestion =
        "Lord Jesus, You know the anxiety that weighs on my heart. I bring my worries and fears to You, knowing that You care for me. Please replace my anxiety with Your perfect peace. Help me to trust in Your goodness and sovereignty. Give me strength for today and hope for tomorrow. Thank You for being my refuge and strength. Amen."
    } else if (
      situationLower.includes("decision") ||
      situationLower.includes("choice") ||
      situationLower.includes("wisdom") ||
      situationLower.includes("guidance")
    ) {
      guidance = `Making important decisions can feel overwhelming, especially when the stakes are high or the path forward isn't clear. God wants to guide you in your decision-making process, and He promises to give wisdom to those who ask for it.

Start by bringing your decision to God in prayer, asking for His wisdom and guidance. Study His Word for principles that apply to your situation. Seek counsel from mature Christians who can offer biblical perspective. Pay attention to how God might be leading through circumstances, but always test everything against Scripture.

Remember that God is more concerned with your character than your comfort, and He can use any decision for your good and His glory when you're walking in relationship with Him. Trust that as you seek Him first, He will direct your paths and give you peace about the decision you need to make.`

      relevantVerses = this.getIntelligentSearchResults("wisdom guidance").slice(0, 3)

      practicalSteps = [
        "Spend extended time in prayer asking for God's wisdom",
        "Study relevant Bible passages that relate to your decision",
        "Seek counsel from wise, mature Christians you trust",
        "List the pros and cons while considering biblical principles",
        "Pay attention to the peace (or lack thereof) you feel about each option",
        "Consider how each choice aligns with God's character and will",
      ]

      prayerSuggestion =
        "Heavenly Father, I need Your wisdom for this important decision. You promise to give wisdom generously to those who ask, so I'm asking for Your guidance. Help me to see this situation from Your perspective. Give me discernment to know Your will and courage to follow it. I trust that You will direct my steps as I seek You first. In Jesus' name, Amen."
    } else {
      // General guidance for unspecified situations
      guidance = `Thank you for sharing what you're going through. Life's challenges can feel overwhelming, but remember that you're not alone in this journey. God sees your situation and cares deeply about what you're experiencing.

The Bible reminds us that God works all things together for good for those who love Him. Even in difficult times, He is present with you, offering strength, wisdom, and peace. Take time to bring your concerns to Him in prayer, and trust that He will guide your steps.

Consider seeking wise counsel from trusted friends, family, or spiritual mentors who can offer support and perspective. Remember that growth often comes through challenges, and God can use this experience to develop your character and deepen your faith.`

      relevantVerses = this.getIntelligentSearchResults("hope strength").slice(0, 3)

      practicalSteps = [
        "Spend time in prayer, honestly sharing your feelings and concerns with God",
        "Read and meditate on relevant Bible passages for comfort and guidance",
        "Seek wise counsel from trusted Christian friends, family, or mentors",
        "Take practical steps while trusting God with the outcome",
        "Practice gratitude by focusing on God's blessings in your life",
      ]

      prayerSuggestion =
        "Dear Heavenly Father, I bring this situation to You, knowing that You care about every detail of my life. Please grant me wisdom, peace, and strength to navigate this challenge. Help me to trust in Your perfect timing and plan. Guide my steps and help me to grow through this experience. In Jesus' name, Amen."
    }

    return {
      guidance,
      relevantVerses,
      practicalSteps,
      prayerSuggestion,
    }
  }
}

export const aiService = new AIService()
