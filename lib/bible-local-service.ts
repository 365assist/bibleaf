import fs from "fs"
import path from "path"

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

export interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  year: number
  copyright: string
  filename: string
  available: boolean
}

export interface BibleStats {
  totalTranslations: number
  totalBooks: number
  totalChapters: number
  totalVerses: number
  lastUpdated: string
  availableBooks: string[]
  sampleVerses: Array<{
    book: string
    chapter: number
    verse: number
    text: string
  }>
}

class BibleLocalService {
  private dataDir: string
  private bibleData: Map<string, any> = new Map()
  private translations: BibleTranslation[] = []
  private stats: BibleStats | null = null

  constructor() {
    this.dataDir = path.join(process.cwd(), "data")
    this.loadTranslations()
    this.loadStats()
  }

  private loadTranslations() {
    try {
      const translationsPath = path.join(this.dataDir, "translations.json")
      if (fs.existsSync(translationsPath)) {
        const data = fs.readFileSync(translationsPath, "utf-8")
        this.translations = JSON.parse(data)
      }
    } catch (error) {
      console.warn("Could not load translations index:", error)
      this.translations = []
    }
  }

  private loadStats() {
    try {
      const statsPath = path.join(this.dataDir, "bible-stats.json")
      if (fs.existsSync(statsPath)) {
        const data = fs.readFileSync(statsPath, "utf-8")
        this.stats = JSON.parse(data)
      }
    } catch (error) {
      console.warn("Could not load Bible stats:", error)
      this.stats = null
    }
  }

  private loadBibleData(translationId = "kjv") {
    if (this.bibleData.has(translationId)) {
      return this.bibleData.get(translationId)
    }

    try {
      const translation = this.translations.find((t) => t.id === translationId)
      if (!translation) {
        throw new Error(`Translation ${translationId} not found`)
      }

      const biblePath = path.join(this.dataDir, translation.filename)
      if (!fs.existsSync(biblePath)) {
        throw new Error(`Bible file not found: ${translation.filename}`)
      }

      const data = fs.readFileSync(biblePath, "utf-8")
      const bibleData = JSON.parse(data)
      this.bibleData.set(translationId, bibleData)
      return bibleData
    } catch (error) {
      console.error(`Error loading Bible data for ${translationId}:`, error)
      return null
    }
  }

  async getAvailableTranslations(): Promise<BibleTranslation[]> {
    return this.translations.filter((t) => t.available)
  }

  async getBibleStats(): Promise<BibleStats | null> {
    return this.stats
  }

  async getChapter(book: string, chapter: number, translation = "kjv"): Promise<BibleChapter | null> {
    try {
      const bibleData = this.loadBibleData(translation)
      if (!bibleData || !bibleData.books[book] || !bibleData.books[book][chapter]) {
        return null
      }

      const chapterData = bibleData.books[book][chapter]
      const verses: BibleVerse[] = Object.entries(chapterData).map(([verseNum, text]) => ({
        book,
        chapter,
        verse: Number.parseInt(verseNum),
        text: text as string,
        translation: bibleData.translation,
      }))

      return {
        book,
        chapter,
        verses: verses.sort((a, b) => a.verse - b.verse),
        translation: bibleData.translation,
      }
    } catch (error) {
      console.error("Error getting chapter:", error)
      return null
    }
  }

  async getVerse(book: string, chapter: number, verse: number, translation = "kjv"): Promise<BibleVerse | null> {
    try {
      const bibleData = this.loadBibleData(translation)
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
        translation: bibleData.translation,
      }
    } catch (error) {
      console.error("Error getting verse:", error)
      return null
    }
  }

  async searchBible(query: string, translation = "kjv", limit = 50): Promise<BibleVerse[]> {
    try {
      const bibleData = this.loadBibleData(translation)
      if (!bibleData) {
        return []
      }

      const results: BibleVerse[] = []
      const searchTerm = query.toLowerCase()

      for (const [book, chapters] of Object.entries(bibleData.books)) {
        for (const [chapterNum, verses] of Object.entries(chapters as any)) {
          for (const [verseNum, text] of Object.entries(verses as any)) {
            if ((text as string).toLowerCase().includes(searchTerm)) {
              results.push({
                book,
                chapter: Number.parseInt(chapterNum),
                verse: Number.parseInt(verseNum),
                text: text as string,
                translation: bibleData.translation,
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

  async getDailyVerse(date?: Date): Promise<BibleVerse | null> {
    try {
      if (!this.stats || !this.stats.sampleVerses.length) {
        return null
      }

      // Use date to determine which verse to show
      const today = date || new Date()
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
      const verseIndex = dayOfYear % this.stats.sampleVerses.length
      const sampleVerse = this.stats.sampleVerses[verseIndex]

      return await this.getVerse(sampleVerse.book, sampleVerse.chapter, sampleVerse.verse)
    } catch (error) {
      console.error("Error getting daily verse:", error)
      return null
    }
  }

  async getRandomVerse(translation = "kjv"): Promise<BibleVerse | null> {
    try {
      const bibleData = this.loadBibleData(translation)
      if (!bibleData) {
        return null
      }

      const books = Object.keys(bibleData.books)
      const randomBook = books[Math.floor(Math.random() * books.length)]
      const chapters = Object.keys(bibleData.books[randomBook])
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)]
      const verses = Object.keys(bibleData.books[randomBook][randomChapter])
      const randomVerse = verses[Math.floor(Math.random() * verses.length)]

      return await this.getVerse(randomBook, Number.parseInt(randomChapter), Number.parseInt(randomVerse), translation)
    } catch (error) {
      console.error("Error getting random verse:", error)
      return null
    }
  }

  async getBookList(translation = "kjv"): Promise<string[]> {
    try {
      const bibleData = this.loadBibleData(translation)
      if (!bibleData) {
        return []
      }

      return Object.keys(bibleData.books).sort()
    } catch (error) {
      console.error("Error getting book list:", error)
      return []
    }
  }

  async getChapterList(book: string, translation = "kjv"): Promise<number[]> {
    try {
      const bibleData = this.loadBibleData(translation)
      if (!bibleData || !bibleData.books[book]) {
        return []
      }

      return Object.keys(bibleData.books[book])
        .map((ch) => Number.parseInt(ch))
        .sort((a, b) => a - b)
    } catch (error) {
      console.error("Error getting chapter list:", error)
      return []
    }
  }
}

export const bibleLocalService = new BibleLocalService()
