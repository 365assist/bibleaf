// Server-side Bible service with mock data for initial testing
// This will be used by API routes

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
  isPublicDomain: boolean
}

export interface BibleStats {
  totalTranslations: number
  totalBooks: number
  totalChapters: number
  totalVerses: number
  lastUpdated: string
  availableBooks: string[]
}

// Sample data for initial testing
const SAMPLE_TRANSLATIONS: BibleTranslation[] = [
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "en",
    year: 1611,
    copyright: "Public Domain",
    isPublicDomain: true,
  },
  {
    id: "web",
    name: "World English Bible",
    abbreviation: "WEB",
    language: "en",
    year: 2000,
    copyright: "Public Domain",
    isPublicDomain: true,
  },
]

// Sample verses for testing
const SAMPLE_VERSES: BibleVerse[] = [
  {
    book: "John",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    translation: "KJV",
  },
  {
    book: "John",
    chapter: 3,
    verse: 17,
    text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
    translation: "KJV",
  },
  {
    book: "Psalm",
    chapter: 23,
    verse: 1,
    text: "The LORD is my shepherd; I shall not want.",
    translation: "KJV",
  },
  {
    book: "Psalm",
    chapter: 23,
    verse: 2,
    text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    translation: "KJV",
  },
  {
    book: "Romans",
    chapter: 8,
    verse: 28,
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    translation: "KJV",
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    text: "I can do all things through Christ which strengtheneth me.",
    translation: "KJV",
  },
  {
    book: "Genesis",
    chapter: 1,
    verse: 1,
    text: "In the beginning God created the heaven and the earth.",
    translation: "KJV",
  },
  {
    book: "Matthew",
    chapter: 5,
    verse: 3,
    text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
    translation: "KJV",
  },
  {
    book: "1 Corinthians",
    chapter: 13,
    verse: 4,
    text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
    translation: "KJV",
  },
  {
    book: "1 Corinthians",
    chapter: 13,
    verse: 13,
    text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    translation: "KJV",
  },
]

// Available books in our sample
const AVAILABLE_BOOKS = Array.from(new Set(SAMPLE_VERSES.map((v) => v.book))).sort()

class BibleServerService {
  // Get available translations
  getAvailableTranslations(): BibleTranslation[] {
    return SAMPLE_TRANSLATIONS
  }

  // Get Bible statistics
  getBibleStats(): BibleStats {
    return {
      totalTranslations: SAMPLE_TRANSLATIONS.length,
      totalBooks: AVAILABLE_BOOKS.length,
      totalChapters: Array.from(new Set(SAMPLE_VERSES.map((v) => `${v.book}-${v.chapter}`))).length,
      totalVerses: SAMPLE_VERSES.length,
      lastUpdated: new Date().toISOString(),
      availableBooks: AVAILABLE_BOOKS,
    }
  }

  // Get chapter
  getChapter(book: string, chapter: number, translation = "KJV"): BibleChapter | null {
    const verses = SAMPLE_VERSES.filter(
      (v) =>
        v.book.toLowerCase() === book.toLowerCase() &&
        v.chapter === chapter &&
        v.translation.toLowerCase() === translation.toLowerCase(),
    )

    if (verses.length === 0) {
      return null
    }

    return {
      book,
      chapter,
      verses,
      translation,
    }
  }

  // Get verse
  getVerse(book: string, chapter: number, verse: number, translation = "KJV"): BibleVerse | null {
    return (
      SAMPLE_VERSES.find(
        (v) =>
          v.book.toLowerCase() === book.toLowerCase() &&
          v.chapter === chapter &&
          v.verse === verse &&
          v.translation.toLowerCase() === translation.toLowerCase(),
      ) || null
    )
  }

  // Search Bible
  searchBible(query: string, translation = "KJV", limit = 20): BibleVerse[] {
    const lowerQuery = query.toLowerCase()
    return SAMPLE_VERSES.filter(
      (v) => v.translation.toLowerCase() === translation.toLowerCase() && v.text.toLowerCase().includes(lowerQuery),
    ).slice(0, limit)
  }

  // Get daily verse
  getDailyVerse(translation = "KJV"): BibleVerse | null {
    const filteredVerses = SAMPLE_VERSES.filter((v) => v.translation.toLowerCase() === translation.toLowerCase())

    if (filteredVerses.length === 0) {
      return null
    }

    // Use date to determine which verse to show
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const verseIndex = dayOfYear % filteredVerses.length

    return filteredVerses[verseIndex]
  }

  // Get random verse
  getRandomVerse(translation = "KJV"): BibleVerse | null {
    const filteredVerses = SAMPLE_VERSES.filter((v) => v.translation.toLowerCase() === translation.toLowerCase())

    if (filteredVerses.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * filteredVerses.length)
    return filteredVerses[randomIndex]
  }
}

export const bibleServerService = new BibleServerService()
