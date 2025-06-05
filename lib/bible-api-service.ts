// Bible API service for local Bible data only
interface BibleVerse {
  verse: number
  text: string
}

interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
  translation: string
}

interface BibleSearchResult {
  reference: string
  text: string
  translation: string
  book: string
  chapter: number
  verse: number
}

interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  provider: "local"
}

export class BibleAPIService {
  constructor() {
    console.log("Bible API Service initialized - using local Bible data only")
  }

  // Get available translations (all from local storage)
  getAvailableTranslations(): BibleTranslation[] {
    return [
      { id: "kjv", name: "King James Version", abbreviation: "KJV", language: "en", provider: "local" },
      { id: "niv", name: "New International Version", abbreviation: "NIV", language: "en", provider: "local" },
      { id: "nasb", name: "New American Standard Bible", abbreviation: "NASB", language: "en", provider: "local" },
      { id: "nlt", name: "New Living Translation", abbreviation: "NLT", language: "en", provider: "local" },
      { id: "csb", name: "Christian Standard Bible", abbreviation: "CSB", language: "en", provider: "local" },
      { id: "web", name: "World English Bible", abbreviation: "WEB", language: "en", provider: "local" },
    ]
  }

  // Main method to get chapter from local storage
  async getChapter(book: string, chapter: number, translation = "KJV"): Promise<BibleChapter | null> {
    console.log(`Fetching ${book} ${chapter} in ${translation} from local storage`)

    // Use the blob service directly for all Bible data
    try {
      const { bibleBlobService } = await import("@/lib/bible-blob-service")
      const result = await bibleBlobService.getChapter(translation.toLowerCase(), book.toLowerCase(), chapter)

      if (result) {
        return result
      }
    } catch (error) {
      console.error("Error fetching from blob service:", error)
    }

    // Return fallback data if blob service fails
    return this.getFallbackChapter(book, chapter, translation)
  }

  // Search local Bible data
  async searchBible(query: string, translation = "KJV", limit = 10): Promise<BibleSearchResult[]> {
    console.log(`Searching for "${query}" in ${translation}, limit: ${limit}`)

    try {
      const { bibleBlobService } = await import("@/lib/bible-blob-service")
      const results = await bibleBlobService.searchBible(translation.toLowerCase(), query, limit)

      return results.map((verse) => ({
        reference: `${this.capitalizeBook(verse.book)} ${verse.chapter}:${verse.verse}`,
        text: verse.text,
        translation: verse.translation,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
      }))
    } catch (error) {
      console.error("Error searching Bible:", error)
      return []
    }
  }

  // Helper to capitalize book names
  private capitalizeBook(book: string): string {
    const bookMappings: Record<string, string> = {
      john: "John",
      genesis: "Genesis",
      psalms: "Psalms",
      romans: "Romans",
      matthew: "Matthew",
      mark: "Mark",
      luke: "Luke",
      acts: "Acts",
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

    return bookMappings[book.toLowerCase()] || book
  }

  // Parse reference string like "John 3:16" into components
  private parseReference(reference: string): { book: string; chapter: number; verse: number } | null {
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)/)
    if (match) {
      return {
        book: match[1].trim(),
        chapter: Number.parseInt(match[2]),
        verse: Number.parseInt(match[3]),
      }
    }
    return null
  }

  // Fallback chapter data when local storage is unavailable
  private getFallbackChapter(book: string, chapter: number, translation: string): BibleChapter {
    console.log(`Using fallback data for ${book} ${chapter}`)

    const fallbackVerses: BibleVerse[] = []

    if (book.toLowerCase() === "john" && chapter === 3) {
      fallbackVerses.push({
        verse: 16,
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      })
      fallbackVerses.push({
        verse: 17,
        text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
      })
    } else if (book.toLowerCase().includes("psalm") && chapter === 23) {
      fallbackVerses.push({
        verse: 1,
        text: "The Lord is my shepherd, I lack nothing.",
      })
      fallbackVerses.push({
        verse: 2,
        text: "He makes me lie down in green pastures, he leads me beside quiet waters.",
      })
      fallbackVerses.push({
        verse: 3,
        text: "He refreshes my soul. He guides me along the right paths for his name's sake.",
      })
      fallbackVerses.push({
        verse: 4,
        text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
      })
      fallbackVerses.push({
        verse: 5,
        text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.",
      })
      fallbackVerses.push({
        verse: 6,
        text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.",
      })
    } else if (book.toLowerCase() === "romans" && chapter === 8) {
      fallbackVerses.push({
        verse: 28,
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      })
    } else if (book.toLowerCase() === "philippians" && chapter === 4) {
      fallbackVerses.push({
        verse: 13,
        text: "I can do all this through him who gives me strength.",
      })
    } else {
      // Generic fallback
      for (let i = 1; i <= 10; i++) {
        fallbackVerses.push({
          verse: i,
          text: `This is verse ${i} of ${book} chapter ${chapter}. The full Bible text is available when you upload Bible data to blob storage using the provided scripts.`,
        })
      }
    }

    return {
      book,
      chapter,
      verses: fallbackVerses,
      translation: translation || "KJV",
    }
  }

  // Get verse by reference (e.g., "John 3:16")
  async getVerse(reference: string, translation = "KJV"): Promise<BibleSearchResult | null> {
    const parsed = this.parseReference(reference)
    if (!parsed) {
      return null
    }

    const chapter = await this.getChapter(parsed.book, parsed.chapter, translation)
    if (!chapter) {
      return null
    }

    const verse = chapter.verses.find((v) => v.verse === parsed.verse)
    if (!verse) {
      return null
    }

    return {
      reference,
      text: verse.text,
      translation: chapter.translation,
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
    }
  }

  // Get multiple verses by references
  async getVerses(references: string[], translation = "KJV"): Promise<BibleSearchResult[]> {
    const results: BibleSearchResult[] = []

    for (const reference of references) {
      const verse = await this.getVerse(reference, translation)
      if (verse) {
        results.push(verse)
      }
    }

    return results
  }

  // Get daily verse (random selection from curated list)
  async getDailyVerse(translation = "KJV"): Promise<BibleSearchResult | null> {
    const popularVerses = [
      "John 3:16",
      "Romans 8:28",
      "Philippians 4:13",
      "Jeremiah 29:11",
      "Psalm 23:1",
      "Isaiah 40:31",
      "Proverbs 3:5-6",
      "Matthew 6:33",
      "1 Peter 5:7",
      "Ephesians 2:8-9",
      "Psalm 46:10",
      "Romans 12:2",
      "Joshua 1:9",
      "2 Timothy 1:7",
      "Matthew 11:28",
    ]

    // Select verse based on day of year for consistency
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedReference = popularVerses[dayOfYear % popularVerses.length]

    return await this.getVerse(selectedReference, translation)
  }

  // Get random verse from local storage
  async getRandomVerse(translation = "KJV"): Promise<BibleSearchResult | null> {
    try {
      const { bibleBlobService } = await import("@/lib/bible-blob-service")
      const verse = await bibleBlobService.getRandomVerse(translation.toLowerCase())

      if (verse) {
        return {
          reference: `${this.capitalizeBook(verse.book)} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          translation: verse.translation,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
        }
      }
    } catch (error) {
      console.error("Error getting random verse:", error)
    }

    // Fallback to daily verse
    return await this.getDailyVerse(translation)
  }

  // Get Bible statistics from local storage
  async getBibleStats(): Promise<any> {
    try {
      const { bibleBlobService } = await import("@/lib/bible-blob-service")
      return await bibleBlobService.getBibleStats()
    } catch (error) {
      console.error("Error getting Bible stats:", error)
      return {
        totalTranslations: 6,
        totalBooks: 66,
        totalChapters: 1189,
        totalVerses: 31102,
        lastUpdated: new Date().toISOString(),
        availableBooks: ["Genesis", "Exodus", "Psalms", "Matthew", "John", "Romans"],
      }
    }
  }
}

// Export singleton instance
export const bibleAPIService = new BibleAPIService()
