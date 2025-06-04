// Bible API service for integrating with YouVersion and local Bible data
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
  provider: "youversion" | "local"
}

export class BibleAPIService {
  private isConfigured: boolean

  constructor() {
    // Check if YouVersion API is configured
    this.isConfigured = !!process.env.YOUVERSION_API_KEY

    if (!this.isConfigured) {
      console.warn("No Bible API keys configured. Using local Bible data only.")
    }
  }

  // Get available translations
  getAvailableTranslations(): BibleTranslation[] {
    return [
      // Local translations (from blob storage)
      { id: "kjv", name: "King James Version", abbreviation: "KJV", language: "en", provider: "local" },
      { id: "niv", name: "New International Version", abbreviation: "NIV", language: "en", provider: "local" },
      { id: "nasb", name: "New American Standard Bible", abbreviation: "NASB", language: "en", provider: "local" },
      { id: "nlt", name: "New Living Translation", abbreviation: "NLT", language: "en", provider: "local" },
      { id: "csb", name: "Christian Standard Bible", abbreviation: "CSB", language: "en", provider: "local" },

      // YouVersion API (requires partnership)
      { id: "youversion-niv", name: "NIV (YouVersion)", abbreviation: "NIV", language: "en", provider: "youversion" },
    ]
  }

  // YouVersion API integration (requires partnership)
  async getYouVersionChapter(book: string, chapter: number, versionId = "111"): Promise<BibleChapter | null> {
    try {
      // YouVersion API requires partnership and special access
      // This is a placeholder for the actual implementation

      console.log(`Would fetch from YouVersion API: ${book} ${chapter} (version ${versionId})`)
      return null
    } catch (error) {
      console.error("Error fetching from YouVersion:", error)
      return null
    }
  }

  // Main method to get chapter from any available source
  async getChapter(book: string, chapter: number, translation = "KJV"): Promise<BibleChapter | null> {
    console.log(`Fetching ${book} ${chapter} in ${translation}`)

    // Try YouVersion API if configured
    if (this.isConfigured) {
      const yvResult = await this.getYouVersionChapter(book, chapter)
      if (yvResult) {
        return yvResult
      }
    }

    // Return fallback data if APIs fail
    return this.getFallbackChapter(book, chapter, translation)
  }

  // Search across available APIs
  async searchBible(query: string, translation = "KJV", limit = 10): Promise<BibleSearchResult[]> {
    const results: BibleSearchResult[] = []

    // Add API searches here when available
    // For now, return empty results
    console.log(`Would search for "${query}" in ${translation}, limit: ${limit}`)

    return results
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

  // Fallback chapter data when APIs are unavailable
  private getFallbackChapter(book: string, chapter: number, translation: string): BibleChapter {
    // Return sample verses for common chapters
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
    } else if (book.toLowerCase() === "psalm" && chapter === 23) {
      fallbackVerses.push({
        verse: 1,
        text: "The Lord is my shepherd, I lack nothing.",
      })
      fallbackVerses.push({
        verse: 2,
        text: "He makes me lie down in green pastures, he leads me beside quiet waters.",
      })
    } else {
      // Generic fallback
      for (let i = 1; i <= 10; i++) {
        fallbackVerses.push({
          verse: i,
          text: `This is verse ${i} of ${book} chapter ${chapter}. In a production app, this would contain the actual Bible text from local storage or YouVersion API.`,
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
    ]

    // Select verse based on day of year for consistency
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedReference = popularVerses[dayOfYear % popularVerses.length]

    return await this.getVerse(selectedReference, translation)
  }
}

// Export singleton instance
export const bibleAPIService = new BibleAPIService()
