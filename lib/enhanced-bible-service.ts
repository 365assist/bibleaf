export interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  year: number
  copyright: string
  isPublicDomain: boolean
  description: string
  category: "modern" | "classic" | "literal" | "paraphrase"
}

export interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
  bookName: string
  testament: "old" | "new"
}

export interface SearchResult extends BibleVerse {
  relevance: number
  context: string
  highlights: string[]
}

export interface BibleStats {
  totalTranslations: number
  totalBooks: number
  totalChapters: number
  totalVerses: number
  availableLanguages: string[]
  lastUpdated: string
}

class EnhancedBibleService {
  private cache = new Map<string, any>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  // Comprehensive list of Bible translations
  private readonly TRANSLATIONS: Record<string, BibleTranslation> = {
    kjv: {
      id: "kjv",
      name: "King James Version",
      abbreviation: "KJV",
      language: "en",
      year: 1769,
      copyright: "Public Domain",
      isPublicDomain: true,
      description: "The classic English Bible translation, beloved for its literary beauty",
      category: "classic",
    },
    niv: {
      id: "niv",
      name: "New International Version",
      abbreviation: "NIV",
      language: "en",
      year: 2011,
      copyright: "Biblica, Inc.",
      isPublicDomain: false,
      description: "Modern, accurate translation balancing word-for-word and thought-for-thought",
      category: "modern",
    },
    esv: {
      id: "esv",
      name: "English Standard Version",
      abbreviation: "ESV",
      language: "en",
      year: 2001,
      copyright: "Crossway",
      isPublicDomain: false,
      description: "Essentially literal translation with excellent readability",
      category: "literal",
    },
    nlt: {
      id: "nlt",
      name: "New Living Translation",
      abbreviation: "NLT",
      language: "en",
      year: 2015,
      copyright: "Tyndale House Publishers",
      isPublicDomain: false,
      description: "Thought-for-thought translation for contemporary readers",
      category: "modern",
    },
    nasb: {
      id: "nasb",
      name: "New American Standard Bible",
      abbreviation: "NASB",
      language: "en",
      year: 2020,
      copyright: "The Lockman Foundation",
      isPublicDomain: false,
      description: "Highly literal translation preserving original language structure",
      category: "literal",
    },
    web: {
      id: "web",
      name: "World English Bible",
      abbreviation: "WEB",
      language: "en",
      year: 2000,
      copyright: "Public Domain",
      isPublicDomain: true,
      description: "Modern public domain translation based on ASV",
      category: "modern",
    },
    asv: {
      id: "asv",
      name: "American Standard Version",
      abbreviation: "ASV",
      language: "en",
      year: 1901,
      copyright: "Public Domain",
      isPublicDomain: true,
      description: "Scholarly American revision of the King James Version",
      category: "classic",
    },
    ylt: {
      id: "ylt",
      name: "Young's Literal Translation",
      abbreviation: "YLT",
      language: "en",
      year: 1898,
      copyright: "Public Domain",
      isPublicDomain: true,
      description: "Extremely literal word-for-word translation",
      category: "literal",
    },
    darby: {
      id: "darby",
      name: "Darby Translation",
      abbreviation: "DARBY",
      language: "en",
      year: 1890,
      copyright: "Public Domain",
      isPublicDomain: true,
      description: "Translation by John Nelson Darby",
      category: "classic",
    },
    msg: {
      id: "msg",
      name: "The Message",
      abbreviation: "MSG",
      language: "en",
      year: 2002,
      copyright: "NavPress",
      isPublicDomain: false,
      description: "Contemporary paraphrase in modern American English",
      category: "paraphrase",
    },
  }

  // Advanced search with AI-like relevance scoring
  async searchBible(
    query: string,
    options: {
      translations?: string[]
      testament?: "old" | "new" | "both"
      books?: string[]
      limit?: number
      includeContext?: boolean
    } = {},
  ): Promise<SearchResult[]> {
    const { translations = ["kjv"], testament = "both", books = [], limit = 50, includeContext = true } = options

    const results: SearchResult[] = []
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2)

    for (const translationId of translations) {
      const bibleData = await this.getBibleData(translationId)
      if (!bibleData) continue

      for (const [bookId, chapters] of Object.entries(bibleData.books)) {
        // Filter by testament if specified
        if (testament !== "both") {
          const bookInfo = this.getBookInfo(bookId)
          if (bookInfo.testament !== testament) continue
        }

        // Filter by specific books if specified
        if (books.length > 0 && !books.includes(bookId)) continue

        for (const [chapterNum, verses] of Object.entries(chapters)) {
          for (const [verseNum, text] of Object.entries(verses)) {
            const lowerText = (text as string).toLowerCase()

            // Calculate relevance score
            let relevance = 0
            const highlights: string[] = []

            for (const term of searchTerms) {
              const regex = new RegExp(term, "gi")
              const matches = lowerText.match(regex)
              if (matches) {
                relevance += matches.length * (term.length / 3)
                highlights.push(...matches)
              }
            }

            if (relevance > 0) {
              const bookInfo = this.getBookInfo(bookId)

              results.push({
                book: bookId,
                bookName: bookInfo.name,
                chapter: Number.parseInt(chapterNum),
                verse: Number.parseInt(verseNum),
                text: text as string,
                translation: translationId.toUpperCase(),
                testament: bookInfo.testament,
                relevance,
                context: includeContext
                  ? await this.getVerseContext(
                      translationId,
                      bookId,
                      Number.parseInt(chapterNum),
                      Number.parseInt(verseNum),
                    )
                  : "",
                highlights: [...new Set(highlights)],
              })
            }
          }
        }
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit)
  }

  // Get comprehensive Bible statistics
  async getBibleStats(): Promise<BibleStats> {
    try {
      const translations = Object.keys(this.TRANSLATIONS)
      let totalVerses = 0
      let totalChapters = 0
      const availableLanguages = new Set<string>()

      for (const translationId of translations) {
        const translation = this.TRANSLATIONS[translationId]
        availableLanguages.add(translation.language)

        // Estimate verses (actual count would come from blob data)
        totalVerses += 31102 // Standard Bible verse count
        totalChapters += 1189 // Standard Bible chapter count
      }

      return {
        totalTranslations: translations.length,
        totalBooks: 66,
        totalChapters,
        totalVerses,
        availableLanguages: Array.from(availableLanguages),
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error getting Bible stats:", error)
      return {
        totalTranslations: 10,
        totalBooks: 66,
        totalChapters: 1189,
        totalVerses: 311020,
        availableLanguages: ["en"],
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  // Get available translations with metadata
  getAvailableTranslations(): BibleTranslation[] {
    return Object.values(this.TRANSLATIONS)
  }

  // Get translations by category
  getTranslationsByCategory(category: BibleTranslation["category"]): BibleTranslation[] {
    return Object.values(this.TRANSLATIONS).filter((t) => t.category === category)
  }

  // Get daily verse with enhanced selection
  async getDailyVerse(translationId = "kjv"): Promise<BibleVerse | null> {
    const inspirationalVerses = [
      { book: "john", chapter: 3, verse: 16 },
      { book: "romans", chapter: 8, verse: 28 },
      { book: "philippians", chapter: 4, verse: 13 },
      { book: "jeremiah", chapter: 29, verse: 11 },
      { book: "psalms", chapter: 23, verse: 1 },
      { book: "isaiah", chapter: 40, verse: 31 },
      { book: "proverbs", chapter: 3, verse: 5 },
      { book: "matthew", chapter: 6, verse: 33 },
      { book: "1peter", chapter: 5, verse: 7 },
      { book: "ephesians", chapter: 2, verse: 8 },
      { book: "psalms", chapter: 46, verse: 10 },
      { book: "romans", chapter: 12, verse: 2 },
      { book: "joshua", chapter: 1, verse: 9 },
      { book: "2timothy", chapter: 1, verse: 7 },
      { book: "matthew", chapter: 11, verse: 28 },
      { book: "1corinthians", chapter: 13, verse: 4 },
      { book: "psalms", chapter: 119, verse: 105 },
      { book: "romans", chapter: 15, verse: 13 },
      { book: "james", chapter: 1, verse: 17 },
      { book: "1john", chapter: 4, verse: 19 },
    ]

    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedVerse = inspirationalVerses[dayOfYear % inspirationalVerses.length]

    return await this.getVerse(translationId, selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)
  }

  // Helper methods
  private async getBibleData(translationId: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(translationId)
    const cacheTime = this.cacheExpiry.get(translationId)
    if (cached && cacheTime && Date.now() < cacheTime) {
      return cached
    }

    try {
      // Try to fetch from blob storage
      const response = await fetch(`https://blob.vercel-storage.com/bibles/${translationId}.json`)
      if (response.ok) {
        const data = await response.json()
        this.cache.set(translationId, data)
        this.cacheExpiry.set(translationId, Date.now() + this.CACHE_DURATION)
        return data
      }
    } catch (error) {
      console.error(`Error fetching ${translationId}:`, error)
    }

    // Return fallback data
    return this.getFallbackData(translationId)
  }

  private async getVerse(
    translationId: string,
    book: string,
    chapter: number,
    verse: number,
  ): Promise<BibleVerse | null> {
    const bibleData = await this.getBibleData(translationId)
    if (!bibleData?.books?.[book]?.[chapter]?.[verse]) {
      return null
    }

    const bookInfo = this.getBookInfo(book)
    return {
      book,
      bookName: bookInfo.name,
      chapter,
      verse,
      text: bibleData.books[book][chapter][verse],
      translation: translationId.toUpperCase(),
      testament: bookInfo.testament,
    }
  }

  private async getVerseContext(translationId: string, book: string, chapter: number, verse: number): Promise<string> {
    const bibleData = await this.getBibleData(translationId)
    if (!bibleData?.books?.[book]?.[chapter]) return ""

    const verses = bibleData.books[book][chapter]
    const contextVerses: string[] = []

    // Get 1 verse before and after for context
    for (let v = Math.max(1, verse - 1); v <= Math.min(Object.keys(verses).length, verse + 1); v++) {
      if (verses[v] && v !== verse) {
        contextVerses.push(`${v}: ${verses[v]}`)
      }
    }

    return contextVerses.join(" ")
  }

  private getBookInfo(bookId: string): { name: string; testament: "old" | "new" } {
    const bookMap: Record<string, { name: string; testament: "old" | "new" }> = {
      genesis: { name: "Genesis", testament: "old" },
      exodus: { name: "Exodus", testament: "old" },
      leviticus: { name: "Leviticus", testament: "old" },
      numbers: { name: "Numbers", testament: "old" },
      deuteronomy: { name: "Deuteronomy", testament: "old" },
      joshua: { name: "Joshua", testament: "old" },
      judges: { name: "Judges", testament: "old" },
      ruth: { name: "Ruth", testament: "old" },
      "1samuel": { name: "1 Samuel", testament: "old" },
      "2samuel": { name: "2 Samuel", testament: "old" },
      "1kings": { name: "1 Kings", testament: "old" },
      "2kings": { name: "2 Kings", testament: "old" },
      "1chronicles": { name: "1 Chronicles", testament: "old" },
      "2chronicles": { name: "2 Chronicles", testament: "old" },
      ezra: { name: "Ezra", testament: "old" },
      nehemiah: { name: "Nehemiah", testament: "old" },
      esther: { name: "Esther", testament: "old" },
      job: { name: "Job", testament: "old" },
      psalms: { name: "Psalms", testament: "old" },
      proverbs: { name: "Proverbs", testament: "old" },
      ecclesiastes: { name: "Ecclesiastes", testament: "old" },
      songofsolomon: { name: "Song of Solomon", testament: "old" },
      isaiah: { name: "Isaiah", testament: "old" },
      jeremiah: { name: "Jeremiah", testament: "old" },
      lamentations: { name: "Lamentations", testament: "old" },
      ezekiel: { name: "Ezekiel", testament: "old" },
      daniel: { name: "Daniel", testament: "old" },
      hosea: { name: "Hosea", testament: "old" },
      joel: { name: "Joel", testament: "old" },
      amos: { name: "Amos", testament: "old" },
      obadiah: { name: "Obadiah", testament: "old" },
      jonah: { name: "Jonah", testament: "old" },
      micah: { name: "Micah", testament: "old" },
      nahum: { name: "Nahum", testament: "old" },
      habakkuk: { name: "Habakkuk", testament: "old" },
      zephaniah: { name: "Zephaniah", testament: "old" },
      haggai: { name: "Haggai", testament: "old" },
      zechariah: { name: "Zechariah", testament: "old" },
      malachi: { name: "Malachi", testament: "old" },
      matthew: { name: "Matthew", testament: "new" },
      mark: { name: "Mark", testament: "new" },
      luke: { name: "Luke", testament: "new" },
      john: { name: "John", testament: "new" },
      acts: { name: "Acts", testament: "new" },
      romans: { name: "Romans", testament: "new" },
      "1corinthians": { name: "1 Corinthians", testament: "new" },
      "2corinthians": { name: "2 Corinthians", testament: "new" },
      galatians: { name: "Galatians", testament: "new" },
      ephesians: { name: "Ephesians", testament: "new" },
      philippians: { name: "Philippians", testament: "new" },
      colossians: { name: "Colossians", testament: "new" },
      "1thessalonians": { name: "1 Thessalonians", testament: "new" },
      "2thessalonians": { name: "2 Thessalonians", testament: "new" },
      "1timothy": { name: "1 Timothy", testament: "new" },
      "2timothy": { name: "2 Timothy", testament: "new" },
      titus: { name: "Titus", testament: "new" },
      philemon: { name: "Philemon", testament: "new" },
      hebrews: { name: "Hebrews", testament: "new" },
      james: { name: "James", testament: "new" },
      "1peter": { name: "1 Peter", testament: "new" },
      "2peter": { name: "2 Peter", testament: "new" },
      "1john": { name: "1 John", testament: "new" },
      "2john": { name: "2 John", testament: "new" },
      "3john": { name: "3 John", testament: "new" },
      jude: { name: "Jude", testament: "new" },
      revelation: { name: "Revelation", testament: "new" },
    }

    return bookMap[bookId] || { name: bookId, testament: "old" }
  }

  private getFallbackData(translationId: string): any {
    // Return sample data for development
    return {
      translation: this.TRANSLATIONS[translationId] || this.TRANSLATIONS.kjv,
      books: {
        john: {
          3: {
            16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          },
        },
        psalms: {
          23: {
            1: "The LORD is my shepherd; I shall not want.",
          },
        },
      },
      metadata: {
        totalVerses: 31102,
        totalChapters: 1189,
        downloadDate: new Date().toISOString(),
        source: "fallback-data",
      },
    }
  }
}

export const enhancedBibleService = new EnhancedBibleService()
