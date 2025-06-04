// Local Bible service using our own database
import { bibleDatabase, type BibleChapterData, type BibleTranslation } from "./bible-database"

interface BibleSearchResult {
  reference: string
  text: string
  translation: string
  book: string
  chapter: number
  verse: number
}

export class BibleLocalService {
  private isInitialized = false

  constructor() {
    this.initializeDatabase()
  }

  private async initializeDatabase(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Try to load Bible data from public files
      await this.loadBibleData()
      this.isInitialized = true
      console.log("Bible database initialized:", bibleDatabase.getStats())
    } catch (error) {
      console.error("Error initializing Bible database:", error)
      // Create minimal sample data
      this.createMinimalSampleData()
      this.isInitialized = true
    }
  }

  private async loadBibleData(): Promise<void> {
    try {
      // Try to load KJV data
      const kjvResponse = await fetch("/data/bibles/kjv.json")
      if (kjvResponse.ok) {
        const kjvData = await kjvResponse.json()
        this.importBibleData(kjvData)
        console.log("Loaded KJV Bible data")
      }
    } catch (error) {
      console.log("Could not load KJV data:", error)
    }

    try {
      // Try to load sample data
      const sampleResponse = await fetch("/data/bibles/kjv-sample.json")
      if (sampleResponse.ok) {
        const sampleData = await sampleResponse.json()
        this.importBibleData(sampleData)
        console.log("Loaded sample Bible data")
      }
    } catch (error) {
      console.log("Could not load sample data:", error)
    }
  }

  private importBibleData(data: any): void {
    if (data.verses && Array.isArray(data.verses)) {
      for (const verse of data.verses) {
        bibleDatabase.addVerse(verse.translationId, verse.bookId, verse.chapter, verse.verse, verse.text)
      }
    }
  }

  private createMinimalSampleData(): void {
    // Create essential verses for testing
    const essentialVerses = [
      {
        translationId: "kjv",
        bookId: "joh",
        chapter: 3,
        verse: 16,
        text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      },
      {
        translationId: "kjv",
        bookId: "psa",
        chapter: 23,
        verse: 1,
        text: "The LORD is my shepherd; I shall not want.",
      },
      {
        translationId: "kjv",
        bookId: "rom",
        chapter: 8,
        verse: 28,
        text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      },
    ]

    for (const verse of essentialVerses) {
      bibleDatabase.addVerse(verse.translationId, verse.bookId, verse.chapter, verse.verse, verse.text)
    }

    console.log("Created minimal sample Bible data")
  }

  // Get available translations
  getAvailableTranslations(): BibleTranslation[] {
    return bibleDatabase.getTranslations()
  }

  // Get chapter
  async getChapter(book: string, chapter: number, translation = "kjv"): Promise<BibleChapterData | null> {
    await this.initializeDatabase()

    const bookData = bibleDatabase.getBook(book)
    if (!bookData) {
      console.error(`Book not found: ${book}`)
      return null
    }

    const chapterData = bibleDatabase.getChapter(translation, bookData.id, chapter)
    if (!chapterData) {
      console.error(`Chapter not found: ${book} ${chapter} (${translation})`)
      return null
    }

    return chapterData
  }

  // Get single verse
  async getVerse(reference: string, translation = "kjv"): Promise<BibleSearchResult | null> {
    await this.initializeDatabase()

    const parsed = this.parseReference(reference)
    if (!parsed) {
      return null
    }

    const bookData = bibleDatabase.getBook(parsed.book)
    if (!bookData) {
      return null
    }

    const verse = bibleDatabase.getVerse(translation, bookData.id, parsed.chapter, parsed.verse)
    if (!verse) {
      return null
    }

    return {
      reference,
      text: verse.text,
      translation: verse.translationId.toUpperCase(),
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
    }
  }

  // Search verses
  async searchBible(query: string, translation = "kjv", limit = 50): Promise<BibleSearchResult[]> {
    await this.initializeDatabase()

    const verses = bibleDatabase.searchVerses(query, translation, limit)
    const results: BibleSearchResult[] = []

    for (const verse of verses) {
      const book = bibleDatabase.getBooks().find((b) => b.id === verse.bookId)
      if (book) {
        results.push({
          reference: `${book.name} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          translation: verse.translationId.toUpperCase(),
          book: book.name,
          chapter: verse.chapter,
          verse: verse.verse,
        })
      }
    }

    return results
  }

  // Get daily verse
  async getDailyVerse(translation = "kjv"): Promise<BibleSearchResult | null> {
    const popularVerses = [
      "John 3:16",
      "Romans 8:28",
      "Philippians 4:13",
      "Jeremiah 29:11",
      "Psalm 23:1",
      "Isaiah 40:31",
      "Proverbs 3:5",
      "Matthew 6:33",
      "1 Peter 5:7",
      "Ephesians 2:8",
    ]

    // Select verse based on day of year for consistency
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedReference = popularVerses[dayOfYear % popularVerses.length]

    return await this.getVerse(selectedReference, translation)
  }

  // Parse reference like "John 3:16"
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

  // Get all books
  getBooks() {
    return bibleDatabase.getBooks()
  }

  // Get database statistics
  getStats() {
    return bibleDatabase.getStats()
  }

  // Check if database is ready
  isReady(): boolean {
    return this.isInitialized && bibleDatabase.getStats().verses > 0
  }
}

// Export singleton instance
export const bibleLocalService = new BibleLocalService()
