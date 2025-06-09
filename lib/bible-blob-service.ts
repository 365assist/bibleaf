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
      const response = await fetch(`https://blob.vercel-storage.com/bibles/${translationId}.json`)

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Bible translation ${translationId} not found in blob storage, using fallback`)
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
      console.log(`Getting chapter: ${translationId} ${book} ${chapter}`)

      const bibleData = await this.downloadBibleTranslation(translationId)
      if (!bibleData) {
        console.log("No Bible data found")
        return null
      }

      console.log("Bible data loaded, available books:", Object.keys(bibleData.books))

      if (!bibleData.books[book]) {
        console.log(`Book ${book} not found in translation ${translationId}`)
        return null
      }

      console.log(`Book ${book} found, available chapters:`, Object.keys(bibleData.books[book]))

      if (!bibleData.books[book][chapter]) {
        console.log(`Chapter ${chapter} not found in book ${book}`)
        return null
      }

      const chapterData = bibleData.books[book][chapter]
      console.log(`Chapter data found, verses:`, Object.keys(chapterData))

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
        // Return fallback books if no data
        return Object.entries(this.BIBLE_BOOKS).map(([id, book]) => ({
          id,
          ...book,
        }))
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
      return Object.entries(this.BIBLE_BOOKS).map(([id, book]) => ({
        id,
        ...book,
      }))
    }
  }

  // Get fallback data when blob storage is not available
  private getFallbackData(translationId: string): BibleTranslationData | null {
    console.log(`Creating fallback data for ${translationId}`)

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
            1: {
              1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
              2: "The same was in the beginning with God.",
              3: "All things were made by him; and without him was not any thing made that was made.",
              4: "In him was life; and the life was the light of men.",
              5: "And the light shineth in darkness; and the darkness comprehended it not.",
              6: "There was a man sent from God, whose name was John.",
              7: "The same came for a witness, to bear witness of the Light, that all men through him might believe.",
              8: "He was not that Light, but was sent to bear witness of that Light.",
              9: "That was the true Light, which lighteth every man that cometh into the world.",
              10: "He was in the world, and the world was made by him, and the world knew him not.",
              11: "He came unto his own, and his own received him not.",
              12: "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:",
              13: "Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.",
              14: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
            },
            3: {
              16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
              17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
            },
          },
          proverbs: {
            1: {
              1: "The proverbs of Solomon the son of David, king of Israel;",
              2: "To know wisdom and instruction; to perceive the words of understanding;",
              3: "To receive the instruction of wisdom, justice, and judgment, and equity;",
              4: "To give subtilty to the simple, to the young man knowledge and discretion.",
              5: "A wise man will hear, and will increase learning; and a man of understanding shall attain unto wise counsels:",
              6: "To understand a proverb, and the interpretation; the words of the wise, and their dark sayings.",
              7: "The fear of the LORD is the beginning of knowledge: but fools despise wisdom and instruction.",
            },
            3: {
              1: "My son, forget not my law; but let thine heart keep my commandments:",
              2: "For length of days, and long life, and peace, shall they add to thee.",
              3: "Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart:",
              4: "So shalt thou find favour and good understanding in the sight of God and man.",
              5: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
              6: "In all thy ways acknowledge him, and he shall direct thy paths.",
              7: "Be not wise in thine own eyes: fear the LORD, and depart from evil.",
              8: "It shall be health to thy navel, and marrow to thy bones.",
              9: "Honour the LORD with thy substance, and with the firstfruits of all thine increase:",
              10: "So shall thy barns be filled with plenty, and thy presses shall burst out with new wine.",
            },
          },
          psalms: {
            1: {
              1: "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
              2: "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
              3: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
              4: "The ungodly are not so: but are like the chaff which the wind driveth away.",
              5: "Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.",
              6: "For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish.",
            },
            23: {
              1: "The LORD is my shepherd; I shall not want.",
              2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
              3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
              4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
              5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
              6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
            },
          },
          genesis: {
            1: {
              1: "In the beginning God created the heaven and the earth.",
              2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
              3: "And God said, Let there be light: and there was light.",
              4: "And God saw the light, that it was good: and God divided the light from the darkness.",
              5: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
            },
          },
          matthew: {
            5: {
              1: "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:",
              2: "And he opened his mouth, and taught them, saying,",
              3: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
              4: "Blessed are they that mourn: for they shall be comforted.",
              5: "Blessed are the meek: for they shall inherit the earth.",
              6: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.",
              7: "Blessed are the merciful: for they shall obtain mercy.",
              8: "Blessed are the pure in heart: for they shall see God.",
              9: "Blessed are the peacemakers: for they shall be called the children of God.",
            },
            6: {
              33: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
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
          totalVerses: 150,
          totalChapters: 20,
          downloadDate: new Date().toISOString(),
          source: "fallback-data",
        },
      }
    }

    if (translationId === "web") {
      return {
        translation: {
          id: "web",
          name: "World English Bible",
          abbreviation: "WEB",
          language: "en",
          year: 2000,
          copyright: "Public Domain",
          isPublicDomain: true,
        },
        books: {
          john: {
            1: {
              1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
              2: "The same was in the beginning with God.",
              3: "All things were made through him. Without him was not anything made that has been made.",
            },
            3: {
              16: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
            },
          },
          psalms: {
            23: {
              1: "Yahweh is my shepherd: I shall lack nothing.",
              2: "He makes me lie down in green pastures. He leads me beside still waters.",
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
        totalTranslations: 2,
        totalBooks: 66,
        totalChapters: 1189,
        totalVerses: 31102,
        lastUpdated: new Date().toISOString(),
        availableBooks: Object.keys(this.BIBLE_BOOKS),
      }
    }
  }

  // Ensure the Bible blob service is properly configured and accessible
  // The service should handle:
  // 1. Full Bible translations (KJV, WEB, ASV, YLT, DARBY)
  // 2. Comprehensive search across all verses
  // 3. Chapter and verse retrieval
  // 4. Daily verse functionality
  // 5. Random verse selection

  // Add a method to check if Bible data is available
  async checkBibleDataAvailability(): Promise<{ available: boolean; translations: string[]; totalVerses: number }> {
    try {
      const translations = await this.listAvailableTranslations()
      const stats = await this.getBibleStats()

      return {
        available: translations.length > 0,
        translations,
        totalVerses: stats.totalVerses,
      }
    } catch (error) {
      console.error("Error checking Bible data availability:", error)
      return {
        available: false,
        translations: [],
        totalVerses: 0,
      }
    }
  }
}

export const bibleBlobService = new BibleBlobService()
