// Client-side service for Bible data
// This version doesn't use fs/path which aren't available in the browser

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

// Client-side service that uses fetch API instead of direct file access
class BibleLocalService {
  async getStats(): Promise<BibleStats | null> {
    try {
      const response = await fetch("/api/bible/stats")
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }
      const data = await response.json()
      return data.stats
    } catch (error) {
      console.error("Error fetching Bible stats:", error)
      return null
    }
  }

  async getAvailableTranslations(): Promise<BibleTranslation[]> {
    try {
      const response = await fetch("/api/bible/translations")
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status}`)
      }
      const data = await response.json()
      return data.translations || []
    } catch (error) {
      console.error("Error fetching translations:", error)
      return []
    }
  }

  async getChapter(book: string, chapter: number, translation = "kjv"): Promise<BibleChapter | null> {
    try {
      const response = await fetch(
        `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`,
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch chapter: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching chapter:", error)
      return null
    }
  }

  async getVerse(book: string, chapter: number, verse: number, translation = "kjv"): Promise<BibleVerse | null> {
    try {
      const response = await fetch(
        `/api/bible/verse?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}&translation=${translation}`,
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch verse: ${response.status}`)
      }
      const data = await response.json()
      return data.verse
    } catch (error) {
      console.error("Error fetching verse:", error)
      return null
    }
  }

  async searchBible(query: string, translation = "kjv", limit = 20): Promise<BibleVerse[]> {
    try {
      const response = await fetch("/api/bible/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, translation, limit }),
      })
      if (!response.ok) {
        throw new Error(`Failed to search Bible: ${response.status}`)
      }
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Error searching Bible:", error)
      return []
    }
  }

  async getDailyVerse(translation = "kjv"): Promise<BibleVerse | null> {
    try {
      const response = await fetch(`/api/bible/daily-verse?translation=${translation}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch daily verse: ${response.status}`)
      }
      const data = await response.json()
      return data.verse
    } catch (error) {
      console.error("Error fetching daily verse:", error)
      return null
    }
  }

  async getRandomVerse(translation = "kjv"): Promise<BibleVerse | null> {
    try {
      const response = await fetch(`/api/bible/verse?random=true&translation=${translation}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch random verse: ${response.status}`)
      }
      const data = await response.json()
      return data.verse
    } catch (error) {
      console.error("Error fetching random verse:", error)
      return null
    }
  }
}

export const bibleLocalService = new BibleLocalService()
