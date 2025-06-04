import { put, list } from "@vercel/blob"

export interface BibleTranslationData {
  translation: {
    id: string
    name: string
    abbreviation: string
    language: string
    year: number
    copyright: string
    isPublicDomain: boolean
  }
  books: Record<string, Record<number, Record<number, string>>> // book -> chapter -> verse -> text
  metadata: {
    totalVerses: number
    totalChapters: number
    downloadDate: string
    source: string
  }
}

export interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

export interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
  translation: string
}

export interface BibleBook {
  name: string
  chapters: number
  testament: "old" | "new"
}

class BibleBlobService {
  private cache = new Map<string, BibleTranslationData>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  // Bible book information
  private readonly BIBLE_BOOKS: Record<string, BibleBook> = {
    // Old Testament
    genesis: { name: "Genesis", chapters: 50, testament: "old" },
    exodus: { name: "Exodus", chapters: 40, testament: "old" },
    leviticus: { name: "Leviticus", chapters: 27, testament: "old" },
    numbers: { name: "Numbers", chapters: 36, testament: "old" },
    deuteronomy: { name: "Deuteronomy", chapters: 34, testament: "old" },
    joshua: { name: "Joshua", chapters: 24, testament: "old" },
    judges: { name: "Judges", chapters: 21, testament: "old" },
    ruth: { name: "Ruth", chapters: 4, testament: "old" },
    "1samuel": { name: "1 Samuel", chapters: 31, testament: "old" },
    "2samuel": { name: "2 Samuel", chapters: 24, testament: "old" },
    "1kings": { name: "1 Kings", chapters: 22, testament: "old" },
    "2kings": { name: "2 Kings", chapters: 25, testament: "old" },
    "1chronicles": { name: "1 Chronicles", chapters: 29, testament: "old" },
    "2chronicles": { name: "2 Chronicles", chapters: 36, testament: "old" },
    ezra: { name: "Ezra", chapters: 10, testament: "old" },
    nehemiah: { name: "Nehemiah", chapters: 13, testament: "old" },
    esther: { name: "Esther", chapters: 10, testament: "old" },
    job: { name: "Job", chapters: 42, testament: "old" },
    psalms: { name: "Psalms", chapters: 150, testament: "old" },
    proverbs: { name: "Proverbs", chapters: 31, testament: "old" },
    ecclesiastes: { name: "Ecclesiastes", chapters: 12, testament: "old" },
    songofsolomon: { name: "Song of Solomon", chapters: 8, testament: "old" },
    isaiah: { name: "Isaiah", chapters: 66, testament: "old" },
    jeremiah: { name: "Jeremiah", chapters: 52, testament: "old" },
    lamentations: { name: "Lamentations", chapters: 5, testament: "old" },
    ezekiel: { name: "Ezekiel", chapters: 48, testament: "old" },
    daniel: { name: "Daniel", chapters: 12, testament: "old" },
    hosea: { name: "Hosea", chapters: 14, testament: "old" },
    joel: { name: "Joel", chapters: 3, testament: "old" },
    amos: { name: "Amos", chapters: 9, testament: "old" },
    obadiah: { name: "Obadiah", chapters: 1, testament: "old" },
    jonah: { name: "Jonah", chapters: 4, testament: "old" },
    micah: { name: "Micah", chapters: 7, testament: "old" },
    nahum: { name: "Nahum", chapters: 3, testament: "old" },
    habakkuk: { name: "Habakkuk", chapters: 3, testament: "old" },
    zephaniah: { name: "Zephaniah", chapters: 3, testament: "old" },
    haggai: { name: "Haggai", chapters: 2, testament: "old" },
    zechariah: { name: "Zechariah", chapters: 14, testament: "old" },
    malachi: { name: "Malachi", chapters: 4, testament: "old" },

    // New Testament
    matthew: { name: "Matthew", chapters: 28, testament: "new" },
    mark: { name: "Mark", chapters: 16, testament: "new" },
    luke: { name: "Luke", chapters: 24, testament: "new" },
    john: { name: "John", chapters: 21, testament: "new" },
    acts: { name: "Acts", chapters: 28, testament: "new" },
    romans: { name: "Romans", chapters: 16, testament: "new" },
    "1corinthians": { name: "1 Corinthians", chapters: 16, testament: "new" },
    "2corinthians": { name: "2 Corinthians", chapters: 13, testament: "new" },
    galatians: { name: "Galatians", chapters: 6, testament: "new" },
    ephesians: { name: "Ephesians", chapters: 6, testament: "new" },
    philippians: { name: "Philippians", chapters: 4, testament: "new" },
    colossians: { name: "Colossians", chapters: 4, testament: "new" },
    "1thessalonians": { name: "1 Thessalonians", chapters: 5, testament: "new" },
    "2thessalonians": { name: "2 Thessalonians", chapters: 3, testament: "new" },
    "1timothy": { name: "1 Timothy", chapters: 6, testament: "new" },
    "2timothy": { name: "2 Timothy", chapters: 4, testament: "new" },
    titus: { name: "Titus", chapters: 3, testament: "new" },
    philemon: { name: "Philemon", chapters: 1, testament: "new" },
    hebrews: { name: "Hebrews", chapters: 13, testament: "new" },
    james: { name: "James", chapters: 5, testament: "new" },
    "1peter": { name: "1 Peter", chapters: 5, testament: "new" },
    "2peter": { name: "2 Peter", chapters: 3, testament: "new" },
    "1john": { name: "1 John", chapters: 5, testament: "new" },
    "2john": { name: "2 John", chapters: 1, testament: "new" },
    "3john": { name: "3 John", chapters: 1, testament: "new" },
    jude: { name: "Jude", chapters: 1, testament: "new" },
    revelation: { name: "Revelation", chapters: 22, testament: "new" },
  }

  // Check if blob storage is configured
  private isBlobConfigured(): boolean {
    return typeof process !== "undefined" && process.env && !!process.env.BLOB_READ_WRITE_TOKEN
  }

  // Upload Bible translation to blob storage
  async uploadBibleTranslation(translationId: string, data: BibleTranslationData): Promise<string | null> {
    try {
      if (!this.isBlobConfigured()) {
        console.warn("Blob storage not configured")
        return null
      }

      const filename = `bibles/${translationId}.json`
      const blob = await put(filename, JSON.stringify(data, null, 2), {
        access: "public",
        contentType: "application/json",
      })

      // Update cache
      this.cache.set(translationId, data)
      this.cacheExpiry.set(translationId, Date.now() + this.CACHE_DURATION)

      console.log(`Bible translation ${translationId} uploaded to:`, blob.url)
      return blob.url
    } catch (error) {
      console.error(`Error uploading Bible translation ${translationId}:`, error)
      return null
    }
  }

  // Download Bible translation from blob storage
  async downloadBibleTranslation(translationId: string): Promise<BibleTranslationData | null> {
    try {
      // Check cache first
      const cached = this.cache.get(translationId)
      const cacheTime = this.cacheExpiry.get(translationId)
      if (cached && cacheTime && Date.now() < cacheTime) {
        console.log(`Using cached Bible translation: ${translationId}`)
        return cached
      }

      if (!this.isBlobConfigured()) {
        console.warn("Blob storage not configured, using fallback data")
        return this.getFallbackData(translationId)
      }

      // Try to download from blob storage
      const blobUrl = `https://blob.vercel-storage.com/bibles/${translationId}.json`
      const response = await fetch(blobUrl)

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Bible translation ${translationId} not found in blob storage`)
          return this.getFallbackData(translationId)
        }
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const data: BibleTranslationData = await response.json()

      // Update cache
      this.cache.set(translationId, data)
      this.cacheExpiry.set(translationId, Date.now() + this.CACHE_DURATION)

      console.log(`Downloaded Bible translation: ${translationId} (${data.metadata.totalVerses} verses)`)
      return data
    } catch (error) {
      console.error(`Error downloading Bible translation ${translationId}:`, error)
      return this.getFallbackData(translationId)
    }
  }

  // List all available Bible translations in blob storage
  async listAvailableTranslations(): Promise<string[]> {
    try {
      if (!this.isBlobConfigured()) {
        return ["kjv", "web"] // Fallback translations
      }

      const { blobs } = await list({ prefix: "bibles/" })
      const translations = blobs
        .filter((blob) => blob.pathname.endsWith(".json"))
        .map((blob) => blob.pathname.replace("bibles/", "").replace(".json", ""))

      console.log("Available translations in blob storage:", translations)
      return translations.length > 0 ? translations : ["kjv", "web"]
    } catch (error) {
      console.error("Error listing Bible translations:", error)
      return ["kjv", "web"] // Fallback
    }
  }

  // Get chapter from Bible translation
  async getChapter(translationId: string, book: string, chapter: number): Promise<BibleChapter | null> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData || !bibleData.books[book] || !bibleData.books[book][chapter]) {
        return null
      }

      const chapterData = bibleData.books[book][chapter]
      const verses: BibleVerse[] = Object.entries(chapterData).map(([verseNum, text]) => ({
        book,
        chapter,
        verse: Number.parseInt(verseNum),
        text: text as string,
        translation: bibleData.translation.abbreviation,
      }))

      return {
        book,
        chapter,
        verses: verses.sort((a, b) => a.verse - b.verse),
        translation: bibleData.translation.abbreviation,
      }
    } catch (error) {
      console.error("Error getting chapter:", error)
      return null
    }
  }

  // Get single verse
  async getVerse(translationId: string, book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (
        !bibleData ||
        !bibleData.books[book] ||
        !bibleData.books[book][chapter] ||
        !bibleData.books[book][chapter][verse]
      ) {
        return null
      }

      return {
        book,
        chapter,
        verse,
        text: bibleData.books[book][chapter][verse],
        translation: bibleData.translation.abbreviation,
      }
    } catch (error) {
      console.error("Error getting verse:", error)
      return null
    }
  }

  // Search Bible verses with improved relevance
  async searchBible(translationId: string, query: string, limit = 50): Promise<BibleVerse[]> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData) {
        return []
      }

      const results: Array<BibleVerse & { relevance: number }> = []
      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 2)

      for (const [book, chapters] of Object.entries(bibleData.books)) {
        for (const [chapterNum, verses] of Object.entries(chapters)) {
          for (const [verseNum, text] of Object.entries(verses)) {
            const lowerText = (text as string).toLowerCase()

            // Calculate relevance score
            let relevance = 0
            for (const term of searchTerms) {
              const matches = (lowerText.match(new RegExp(term, "g")) || []).length
              relevance += matches * (term.length / 3) // Longer terms get higher weight
            }

            if (relevance > 0) {
              results.push({
                book,
                chapter: Number.parseInt(chapterNum),
                verse: Number.parseInt(verseNum),
                text: text as string,
                translation: bibleData.translation.abbreviation,
                relevance,
              })
            }
          }
        }
      }

      // Sort by relevance and return top results
      return results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit)
        .map(({ relevance, ...verse }) => verse)
    } catch (error) {
      console.error("Error searching Bible:", error)
      return []
    }
  }

  // Get daily verse
  async getDailyVerse(translationId = "kjv"): Promise<BibleVerse | null> {
    try {
      const popularVerses = [
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
      ]

      // Select verse based on day of year for consistency
      const today = new Date()
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
      const selectedVerse = popularVerses[dayOfYear % popularVerses.length]

      return await this.getVerse(translationId, selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)
    } catch (error) {
      console.error("Error getting daily verse:", error)
      return null
    }
  }

  // Get random verse
  async getRandomVerse(translationId = "kjv"): Promise<BibleVerse | null> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData) {
        return null
      }

      const books = Object.keys(bibleData.books)
      const randomBook = books[Math.floor(Math.random() * books.length)]
      const chapters = Object.keys(bibleData.books[randomBook])
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)]
      const verses = Object.keys(bibleData.books[randomBook][Number.parseInt(randomChapter)])
      const randomVerse = verses[Math.floor(Math.random() * verses.length)]

      return await this.getVerse(
        translationId,
        randomBook,
        Number.parseInt(randomChapter),
        Number.parseInt(randomVerse),
      )
    } catch (error) {
      console.error("Error getting random verse:", error)
      return null
    }
  }

  // Get all books for a translation
  async getBooks(translationId: string): Promise<Array<BibleBook & { id: string }>> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData) {
        return []
      }

      const availableBooks = Object.keys(bibleData.books)
      return availableBooks
        .map((bookId) => ({
          id: bookId,
          ...this.BIBLE_BOOKS[bookId],
        }))
        .filter((book) => book.name) // Filter out unknown books
    } catch (error) {
      console.error("Error getting books:", error)
      return []
    }
  }

  // Get fallback data when blob storage is not available
  private getFallbackData(translationId: string): BibleTranslationData | null {
    if (translationId === "kjv") {
      return {
        translation: {
          id: "kjv",
          name: "King James Version",
          abbreviation: "KJV",
          language: "en",
          year: 1769,
          copyright: "Public Domain",
          isPublicDomain: true,
        },
        books: {
          john: {
            3: {
              16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
              17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
            },
          },
          psalms: {
            23: {
              1: "The LORD is my shepherd; I shall not want.",
              2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
              3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
              4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
            },
          },
        },
        metadata: {
          totalVerses: 6,
          totalChapters: 2,
          downloadDate: new Date().toISOString(),
          source: "fallback-data",
        },
      }
    }

    return null
  }

  // Get Bible statistics
  async getBibleStats(): Promise<any> {
    try {
      const translations = await this.listAvailableTranslations()
      let totalVerses = 0
      let totalChapters = 0
      let totalBooks = 0
      const availableBooks = new Set<string>()

      for (const translationId of translations) {
        const bibleData = await this.downloadBibleTranslation(translationId)
        if (bibleData) {
          totalVerses += bibleData.metadata.totalVerses
          totalChapters += bibleData.metadata.totalChapters
          totalBooks = Math.max(totalBooks, Object.keys(bibleData.books).length)
          Object.keys(bibleData.books).forEach((book) => availableBooks.add(book))
        }
      }

      return {
        totalTranslations: translations.length,
        totalBooks,
        totalChapters,
        totalVerses,
        lastUpdated: new Date().toISOString(),
        availableBooks: Array.from(availableBooks).sort(),
      }
    } catch (error) {
      console.error("Error getting Bible stats:", error)
      return {
        totalTranslations: 1,
        totalBooks: 66,
        totalChapters: 1189,
        totalVerses: 31102,
        lastUpdated: new Date().toISOString(),
        availableBooks: Object.keys(this.BIBLE_BOOKS),
      }
    }
  }
}

export const bibleBlobService = new BibleBlobService()
