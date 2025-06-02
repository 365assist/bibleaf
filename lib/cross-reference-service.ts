interface CrossReference {
  reference: string
  text: string
  relationship: "parallel" | "contrast" | "explanation" | "fulfillment" | "example" | "prophecy" | "quotation"
  relevanceScore: number
  context?: string
  theme?: string
  testament: "Old" | "New"
  book: string
  chapter: number
  verse: number
}

interface ThematicGroup {
  theme: string
  description: string
  references: CrossReference[]
  color: string
}

interface RelationshipAnalysis {
  primaryThemes: string[]
  testamentDistribution: { old: number; new: number }
  relationshipTypes: { [key: string]: number }
  keyConnections: string[]
}

interface CrossReferenceOptions {
  maxResults?: number
  includeContext?: boolean
  includeThematic?: boolean
  minRelevance?: number
  testament?: "Old" | "New" | "all"
}

export class CrossReferenceService {
  private crossReferences: { [key: string]: CrossReference[] } = {
    // Enhanced cross-reference database
    "john 3:16": [
      {
        reference: "Romans 5:8",
        text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
        relationship: "parallel",
        relevanceScore: 0.95,
        context: "Demonstrates God's love through Christ's sacrifice",
        theme: "God's Love",
        testament: "New",
        book: "Romans",
        chapter: 5,
        verse: 8,
      },
      {
        reference: "1 John 4:9-10",
        text: "This is how God showed his love among us: He sent his one and only Son into the world that we might live through him. This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins.",
        relationship: "explanation",
        relevanceScore: 0.92,
        context: "Explains how God's love is demonstrated through sending His Son",
        theme: "God's Love",
        testament: "New",
        book: "1 John",
        chapter: 4,
        verse: 9,
      },
      {
        reference: "Isaiah 53:5",
        text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
        relationship: "prophecy",
        relevanceScore: 0.88,
        context: "Prophetic fulfillment of Christ's sacrificial love",
        theme: "Messianic Prophecy",
        testament: "Old",
        book: "Isaiah",
        chapter: 53,
        verse: 5,
      },
      {
        reference: "Ephesians 2:4-5",
        text: "But because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions—it is by grace you have been saved.",
        relationship: "parallel",
        relevanceScore: 0.85,
        context: "God's love expressed through grace and salvation",
        theme: "Grace and Mercy",
        testament: "New",
        book: "Ephesians",
        chapter: 2,
        verse: 4,
      },
      {
        reference: "Titus 3:4-5",
        text: "But when the kindness and love of God our Savior appeared, he saved us, not because of righteous things we had done, but because of his mercy.",
        relationship: "parallel",
        relevanceScore: 0.82,
        context: "Salvation through God's kindness and mercy, not works",
        theme: "Salvation",
        testament: "New",
        book: "Titus",
        chapter: 3,
        verse: 4,
      },
      {
        reference: "2 Corinthians 5:21",
        text: "God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.",
        relationship: "explanation",
        relevanceScore: 0.8,
        context: "Explains the mechanism of salvation through Christ",
        theme: "Substitutionary Atonement",
        testament: "New",
        book: "2 Corinthians",
        chapter: 5,
        verse: 21,
      },
      {
        reference: "Jeremiah 31:3",
        text: "The Lord appeared to us in the past, saying: 'I have loved you with an everlasting love; I have drawn you with unfailing kindness.'",
        relationship: "parallel",
        relevanceScore: 0.78,
        context: "God's everlasting love for His people",
        theme: "God's Love",
        testament: "Old",
        book: "Jeremiah",
        chapter: 31,
        verse: 3,
      },
    ],

    "romans 8:28": [
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        relationship: "parallel",
        relevanceScore: 0.9,
        context: "God's sovereign plans for good",
        theme: "God's Sovereignty",
        testament: "Old",
        book: "Jeremiah",
        chapter: 29,
        verse: 11,
      },
      {
        reference: "Genesis 50:20",
        text: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
        relationship: "example",
        relevanceScore: 0.88,
        context: "Joseph's example of God working evil for good",
        theme: "God's Sovereignty",
        testament: "Old",
        book: "Genesis",
        chapter: 50,
        verse: 20,
      },
      {
        reference: "Philippians 1:6",
        text: "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.",
        relationship: "parallel",
        relevanceScore: 0.85,
        context: "God's commitment to complete His work in believers",
        theme: "God's Faithfulness",
        testament: "New",
        book: "Philippians",
        chapter: 1,
        verse: 6,
      },
    ],

    "philippians 4:13": [
      {
        reference: "2 Corinthians 12:9",
        text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.",
        relationship: "parallel",
        relevanceScore: 0.92,
        context: "God's strength perfected in human weakness",
        theme: "God's Strength",
        testament: "New",
        book: "2 Corinthians",
        chapter: 12,
        verse: 9,
      },
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        relationship: "parallel",
        relevanceScore: 0.88,
        context: "Renewed strength through hope in the Lord",
        theme: "God's Strength",
        testament: "Old",
        book: "Isaiah",
        chapter: 40,
        verse: 31,
      },
      {
        reference: "Ephesians 6:10",
        text: "Finally, be strong in the Lord and in his mighty power.",
        relationship: "parallel",
        relevanceScore: 0.85,
        context: "Source of strength is in the Lord",
        theme: "God's Strength",
        testament: "New",
        book: "Ephesians",
        chapter: 6,
        verse: 10,
      },
    ],
    "ephesians 2:8-9": [
      {
        reference: "Romans 3:24",
        text: "And all are justified freely by his grace through the redemption that came by Christ Jesus.",
        relationship: "parallel",
        relevanceScore: 0.95,
        context: "Justification by grace, not works",
        theme: "Grace",
        testament: "New",
        book: "Romans",
        chapter: 3,
        verse: 24,
      },
      {
        reference: "Titus 3:5",
        text: "He saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewal by the Holy Spirit.",
        relationship: "parallel",
        relevanceScore: 0.92,
        context: "Salvation not by works but by mercy",
        theme: "Grace",
        testament: "New",
        book: "Titus",
        chapter: 3,
        verse: 5,
      },
      {
        reference: "2 Timothy 1:9",
        text: "He has saved us and called us to a holy life—not because of anything we have done but because of his own purpose and grace.",
        relationship: "parallel",
        relevanceScore: 0.88,
        context: "Salvation by God's purpose and grace, not our works",
        theme: "Grace",
        testament: "New",
        book: "2 Timothy",
        chapter: 1,
        verse: 9,
      },
      {
        reference: "Romans 11:6",
        text: "And if by grace, then it cannot be based on works; if it were, grace would no longer be grace.",
        relationship: "explanation",
        relevanceScore: 0.85,
        context: "Grace and works are mutually exclusive",
        theme: "Grace",
        testament: "New",
        book: "Romans",
        chapter: 11,
        verse: 6,
      },
    ],

    "hebrews 11:1": [
      {
        reference: "2 Corinthians 5:7",
        text: "For we live by faith, not by sight.",
        relationship: "parallel",
        relevanceScore: 0.9,
        context: "Faith involves trusting what we cannot see",
        theme: "Faith",
        testament: "New",
        book: "2 Corinthians",
        chapter: 5,
        verse: 7,
      },
      {
        reference: "Romans 10:17",
        text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
        relationship: "explanation",
        relevanceScore: 0.88,
        context: "How faith is developed through God's Word",
        theme: "Faith",
        testament: "New",
        book: "Romans",
        chapter: 10,
        verse: 17,
      },
      {
        reference: "Hebrews 11:6",
        text: "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.",
        relationship: "explanation",
        relevanceScore: 0.85,
        context: "Faith is essential for pleasing God",
        theme: "Faith",
        testament: "New",
        book: "Hebrews",
        chapter: 11,
        verse: 6,
      },
      {
        reference: "Mark 11:24",
        text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
        relationship: "example",
        relevanceScore: 0.82,
        context: "Faith applied in prayer",
        theme: "Faith",
        testament: "New",
        book: "Mark",
        chapter: 11,
        verse: 24,
      },
    ],

    "proverbs 3:5-6": [
      {
        reference: "Psalm 37:5",
        text: "Commit your way to the Lord; trust in him and he will do this:",
        relationship: "parallel",
        relevanceScore: 0.92,
        context: "Committing our ways to God in trust",
        theme: "Trust",
        testament: "Old",
        book: "Psalm",
        chapter: 37,
        verse: 5,
      },
      {
        reference: "Isaiah 55:8-9",
        text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.",
        relationship: "explanation",
        relevanceScore: 0.88,
        context: "Why we shouldn't lean on our own understanding",
        theme: "God's Wisdom",
        testament: "Old",
        book: "Isaiah",
        chapter: 55,
        verse: 8,
      },
      {
        reference: "James 1:5",
        text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
        relationship: "parallel",
        relevanceScore: 0.85,
        context: "Seeking God's wisdom instead of relying on our own",
        theme: "Wisdom",
        testament: "New",
        book: "James",
        chapter: 1,
        verse: 5,
      },
    ],

    "jeremiah 29:11": [
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        relationship: "parallel",
        relevanceScore: 0.95,
        context: "God's good plans working through all circumstances",
        theme: "God's Plans",
        testament: "New",
        book: "Romans",
        chapter: 8,
        verse: 28,
      },
      {
        reference: "Psalm 139:16",
        text: "Your eyes saw my unformed body; all the days ordained for me were written in your book before one of them came to be.",
        relationship: "parallel",
        relevanceScore: 0.88,
        context: "God's predetermined plans for our lives",
        theme: "God's Plans",
        testament: "Old",
        book: "Psalm",
        chapter: 139,
        verse: 16,
      },
      {
        reference: "Isaiah 46:10",
        text: "I make known the end from the beginning, from ancient times, what is still to come. I say, 'My purpose will stand, and I will do all that I please.'",
        relationship: "explanation",
        relevanceScore: 0.85,
        context: "God's sovereign ability to fulfill His plans",
        theme: "God's Sovereignty",
        testament: "Old",
        book: "Isaiah",
        chapter: 46,
        verse: 10,
      },
    ],

    "1 john 4:8": [
      {
        reference: "1 John 4:16",
        text: "And so we know and rely on the love God has for us. God is love. Whoever lives in love lives in God, and God in them.",
        relationship: "parallel",
        relevanceScore: 0.95,
        context: "Reaffirms that God's essence is love",
        theme: "God's Love",
        testament: "New",
        book: "1 John",
        chapter: 4,
        verse: 16,
      },
      {
        reference: "Romans 5:8",
        text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
        relationship: "example",
        relevanceScore: 0.92,
        context: "How God's love is demonstrated through Christ",
        theme: "God's Love",
        testament: "New",
        book: "Romans",
        chapter: 5,
        verse: 8,
      },
      {
        reference: "Deuteronomy 7:9",
        text: "Know therefore that the Lord your God is God; he is the faithful God, keeping his covenant of love to a thousand generations of those who love him and keep his commandments.",
        relationship: "parallel",
        relevanceScore: 0.85,
        context: "God's faithful, covenant love",
        theme: "God's Love",
        testament: "Old",
        book: "Deuteronomy",
        chapter: 7,
        verse: 9,
      },
    ],
  }

  async getEnhancedCrossReferences(reference: string, options: CrossReferenceOptions = {}): Promise<CrossReference[]> {
    const { maxResults = 20, includeContext = true, minRelevance = 0.5, testament = "all" } = options

    const normalizedRef = reference.toLowerCase().trim()
    let references = this.crossReferences[normalizedRef] || []

    // Apply filters
    references = references.filter((ref) => {
      if (ref.relevanceScore < minRelevance) return false
      if (testament !== "all" && ref.testament !== testament) return false
      return true
    })

    // Sort by relevance
    references.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Limit results
    references = references.slice(0, maxResults)

    // Enhance with additional context if requested
    if (includeContext) {
      references = await this.enhanceWithContext(references)
    }

    return references
  }

  async getThematicGroups(reference: string): Promise<ThematicGroup[]> {
    const references = await this.getEnhancedCrossReferences(reference, { includeContext: true })

    // Group by theme
    const themeMap = new Map<string, CrossReference[]>()

    references.forEach((ref) => {
      if (ref.theme) {
        if (!themeMap.has(ref.theme)) {
          themeMap.set(ref.theme, [])
        }
        themeMap.get(ref.theme)!.push(ref)
      }
    })

    // Convert to thematic groups with descriptions and colors
    const thematicGroups: ThematicGroup[] = []
    const themeDescriptions: { [key: string]: { description: string; color: string } } = {
      "God's Love": {
        description: "Passages that reveal the nature and expression of God's unconditional love",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      "Grace and Mercy": {
        description: "Verses about God's unmerited favor and compassionate forgiveness",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      Salvation: {
        description: "Passages about God's plan of redemption and eternal life",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      "Messianic Prophecy": {
        description: "Old Testament prophecies fulfilled in Jesus Christ",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      "God's Sovereignty": {
        description: "Verses about God's supreme authority and control over all things",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      "God's Strength": {
        description: "Passages about divine power available to believers",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      },
      "God's Faithfulness": {
        description: "Verses about God's reliability and commitment to His promises",
        color: "bg-teal-100 text-teal-800 border-teal-200",
      },
    }

    themeMap.forEach((refs, theme) => {
      const themeInfo = themeDescriptions[theme] || {
        description: `Passages related to ${theme}`,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      }

      thematicGroups.push({
        theme,
        description: themeInfo.description,
        color: themeInfo.color,
        references: refs.sort((a, b) => b.relevanceScore - a.relevanceScore),
      })
    })

    return thematicGroups.sort((a, b) => b.references.length - a.references.length)
  }

  async analyzeRelationships(reference: string): Promise<RelationshipAnalysis> {
    const references = await this.getEnhancedCrossReferences(reference)

    // Extract themes
    const themes = new Set<string>()
    references.forEach((ref) => {
      if (ref.theme) themes.add(ref.theme)
    })

    // Testament distribution
    const testamentCounts = { old: 0, new: 0 }
    references.forEach((ref) => {
      if (ref.testament === "Old") testamentCounts.old++
      else testamentCounts.new++
    })

    // Relationship types
    const relationshipTypes: { [key: string]: number } = {}
    references.forEach((ref) => {
      relationshipTypes[ref.relationship] = (relationshipTypes[ref.relationship] || 0) + 1
    })

    // Key connections (highest relevance)
    const keyConnections = references
      .filter((ref) => ref.relevanceScore > 0.85)
      .map((ref) => ref.reference)
      .slice(0, 5)

    return {
      primaryThemes: Array.from(themes).slice(0, 5),
      testamentDistribution: testamentCounts,
      relationshipTypes,
      keyConnections,
    }
  }

  async getAICrossReferences(reference: string, context: string, userPreferences?: any): Promise<CrossReference[]> {
    // This would integrate with AI service for dynamic cross-reference discovery
    // For now, enhance existing cross-references with AI-powered relevance scoring

    const baseReferences = await this.getEnhancedCrossReferences(reference)

    // AI-enhanced relevance scoring based on context
    return baseReferences
      .map((ref) => ({
        ...ref,
        relevanceScore: this.calculateAIRelevance(ref, context, userPreferences),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  private async enhanceWithContext(references: CrossReference[]): Promise<CrossReference[]> {
    // Add additional contextual information
    return references.map((ref) => ({
      ...ref,
      context: ref.context || this.generateContextualConnection(ref),
    }))
  }

  private generateContextualConnection(ref: CrossReference): string {
    // Generate contextual connections based on relationship type
    switch (ref.relationship) {
      case "parallel":
        return `This verse teaches a similar truth about ${ref.theme?.toLowerCase() || "the same topic"}`
      case "explanation":
        return `This passage provides deeper explanation of the concept`
      case "fulfillment":
        return `This represents the fulfillment of the promise or prophecy`
      case "prophecy":
        return `This Old Testament passage prophetically points to the truth`
      case "example":
        return `This provides a concrete example of the principle in action`
      case "contrast":
        return `This verse provides a contrasting perspective that illuminates the truth`
      case "quotation":
        return `This passage is directly quoted or referenced`
      default:
        return `This verse is thematically connected`
    }
  }

  private calculateAIRelevance(ref: CrossReference, context: string, userPreferences?: any): number {
    let score = ref.relevanceScore

    // Boost score based on context matching
    const contextWords = context.toLowerCase().split(" ")
    const refWords = ref.text.toLowerCase().split(" ")
    const matches = contextWords.filter((word) => word.length > 3 && refWords.some((refWord) => refWord.includes(word)))

    score += matches.length * 0.02

    // Apply user preferences if available
    if (userPreferences?.preferredTestament && ref.testament === userPreferences.preferredTestament) {
      score += 0.05
    }

    if (userPreferences?.favoriteThemes?.includes(ref.theme)) {
      score += 0.03
    }

    return Math.min(score, 1.0)
  }
}

export const crossReferenceService = new CrossReferenceService()
