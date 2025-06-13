// Fallback Bible service for when blob storage is not available
// This provides basic functionality for testing and development

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

interface SearchResult {
  reference: string
  text: string
  book: string
  chapter: number
  verse: number
  translation: string
  relevance?: number
}

// Sample Bible data for testing when blob storage is not available
const sampleBibleData: Record<string, BibleVerse[]> = {
  kjv: [
    {
      book: "john",
      chapter: 3,
      verse: 16,
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      translation: "kjv",
    },
    {
      book: "john",
      chapter: 1,
      verse: 1,
      text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      translation: "kjv",
    },
    {
      book: "john",
      chapter: 1,
      verse: 14,
      text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
      translation: "kjv",
    },
    {
      book: "psalms",
      chapter: 23,
      verse: 1,
      text: "The LORD is my shepherd; I shall not want.",
      translation: "kjv",
    },
    {
      book: "psalms",
      chapter: 23,
      verse: 4,
      text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      translation: "kjv",
    },
    {
      book: "romans",
      chapter: 8,
      verse: 28,
      text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      translation: "kjv",
    },
    {
      book: "philippians",
      chapter: 4,
      verse: 13,
      text: "I can do all things through Christ which strengtheneth me.",
      translation: "kjv",
    },
    {
      book: "1corinthians",
      chapter: 13,
      verse: 4,
      text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
      translation: "kjv",
    },
    {
      book: "1corinthians",
      chapter: 13,
      verse: 13,
      text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
      translation: "kjv",
    },
    {
      book: "matthew",
      chapter: 5,
      verse: 3,
      text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
      translation: "kjv",
    },
    {
      book: "matthew",
      chapter: 5,
      verse: 4,
      text: "Blessed are they that mourn: for they shall be comforted.",
      translation: "kjv",
    },
    {
      book: "matthew",
      chapter: 28,
      verse: 19,
      text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
      translation: "kjv",
    },
    {
      book: "genesis",
      chapter: 1,
      verse: 1,
      text: "In the beginning God created the heaven and the earth.",
      translation: "kjv",
    },
    {
      book: "revelation",
      chapter: 21,
      verse: 4,
      text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
      translation: "kjv",
    },
    {
      book: "proverbs",
      chapter: 3,
      verse: 5,
      text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
      translation: "kjv",
    },
  ],
}

export class BibleFallbackService {
  async searchBible(translation: string, query: string, limit = 10): Promise<SearchResult[]> {
    console.log(`🔍 Fallback search: "${query}" in ${translation}`)

    const verses = sampleBibleData[translation] || sampleBibleData.kjv
    const searchTerms = query.toLowerCase().split(" ")

    const results: SearchResult[] = []

    for (const verse of verses) {
      const text = verse.text.toLowerCase()
      let relevance = 0

      // Calculate relevance based on search terms
      for (const term of searchTerms) {
        if (text.includes(term)) {
          relevance += 1
          // Bonus for exact word matches
          const wordRegex = new RegExp(`\\b${term}\\b`, "gi")
          const matches = text.match(wordRegex)
          if (matches) {
            relevance += matches.length * 0.5
          }
        }
      }

      if (relevance > 0) {
        results.push({
          reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          translation: verse.translation,
          relevance,
        })
      }
    }

    // Sort by relevance and limit results
    return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0)).slice(0, limit)
  }

  async getVerse(translation: string, book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
    console.log(`📖 Fallback get verse: ${book} ${chapter}:${verse} (${translation})`)

    const verses = sampleBibleData[translation] || sampleBibleData.kjv

    return (
      verses.find((v) => v.book.toLowerCase() === book.toLowerCase() && v.chapter === chapter && v.verse === verse) ||
      null
    )
  }

  async getRandomVerse(translation = "kjv"): Promise<BibleVerse | null> {
    console.log(`🎲 Fallback random verse from ${translation}`)

    const verses = sampleBibleData[translation] || sampleBibleData.kjv
    const randomIndex = Math.floor(Math.random() * verses.length)

    return verses[randomIndex] || null
  }

  async listAvailableTranslations(): Promise<string[]> {
    return Object.keys(sampleBibleData)
  }

  async getBibleStats(): Promise<any> {
    const kjvVerses = sampleBibleData.kjv || []

    return {
      totalTranslations: Object.keys(sampleBibleData).length,
      totalVerses: kjvVerses.length,
      totalBooks: [...new Set(kjvVerses.map((v) => v.book))].length,
      availableTranslations: Object.keys(sampleBibleData),
      note: "This is fallback data - limited verse collection for testing",
    }
  }

  async checkBibleDataAvailability(): Promise<any> {
    return {
      available: true,
      source: "fallback",
      note: "Using sample Bible data for testing",
      limitations: [
        "Limited to ~15 popular verses",
        "Only KJV translation available",
        "No full Bible text available",
        "Configure BLOB_READ_WRITE_TOKEN for full functionality",
      ],
    }
  }
}

export const bibleFallbackService = new BibleFallbackService()
