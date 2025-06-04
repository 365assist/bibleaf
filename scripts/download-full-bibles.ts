import { put } from "@vercel/blob"
import type { BibleTranslationData } from "../lib/bible-blob-service"

interface BibleAPIVerse {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface ZefaniaXMLBook {
  name: string
  chapters: Array<{
    number: number
    verses: Array<{
      number: number
      text: string
    }>
  }>
}

class FullBibleDownloader {
  private readonly BIBLE_SOURCES = {
    kjv: {
      name: "King James Version",
      abbreviation: "KJV",
      year: 1769,
      urls: [
        "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/kjv.json",
        "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/kjv.json",
        "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/kjv.json",
      ],
    },
    web: {
      name: "World English Bible",
      abbreviation: "WEB",
      year: 2000,
      urls: [
        "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/web.json",
        "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/web.json",
      ],
    },
    asv: {
      name: "American Standard Version",
      abbreviation: "ASV",
      year: 1901,
      urls: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/asv.json"],
    },
    ylt: {
      name: "Young's Literal Translation",
      abbreviation: "YLT",
      year: 1898,
      urls: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/ylt.json"],
    },
    darby: {
      name: "Darby Translation",
      abbreviation: "DARBY",
      year: 1890,
      urls: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/darby.json"],
    },
  }

  private readonly BOOK_MAPPING = {
    // Old Testament
    Genesis: "genesis",
    Exodus: "exodus",
    Leviticus: "leviticus",
    Numbers: "numbers",
    Deuteronomy: "deuteronomy",
    Joshua: "joshua",
    Judges: "judges",
    Ruth: "ruth",
    "1 Samuel": "1samuel",
    "2 Samuel": "2samuel",
    "1 Kings": "1kings",
    "2 Kings": "2kings",
    "1 Chronicles": "1chronicles",
    "2 Chronicles": "2chronicles",
    Ezra: "ezra",
    Nehemiah: "nehemiah",
    Esther: "esther",
    Job: "job",
    Psalms: "psalms",
    Proverbs: "proverbs",
    Ecclesiastes: "ecclesiastes",
    "Song of Solomon": "songofsolomon",
    Isaiah: "isaiah",
    Jeremiah: "jeremiah",
    Lamentations: "lamentations",
    Ezekiel: "ezekiel",
    Daniel: "daniel",
    Hosea: "hosea",
    Joel: "joel",
    Amos: "amos",
    Obadiah: "obadiah",
    Jonah: "jonah",
    Micah: "micah",
    Nahum: "nahum",
    Habakkuk: "habakkuk",
    Zephaniah: "zephaniah",
    Haggai: "haggai",
    Zechariah: "zechariah",
    Malachi: "malachi",

    // New Testament
    Matthew: "matthew",
    Mark: "mark",
    Luke: "luke",
    John: "john",
    Acts: "acts",
    Romans: "romans",
    "1 Corinthians": "1corinthians",
    "2 Corinthians": "2corinthians",
    Galatians: "galatians",
    Ephesians: "ephesians",
    Philippians: "philippians",
    Colossians: "colossians",
    "1 Thessalonians": "1thessalonians",
    "2 Thessalonians": "2thessalonians",
    "1 Timothy": "1timothy",
    "2 Timothy": "2timothy",
    Titus: "titus",
    Philemon: "philemon",
    Hebrews: "hebrews",
    James: "james",
    "1 Peter": "1peter",
    "2 Peter": "2peter",
    "1 John": "1john",
    "2 John": "2john",
    "3 John": "3john",
    Jude: "jude",
    Revelation: "revelation",
  }

  async downloadAndUploadAllBibles(): Promise<void> {
    console.log("🚀 Starting full Bible download and upload process...")

    for (const [translationId, config] of Object.entries(this.BIBLE_SOURCES)) {
      console.log(`\n📖 Processing ${config.name} (${config.abbreviation})...`)

      try {
        const bibleData = await this.downloadBibleTranslation(translationId, config)
        if (bibleData) {
          await this.uploadToBlob(translationId, bibleData)
          console.log(`✅ ${config.abbreviation} uploaded successfully!`)
        } else {
          console.log(`❌ Failed to download ${config.abbreviation}`)
        }
      } catch (error) {
        console.error(`❌ Error processing ${config.abbreviation}:`, error)
      }

      // Small delay between uploads
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("\n🎉 Full Bible upload process complete!")
    await this.printSummary()
  }

  private async downloadBibleTranslation(translationId: string, config: any): Promise<BibleTranslationData | null> {
    console.log(`📥 Downloading ${config.abbreviation} from ${config.urls.length} source(s)...`)

    for (const url of config.urls) {
      try {
        console.log(`  Trying: ${url}`)
        const response = await fetch(url)

        if (!response.ok) {
          console.log(`  ❌ HTTP ${response.status} - trying next source`)
          continue
        }

        const rawData = await response.json()
        console.log(`  ✅ Downloaded successfully from ${url}`)

        const processedData = this.processBibleData(rawData, translationId, config)
        if (processedData) {
          console.log(
            `  📊 Processed ${processedData.metadata.totalVerses} verses across ${processedData.metadata.totalChapters} chapters`,
          )
          return processedData
        }
      } catch (error) {
        console.log(`  ❌ Error downloading from ${url}:`, error)
        continue
      }
    }

    console.log(`❌ All sources failed for ${config.abbreviation}`)
    return null
  }

  private processBibleData(rawData: any, translationId: string, config: any): BibleTranslationData | null {
    try {
      const books: Record<string, Record<number, Record<number, string>>> = {}
      let totalVerses = 0
      let totalChapters = 0
      const processedBooks = new Set<string>()

      // Handle different JSON formats
      if (Array.isArray(rawData)) {
        // Format: [{ book, chapter, verse, text }]
        for (const verse of rawData) {
          if (!verse.book || !verse.chapter || !verse.verse || !verse.text) continue

          const bookName = this.normalizeBookName(verse.book)
          if (!bookName) continue

          if (!books[bookName]) {
            books[bookName] = {}
            processedBooks.add(bookName)
          }
          if (!books[bookName][verse.chapter]) {
            books[bookName][verse.chapter] = {}
            totalChapters++
          }

          books[bookName][verse.chapter][verse.verse] = verse.text.trim()
          totalVerses++
        }
      } else if (rawData.books) {
        // Format: { books: [{ name, chapters: [{ chapter, verses: [{ verse, text }] }] }] }
        for (const book of rawData.books) {
          const bookName = this.normalizeBookName(book.name)
          if (!bookName || !book.chapters) continue

          books[bookName] = {}
          processedBooks.add(bookName)

          for (const chapterData of book.chapters) {
            if (!chapterData.verses) continue

            books[bookName][chapterData.chapter] = {}
            totalChapters++

            for (const verse of chapterData.verses) {
              books[bookName][chapterData.chapter][verse.verse] = verse.text.trim()
              totalVerses++
            }
          }
        }
      } else if (rawData.verses) {
        // Format: { verses: [{ book_name, chapter, verse, text }] }
        for (const verse of rawData.verses) {
          const bookName = this.normalizeBookName(verse.book_name || verse.book)
          if (!bookName) continue

          if (!books[bookName]) {
            books[bookName] = {}
            processedBooks.add(bookName)
          }
          if (!books[bookName][verse.chapter]) {
            books[bookName][verse.chapter] = {}
            totalChapters++
          }

          books[bookName][verse.chapter][verse.verse] = verse.text.trim()
          totalVerses++
        }
      }

      if (totalVerses === 0) {
        console.log(`❌ No verses found in ${config.abbreviation} data`)
        return null
      }

      return {
        translation: {
          id: translationId,
          name: config.name,
          abbreviation: config.abbreviation,
          language: "en",
          year: config.year,
          copyright: "Public Domain",
          isPublicDomain: true,
        },
        books,
        metadata: {
          totalVerses,
          totalChapters,
          downloadDate: new Date().toISOString(),
          source: "github-repositories",
        },
      }
    } catch (error) {
      console.error(`Error processing ${config.abbreviation} data:`, error)
      return null
    }
  }

  private normalizeBookName(bookName: string): string | null {
    if (!bookName) return null

    // Direct mapping
    if (this.BOOK_MAPPING[bookName]) {
      return this.BOOK_MAPPING[bookName]
    }

    // Try variations
    const variations = [
      bookName.trim(),
      bookName.replace(/^\d+\s*/, (match) => match.trim() + " "), // "1Samuel" -> "1 Samuel"
      bookName.replace(/(\d+)([A-Z])/, "$1 $2"), // "1Kings" -> "1 Kings"
      bookName.replace(/([a-z])([A-Z])/g, "$1 $2"), // "SongOfSolomon" -> "Song Of Solomon"
    ]

    for (const variation of variations) {
      if (this.BOOK_MAPPING[variation]) {
        return this.BOOK_MAPPING[variation]
      }
    }

    // Fallback: convert to lowercase and remove spaces
    return bookName.toLowerCase().replace(/\s+/g, "")
  }

  private async uploadToBlob(translationId: string, data: BibleTranslationData): Promise<void> {
    try {
      const filename = `bibles/${translationId}.json`
      const blob = await put(filename, JSON.stringify(data, null, 2), {
        access: "public",
        contentType: "application/json",
      })

      console.log(`📤 Uploaded ${translationId} to blob storage: ${blob.url}`)
    } catch (error) {
      console.error(`❌ Error uploading ${translationId} to blob:`, error)
      throw error
    }
  }

  private async printSummary(): Promise<void> {
    console.log("\n" + "=".repeat(60))
    console.log("📊 FULL BIBLE UPLOAD SUMMARY")
    console.log("=".repeat(60))

    try {
      // Try to get stats from our API
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/bible/stats`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.stats) {
          const stats = data.stats
          console.log(`📚 Total Translations: ${stats.totalTranslations}`)
          console.log(`📖 Total Books: ${stats.totalBooks}`)
          console.log(`📄 Total Chapters: ${stats.totalChapters}`)
          console.log(`✍️  Total Verses: ${stats.totalVerses}`)
          console.log(`📅 Last Updated: ${new Date(stats.lastUpdated).toLocaleString()}`)

          if (stats.availableBooks && stats.availableBooks.length > 0) {
            console.log(`\n📋 Available Books (${stats.availableBooks.length}):`)
            const books = stats.availableBooks.sort()
            for (let i = 0; i < books.length; i += 6) {
              console.log(`   ${books.slice(i, i + 6).join(", ")}`)
            }
          }
        }
      }
    } catch (error) {
      console.log("📊 Could not fetch final statistics")
    }

    console.log("\n🎉 Your Bible app now has complete Bible translations!")
    console.log("🔗 Test at: /test-full-bible")
    console.log("=".repeat(60))
  }

  // Download specific translation only
  async downloadSingleTranslation(translationId: string): Promise<void> {
    const config = this.BIBLE_SOURCES[translationId as keyof typeof this.BIBLE_SOURCES]
    if (!config) {
      console.error(`❌ Unknown translation: ${translationId}`)
      console.log(`Available translations: ${Object.keys(this.BIBLE_SOURCES).join(", ")}`)
      return
    }

    console.log(`📖 Downloading ${config.name} (${config.abbreviation})...`)

    try {
      const bibleData = await this.downloadBibleTranslation(translationId, config)
      if (bibleData) {
        await this.uploadToBlob(translationId, bibleData)
        console.log(`✅ ${config.abbreviation} uploaded successfully!`)
        await this.printSummary()
      } else {
        console.log(`❌ Failed to download ${config.abbreviation}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${config.abbreviation}:`, error)
    }
  }
}

// Main execution
const downloader = new FullBibleDownloader()

console.log("🚀 Starting Full Bible Download Process...")
console.log("📋 Available translations: KJV, WEB, ASV, YLT, DARBY")
console.log("⏱️  This may take a few minutes to download and process all translations...")

// Download all translations
await downloader.downloadAndUploadAllBibles()

console.log("\n✨ Full Bible download complete!")
console.log("🔗 Visit /test-full-bible to see your complete Bible database!")
