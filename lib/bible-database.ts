// Bible database schema and management system
export interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  description: string
  copyright: string
  isPublicDomain: boolean
  year?: number
  source?: string
}

export interface BibleBook {
  id: string
  name: string
  abbreviation: string
  testament: "old" | "new"
  order: number
  chapters: number
}

export interface BibleVerse {
  id: string
  translationId: string
  bookId: string
  chapter: number
  verse: number
  text: string
}

export interface BibleChapterData {
  translationId: string
  bookId: string
  chapter: number
  verses: Array<{
    verse: number
    text: string
  }>
}

// Bible books data
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: "gen", name: "Genesis", abbreviation: "Gen", testament: "old", order: 1, chapters: 50 },
  { id: "exo", name: "Exodus", abbreviation: "Exo", testament: "old", order: 2, chapters: 40 },
  { id: "lev", name: "Leviticus", abbreviation: "Lev", testament: "old", order: 3, chapters: 27 },
  { id: "num", name: "Numbers", abbreviation: "Num", testament: "old", order: 4, chapters: 36 },
  { id: "deu", name: "Deuteronomy", abbreviation: "Deu", testament: "old", order: 5, chapters: 34 },
  { id: "jos", name: "Joshua", abbreviation: "Jos", testament: "old", order: 6, chapters: 24 },
  { id: "jdg", name: "Judges", abbreviation: "Jdg", testament: "old", order: 7, chapters: 21 },
  { id: "rut", name: "Ruth", abbreviation: "Rut", testament: "old", order: 8, chapters: 4 },
  { id: "1sa", name: "1 Samuel", abbreviation: "1Sa", testament: "old", order: 9, chapters: 31 },
  { id: "2sa", name: "2 Samuel", abbreviation: "2Sa", testament: "old", order: 10, chapters: 24 },
  { id: "1ki", name: "1 Kings", abbreviation: "1Ki", testament: "old", order: 11, chapters: 22 },
  { id: "2ki", name: "2 Kings", abbreviation: "2Ki", testament: "old", order: 12, chapters: 25 },
  { id: "1ch", name: "1 Chronicles", abbreviation: "1Ch", testament: "old", order: 13, chapters: 29 },
  { id: "2ch", name: "2 Chronicles", abbreviation: "2Ch", testament: "old", order: 14, chapters: 36 },
  { id: "ezr", name: "Ezra", abbreviation: "Ezr", testament: "old", order: 15, chapters: 10 },
  { id: "neh", name: "Nehemiah", abbreviation: "Neh", testament: "old", order: 16, chapters: 13 },
  { id: "est", name: "Esther", abbreviation: "Est", testament: "old", order: 17, chapters: 10 },
  { id: "job", name: "Job", abbreviation: "Job", testament: "old", order: 18, chapters: 42 },
  { id: "psa", name: "Psalms", abbreviation: "Psa", testament: "old", order: 19, chapters: 150 },
  { id: "pro", name: "Proverbs", abbreviation: "Pro", testament: "old", order: 20, chapters: 31 },
  { id: "ecc", name: "Ecclesiastes", abbreviation: "Ecc", testament: "old", order: 21, chapters: 12 },
  { id: "sng", name: "Song of Solomon", abbreviation: "Sng", testament: "old", order: 22, chapters: 8 },
  { id: "isa", name: "Isaiah", abbreviation: "Isa", testament: "old", order: 23, chapters: 66 },
  { id: "jer", name: "Jeremiah", abbreviation: "Jer", testament: "old", order: 24, chapters: 52 },
  { id: "lam", name: "Lamentations", abbreviation: "Lam", testament: "old", order: 25, chapters: 5 },
  { id: "eze", name: "Ezekiel", abbreviation: "Eze", testament: "old", order: 26, chapters: 48 },
  { id: "dan", name: "Daniel", abbreviation: "Dan", testament: "old", order: 27, chapters: 12 },
  { id: "hos", name: "Hosea", abbreviation: "Hos", testament: "old", order: 28, chapters: 14 },
  { id: "joe", name: "Joel", abbreviation: "Joe", testament: "old", order: 29, chapters: 3 },
  { id: "amo", name: "Amos", abbreviation: "Amo", testament: "old", order: 30, chapters: 9 },
  { id: "oba", name: "Obadiah", abbreviation: "Oba", testament: "old", order: 31, chapters: 1 },
  { id: "jon", name: "Jonah", abbreviation: "Jon", testament: "old", order: 32, chapters: 4 },
  { id: "mic", name: "Micah", abbreviation: "Mic", testament: "old", order: 33, chapters: 7 },
  { id: "nah", name: "Nahum", abbreviation: "Nah", testament: "old", order: 34, chapters: 3 },
  { id: "hab", name: "Habakkuk", abbreviation: "Hab", testament: "old", order: 35, chapters: 3 },
  { id: "zep", name: "Zephaniah", abbreviation: "Zep", testament: "old", order: 36, chapters: 3 },
  { id: "hag", name: "Haggai", abbreviation: "Hag", testament: "old", order: 37, chapters: 2 },
  { id: "zec", name: "Zechariah", abbreviation: "Zec", testament: "old", order: 38, chapters: 14 },
  { id: "mal", name: "Malachi", abbreviation: "Mal", testament: "old", order: 39, chapters: 4 },

  // New Testament
  { id: "mat", name: "Matthew", abbreviation: "Mat", testament: "new", order: 40, chapters: 28 },
  { id: "mar", name: "Mark", abbreviation: "Mar", testament: "new", order: 41, chapters: 16 },
  { id: "luk", name: "Luke", abbreviation: "Luk", testament: "new", order: 42, chapters: 24 },
  { id: "joh", name: "John", abbreviation: "Joh", testament: "new", order: 43, chapters: 21 },
  { id: "act", name: "Acts", abbreviation: "Act", testament: "new", order: 44, chapters: 28 },
  { id: "rom", name: "Romans", abbreviation: "Rom", testament: "new", order: 45, chapters: 16 },
  { id: "1co", name: "1 Corinthians", abbreviation: "1Co", testament: "new", order: 46, chapters: 16 },
  { id: "2co", name: "2 Corinthians", abbreviation: "2Co", testament: "new", order: 47, chapters: 13 },
  { id: "gal", name: "Galatians", abbreviation: "Gal", testament: "new", order: 48, chapters: 6 },
  { id: "eph", name: "Ephesians", abbreviation: "Eph", testament: "new", order: 49, chapters: 6 },
  { id: "phi", name: "Philippians", abbreviation: "Phi", testament: "new", order: 50, chapters: 4 },
  { id: "col", name: "Colossians", abbreviation: "Col", testament: "new", order: 51, chapters: 4 },
  { id: "1th", name: "1 Thessalonians", abbreviation: "1Th", testament: "new", order: 52, chapters: 5 },
  { id: "2th", name: "2 Thessalonians", abbreviation: "2Th", testament: "new", order: 53, chapters: 3 },
  { id: "1ti", name: "1 Timothy", abbreviation: "1Ti", testament: "new", order: 54, chapters: 6 },
  { id: "2ti", name: "2 Timothy", abbreviation: "2Ti", testament: "new", order: 55, chapters: 4 },
  { id: "tit", name: "Titus", abbreviation: "Tit", testament: "new", order: 56, chapters: 3 },
  { id: "phm", name: "Philemon", abbreviation: "Phm", testament: "new", order: 57, chapters: 1 },
  { id: "heb", name: "Hebrews", abbreviation: "Heb", testament: "new", order: 58, chapters: 13 },
  { id: "jas", name: "James", abbreviation: "Jas", testament: "new", order: 59, chapters: 5 },
  { id: "1pe", name: "1 Peter", abbreviation: "1Pe", testament: "new", order: 60, chapters: 5 },
  { id: "2pe", name: "2 Peter", abbreviation: "2Pe", testament: "new", order: 61, chapters: 3 },
  { id: "1jo", name: "1 John", abbreviation: "1Jo", testament: "new", order: 62, chapters: 5 },
  { id: "2jo", name: "2 John", abbreviation: "2Jo", testament: "new", order: 63, chapters: 1 },
  { id: "3jo", name: "3 John", abbreviation: "3Jo", testament: "new", order: 64, chapters: 1 },
  { id: "jud", name: "Jude", abbreviation: "Jud", testament: "new", order: 65, chapters: 1 },
  { id: "rev", name: "Revelation", abbreviation: "Rev", testament: "new", order: 66, chapters: 22 },
]

// Available public domain translations
export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "en",
    description: "The classic 1769 edition of the King James Bible",
    copyright: "Public Domain",
    isPublicDomain: true,
    year: 1769,
    source: "https://www.sacred-texts.com/bib/kjv/",
  },
  {
    id: "asv",
    name: "American Standard Version",
    abbreviation: "ASV",
    language: "en",
    description: "The 1901 American Standard Version",
    copyright: "Public Domain",
    isPublicDomain: true,
    year: 1901,
    source: "https://www.sacred-texts.com/bib/asv/",
  },
  {
    id: "web",
    name: "World English Bible",
    abbreviation: "WEB",
    language: "en",
    description: "A modern public domain translation",
    copyright: "Public Domain",
    isPublicDomain: true,
    year: 2000,
    source: "https://worldenglishbible.org/",
  },
  {
    id: "ylt",
    name: "Young's Literal Translation",
    abbreviation: "YLT",
    language: "en",
    description: "A literal translation by Robert Young",
    copyright: "Public Domain",
    isPublicDomain: true,
    year: 1898,
    source: "https://www.sacred-texts.com/bib/ylt/",
  },
  {
    id: "darby",
    name: "Darby Translation",
    abbreviation: "DARBY",
    language: "en",
    description: "Translation by John Nelson Darby",
    copyright: "Public Domain",
    isPublicDomain: true,
    year: 1890,
    source: "https://www.sacred-texts.com/bib/dar/",
  },
]

export class BibleDatabase {
  private verses: Map<string, BibleVerse> = new Map()
  private translations: Map<string, BibleTranslation> = new Map()
  private books: Map<string, BibleBook> = new Map()

  constructor() {
    this.initializeBooks()
    this.initializeTranslations()
  }

  private initializeBooks() {
    for (const book of BIBLE_BOOKS) {
      this.books.set(book.id, book)
    }
  }

  private initializeTranslations() {
    for (const translation of BIBLE_TRANSLATIONS) {
      this.translations.set(translation.id, translation)
    }
  }

  // Get verse key for indexing
  private getVerseKey(translationId: string, bookId: string, chapter: number, verse: number): string {
    return `${translationId}:${bookId}:${chapter}:${verse}`
  }

  // Add verse to database
  addVerse(translationId: string, bookId: string, chapter: number, verse: number, text: string): void {
    const key = this.getVerseKey(translationId, bookId, chapter, verse)
    const verseData: BibleVerse = {
      id: key,
      translationId,
      bookId,
      chapter,
      verse,
      text: text.trim(),
    }
    this.verses.set(key, verseData)
  }

  // Get single verse
  getVerse(translationId: string, bookId: string, chapter: number, verse: number): BibleVerse | null {
    const key = this.getVerseKey(translationId, bookId, chapter, verse)
    return this.verses.get(key) || null
  }

  // Get entire chapter
  getChapter(translationId: string, bookId: string, chapter: number): BibleChapterData | null {
    const book = this.books.get(bookId)
    if (!book || chapter < 1 || chapter > book.chapters) {
      return null
    }

    const verses: Array<{ verse: number; text: string }> = []

    // Find all verses for this chapter
    for (const [key, verseData] of this.verses) {
      if (verseData.translationId === translationId && verseData.bookId === bookId && verseData.chapter === chapter) {
        verses.push({
          verse: verseData.verse,
          text: verseData.text,
        })
      }
    }

    if (verses.length === 0) {
      return null
    }

    // Sort verses by verse number
    verses.sort((a, b) => a.verse - b.verse)

    return {
      translationId,
      bookId,
      chapter,
      verses,
    }
  }

  // Search verses
  searchVerses(query: string, translationId?: string, limit = 50): BibleVerse[] {
    const results: BibleVerse[] = []
    const searchTerm = query.toLowerCase()

    for (const [key, verse] of this.verses) {
      if (translationId && verse.translationId !== translationId) {
        continue
      }

      if (verse.text.toLowerCase().includes(searchTerm)) {
        results.push(verse)
        if (results.length >= limit) {
          break
        }
      }
    }

    return results
  }

  // Get all translations
  getTranslations(): BibleTranslation[] {
    return Array.from(this.translations.values())
  }

  // Get all books
  getBooks(): BibleBook[] {
    return Array.from(this.books.values()).sort((a, b) => a.order - b.order)
  }

  // Get book by ID or name
  getBook(identifier: string): BibleBook | null {
    // Try by ID first
    const byId = this.books.get(identifier.toLowerCase())
    if (byId) return byId

    // Try by name
    for (const book of this.books.values()) {
      if (
        book.name.toLowerCase() === identifier.toLowerCase() ||
        book.abbreviation.toLowerCase() === identifier.toLowerCase()
      ) {
        return book
      }
    }

    return null
  }

  // Get statistics
  getStats(): {
    translations: number
    books: number
    verses: number
    translationStats: Array<{ translation: string; verses: number }>
  } {
    const translationCounts = new Map<string, number>()

    for (const verse of this.verses.values()) {
      const current = translationCounts.get(verse.translationId) || 0
      translationCounts.set(verse.translationId, current + 1)
    }

    const translationStats = Array.from(translationCounts.entries()).map(([translation, verses]) => ({
      translation,
      verses,
    }))

    return {
      translations: this.translations.size,
      books: this.books.size,
      verses: this.verses.size,
      translationStats,
    }
  }

  // Clear all data
  clear(): void {
    this.verses.clear()
  }

  // Export data as JSON
  exportData(): {
    translations: BibleTranslation[]
    books: BibleBook[]
    verses: BibleVerse[]
  } {
    return {
      translations: Array.from(this.translations.values()),
      books: Array.from(this.books.values()),
      verses: Array.from(this.verses.values()),
    }
  }

  // Import data from JSON
  importData(data: {
    translations?: BibleTranslation[]
    books?: BibleBook[]
    verses?: BibleVerse[]
  }): void {
    if (data.translations) {
      for (const translation of data.translations) {
        this.translations.set(translation.id, translation)
      }
    }

    if (data.books) {
      for (const book of data.books) {
        this.books.set(book.id, book)
      }
    }

    if (data.verses) {
      for (const verse of data.verses) {
        this.verses.set(verse.id, verse)
      }
    }
  }
}

// Export singleton instance
export const bibleDatabase = new BibleDatabase()
