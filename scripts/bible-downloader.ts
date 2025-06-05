// Bible downloader and importer for public domain translations
import fs from "fs"
import path from "path"
import { bibleDatabase } from "../lib/bible-database"

interface BibleImportFormat {
  format: "json" | "xml" | "csv" | "txt"
  source: string
  translationId: string
}

export class BibleDownloader {
  private dataDir: string

  constructor(dataDir = "./data/bibles") {
    this.dataDir = dataDir
    this.ensureDataDirectory()
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }
  }

  // Download KJV from multiple sources
  async downloadKJV(): Promise<void> {
    console.log("Downloading KJV Bible...")

    try {
      // Try to download from a reliable JSON source
      const kjvUrl = "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/kjv.json"
      const response = await fetch(kjvUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const kjvData = await response.json()
      const filePath = path.join(this.dataDir, "kjv.json")

      fs.writeFileSync(filePath, JSON.stringify(kjvData, null, 2))
      console.log(`KJV downloaded to ${filePath}`)

      // Import into database
      await this.importKJVFromJSON(filePath)
    } catch (error) {
      console.error("Error downloading KJV:", error)
      console.log("Creating sample KJV data...")
      await this.createSampleKJV()
    }
  }

  // Import KJV from JSON format
  private async importKJVFromJSON(filePath: string): Promise<void> {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
      let verseCount = 0

      // Handle different JSON formats
      if (Array.isArray(data)) {
        // Format: [{ book, chapter, verse, text }]
        for (const verse of data) {
          if (verse.book && verse.chapter && verse.verse && verse.text) {
            const bookId = this.getBookId(verse.book)
            if (bookId) {
              bibleDatabase.addVerse("kjv", bookId, verse.chapter, verse.verse, verse.text)
              verseCount++
            }
          }
        }
      } else if (data.books) {
        // Format: { books: [{ name, chapters: [{ chapter, verses: [{ verse, text }] }] }] }
        for (const book of data.books) {
          const bookId = this.getBookId(book.name)
          if (bookId && book.chapters) {
            for (const chapterData of book.chapters) {
              if (chapterData.verses) {
                for (const verse of chapterData.verses) {
                  bibleDatabase.addVerse("kjv", bookId, chapterData.chapter, verse.verse, verse.text)
                  verseCount++
                }
              }
            }
          }
        }
      }

      console.log(`Imported ${verseCount} KJV verses`)
    } catch (error) {
      console.error("Error importing KJV from JSON:", error)
    }
  }

  // Create sample KJV data for testing
  private async createSampleKJV(): Promise<void> {
    console.log("Creating sample KJV data...")

    const sampleVerses = [
      // Genesis 1
      { book: "gen", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
      {
        book: "gen",
        chapter: 1,
        verse: 2,
        text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      },
      { book: "gen", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light." },

      // John 3
      {
        book: "joh",
        chapter: 3,
        verse: 16,
        text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      },
      {
        book: "joh",
        chapter: 3,
        verse: 17,
        text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
      },

      // Psalm 23
      { book: "psa", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
      {
        book: "psa",
        chapter: 23,
        verse: 2,
        text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      },
      {
        book: "psa",
        chapter: 23,
        verse: 3,
        text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      },
      {
        book: "psa",
        chapter: 23,
        verse: 4,
        text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      },

      // Romans 8
      {
        book: "rom",
        chapter: 8,
        verse: 28,
        text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      },

      // Philippians 4
      { book: "phi", chapter: 4, verse: 13, text: "I can do all things through Christ which strengtheneth me." },

      // Jeremiah 29
      {
        book: "jer",
        chapter: 29,
        verse: 11,
        text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
      },
    ]

    for (const verse of sampleVerses) {
      bibleDatabase.addVerse("kjv", verse.book, verse.chapter, verse.verse, verse.text)
    }

    console.log(`Created ${sampleVerses.length} sample KJV verses`)
  }

  // Download World English Bible
  async downloadWEB(): Promise<void> {
    console.log("Downloading World English Bible...")

    try {
      // WEB is available from multiple sources
      const webUrl = "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/web.json"
      const response = await fetch(webUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const webData = await response.json()
      const filePath = path.join(this.dataDir, "web.json")

      fs.writeFileSync(filePath, JSON.stringify(webData, null, 2))
      console.log(`WEB downloaded to ${filePath}`)

      // Import into database
      await this.importBibleFromJSON(filePath, "web")
    } catch (error) {
      console.error("Error downloading WEB:", error)
      console.log("Creating sample WEB data...")
      await this.createSampleWEB()
    }
  }

  // Create sample WEB data
  private async createSampleWEB(): Promise<void> {
    const sampleVerses = [
      {
        book: "joh",
        chapter: 3,
        verse: 16,
        text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
      },
      { book: "psa", chapter: 23, verse: 1, text: "Yahweh is my shepherd: I shall lack nothing." },
      {
        book: "rom",
        chapter: 8,
        verse: 28,
        text: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
      },
    ]

    for (const verse of sampleVerses) {
      bibleDatabase.addVerse("web", verse.book, verse.chapter, verse.verse, verse.text)
    }

    console.log(`Created ${sampleVerses.length} sample WEB verses`)
  }

  // Generic JSON importer
  private async importBibleFromJSON(filePath: string, translationId: string): Promise<void> {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
      let verseCount = 0

      // Handle various JSON formats
      if (Array.isArray(data)) {
        for (const verse of data) {
          if (verse.book && verse.chapter && verse.verse && verse.text) {
            const bookId = this.getBookId(verse.book)
            if (bookId) {
              bibleDatabase.addVerse(translationId, bookId, verse.chapter, verse.verse, verse.text)
              verseCount++
            }
          }
        }
      }

      console.log(`Imported ${verseCount} ${translationId.toUpperCase()} verses`)
    } catch (error) {
      console.error(`Error importing ${translationId} from JSON:`, error)
    }
  }

  // Import from CSV format
  async importFromCSV(filePath: string, translationId: string): Promise<void> {
    try {
      const csvContent = fs.readFileSync(filePath, "utf8")
      const lines = csvContent.split("\n")
      let verseCount = 0

      for (let i = 1; i < lines.length; i++) {
        // Skip header
        const line = lines[i].trim()
        if (!line) continue

        const columns = this.parseCSVLine(line)
        if (columns.length >= 4) {
          const [book, chapter, verse, text] = columns
          const bookId = this.getBookId(book)

          if (bookId) {
            bibleDatabase.addVerse(
              translationId,
              bookId,
              Number.parseInt(chapter),
              Number.parseInt(verse),
              text.replace(/^"|"$/g, ""), // Remove quotes
            )
            verseCount++
          }
        }
      }

      console.log(`Imported ${verseCount} ${translationId.toUpperCase()} verses from CSV`)
    } catch (error) {
      console.error(`Error importing ${translationId} from CSV:`, error)
    }
  }

  // Simple CSV parser
  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  // Convert book name to book ID
  private getBookId(bookName: string): string | null {
    const book = bibleDatabase.getBook(bookName)
    return book ? book.id : null
  }

  // Download all available public domain Bibles
  async downloadAll(): Promise<void> {
    console.log("Downloading all available public domain Bibles...")

    await this.downloadKJV()
    await this.downloadWEB()

    console.log("Bible download complete!")
    console.log("Database stats:", bibleDatabase.getStats())
  }

  // Export database to file
  exportDatabase(filePath: string): void {
    const data = bibleDatabase.exportData()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`Database exported to ${filePath}`)
  }

  // Import database from file
  importDatabase(filePath: string): void {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
    bibleDatabase.importData(data)
    console.log(`Database imported from ${filePath}`)
  }
}

// Export for use in scripts
export const bibleDownloader = new BibleDownloader()
