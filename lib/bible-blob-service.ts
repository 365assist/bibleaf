import { put, list, del } from "@vercel/blob"

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

class BibleBlobService {
  private cache = new Map<string, BibleTranslationData>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

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

      // Download from blob storage
      const response = await fetch(`https://blob.vercel-storage.com/bibles/${translationId}.json`, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      })

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

      console.log(`Downloaded Bible translation: ${translationId}`)
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
      return translations
    } catch (error) {
      console.error("Error listing Bible translations:", error)
      return ["kjv", "web"] // Fallback
    }
  }

  // Delete Bible translation from blob storage
  async deleteBibleTranslation(translationId: string): Promise<boolean> {
    try {
      if (!this.isBlobConfigured()) {
        console.warn("Blob storage not configured")
        return false
      }

      await del(`bibles/${translationId}.json`)

      // Remove from cache
      this.cache.delete(translationId)
      this.cacheExpiry.delete(translationId)

      console.log(`Deleted Bible translation: ${translationId}`)
      return true
    } catch (error) {
      console.error(`Error deleting Bible translation ${translationId}:`, error)
      return false
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

  // Search Bible verses
  async searchBible(translationId: string, query: string, limit = 50): Promise<BibleVerse[]> {
    try {
      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData) {
        return []
      }

      const results: BibleVerse[] = []
      const searchTerm = query.toLowerCase()

      for (const [book, chapters] of Object.entries(bibleData.books)) {
        for (const [chapterNum, verses] of Object.entries(chapters)) {
          for (const [verseNum, text] of Object.entries(verses)) {
            if ((text as string).toLowerCase().includes(searchTerm)) {
              results.push({
                book,
                chapter: Number.parseInt(chapterNum),
                verse: Number.parseInt(verseNum),
                text: text as string,
                translation: bibleData.translation.abbreviation,
              })

              if (results.length >= limit) {
                return results
              }
            }
          }
        }
      }

      return results
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
          romans: {
            8: {
              28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
            },
          },
          philippians: {
            4: {
              13: "I can do all things through Christ which strengtheneth me.",
            },
          },
        },
        metadata: {
          totalVerses: 6,
          totalChapters: 3,
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
        totalBooks: 3,
        totalChapters: 3,
        totalVerses: 6,
        lastUpdated: new Date().toISOString(),
        availableBooks: ["john", "psalms", "romans", "philippians"],
      }
    }
  }
}

export const bibleBlobService = new BibleBlobService()
