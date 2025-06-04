// Bible API service for integrating with ESV API, Bible Gateway, and YouVersion
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
  provider: "esv" | "bible-gateway" | "youversion"
}

export class BibleAPIService {
  private esvApiKey: string
  private isConfigured: boolean

  constructor() {
    // ESV API key from environment
    this.esvApiKey = process.env.ESV_API_KEY || ""
    this.isConfigured = !!this.esvApiKey

    if (!this.isConfigured) {
      console.warn("ESV API key not configured. Some Bible features may be limited.")
    }
  }

  // Get available translations
  getAvailableTranslations(): BibleTranslation[] {
    return [
      // ESV API
      { id: "esv", name: "English Standard Version", abbreviation: "ESV", language: "en", provider: "esv" },

      // Bible Gateway (via web scraping - be careful with rate limits)
      { id: "niv", name: "New International Version", abbreviation: "NIV", language: "en", provider: "bible-gateway" },
      { id: "kjv", name: "King James Version", abbreviation: "KJV", language: "en", provider: "bible-gateway" },
      {
        id: "nasb",
        name: "New American Standard Bible",
        abbreviation: "NASB",
        language: "en",
        provider: "bible-gateway",
      },
      { id: "nlt", name: "New Living Translation", abbreviation: "NLT", language: "en", provider: "bible-gateway" },
      { id: "csb", name: "Christian Standard Bible", abbreviation: "CSB", language: "en", provider: "bible-gateway" },

      // YouVersion API (requires partnership)
      { id: "youversion-niv", name: "NIV (YouVersion)", abbreviation: "NIV", language: "en", provider: "youversion" },
    ]
  }

  // ESV API integration
  async getESVChapter(book: string, chapter: number): Promise<BibleChapter | null> {
    if (!this.isConfigured) {
      console.warn("ESV API not configured")
      return null
    }

    try {
      const passage = `${book} ${chapter}`
      const response = await fetch(
        `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(passage)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`,
        {
          headers: {
            Authorization: `Token ${this.esvApiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`ESV API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.passages || data.passages.length === 0) {
        return null
      }

      // Parse the ESV text into verses
      const text = data.passages[0]
      const verses = this.parseESVText(text)

      return {
        book,
        chapter,
        verses,
        translation: "ESV",
      }
    } catch (error) {
      console.error("Error fetching ESV chapter:", error)
      return null
    }
  }

  // Parse ESV API text into verse objects
  private parseESVText(text: string): BibleVerse[] {
    const verses: BibleVerse[] = []

    // ESV API returns text with verse numbers like "[1] In the beginning..."
    const versePattern = /\[(\d+)\]\s*([^[]*?)(?=\[\d+\]|$)/g
    let match

    while ((match = versePattern.exec(text)) !== null) {
      const verseNumber = Number.parseInt(match[1])
      const verseText = match[2].trim()

      if (verseText) {
        verses.push({
          verse: verseNumber,
          text: verseText,
        })
      }
    }

    return verses
  }

  // ESV API verse search
  async searchESV(query: string, limit = 10): Promise<BibleSearchResult[]> {
    if (!this.isConfigured) {
      return []
    }

    try {
      const response = await fetch(
        `https://api.esv.org/v3/passage/search/?q=${encodeURIComponent(query)}&page-size=${limit}`,
        {
          headers: {
            Authorization: `Token ${this.esvApiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`ESV search error: ${response.status}`)
      }

      const data = await response.json()
      const results: BibleSearchResult[] = []

      if (data.results) {
        for (const result of data.results) {
          const parsed = this.parseReference(result.reference)
          if (parsed) {
            results.push({
              reference: result.reference,
              text: result.content,
              translation: "ESV",
              book: parsed.book,
              chapter: parsed.chapter,
              verse: parsed.verse,
            })
          }
        }
      }

      return results
    } catch (error) {
      console.error("Error searching ESV:", error)
      return []
    }
  }

  // Bible Gateway integration (web scraping approach)
  async getBibleGatewayChapter(book: string, chapter: number, translation = "NIV"): Promise<BibleChapter | null> {
    try {
      // Note: This is a simplified example. In production, you'd want to use their official API
      // or implement proper web scraping with rate limiting and error handling

      const passage = `${book} ${chapter}`
      const url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage)}&version=${translation}`

      // For now, return null and use fallback
      // In production, you'd implement proper scraping or use their API
      console.log(`Would fetch from Bible Gateway: ${url}`)
      return null
    } catch (error) {
      console.error("Error fetching from Bible Gateway:", error)
      return null
    }
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
  async getChapter(book: string, chapter: number, translation = "ESV"): Promise<BibleChapter | null> {
    console.log(`Fetching ${book} ${chapter} in ${translation}`)

    // Try ESV API first if requesting ESV
    if (translation.toUpperCase() === "ESV") {
      const esvResult = await this.getESVChapter(book, chapter)
      if (esvResult) {
        return esvResult
      }
    }

    // Try Bible Gateway for other translations
    if (["NIV", "KJV", "NASB", "NLT", "CSB"].includes(translation.toUpperCase())) {
      const bgResult = await this.getBibleGatewayChapter(book, chapter, translation)
      if (bgResult) {
        return bgResult
      }
    }

    // Try YouVersion as fallback
    const yvResult = await this.getYouVersionChapter(book, chapter)
    if (yvResult) {
      return yvResult
    }

    // Return fallback data if all APIs fail
    return this.getFallbackChapter(book, chapter, translation)
  }

  // Search across available APIs
  async searchBible(query: string, translation = "ESV", limit = 10): Promise<BibleSearchResult[]> {
    const results: BibleSearchResult[] = []

    // Try ESV API search
    if (translation.toUpperCase() === "ESV") {
      const esvResults = await this.searchESV(query, limit)
      results.push(...esvResults)
    }

    // Add other API searches here when available

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
          text: `This is verse ${i} of ${book} chapter ${chapter}. In a production app, this would contain the actual Bible text from an API like ESV API, Bible Gateway, or YouVersion.`,
        })
      }
    }

    return {
      book,
      chapter,
      verses: fallbackVerses,
      translation: translation || "NIV",
    }
  }

  // Get verse by reference (e.g., "John 3:16")
  async getVerse(reference: string, translation = "ESV"): Promise<BibleSearchResult | null> {
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
  async getVerses(references: string[], translation = "ESV"): Promise<BibleSearchResult[]> {
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
  async getDailyVerse(translation = "ESV"): Promise<BibleSearchResult | null> {
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
