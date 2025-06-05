import { put } from "@vercel/blob"

interface BibleValidationResult {
  translation: string
  totalBooks: number
  totalChapters: number
  totalVerses: number
  missingBooks: string[]
  incompleteBooks: Array<{ book: string; expectedChapters: number; actualChapters: number }>
  status: "complete" | "incomplete" | "missing"
}

class BibleDataValidator {
  private readonly EXPECTED_BOOKS = {
    // Old Testament
    genesis: 50,
    exodus: 40,
    leviticus: 27,
    numbers: 36,
    deuteronomy: 34,
    joshua: 24,
    judges: 21,
    ruth: 4,
    "1samuel": 31,
    "2samuel": 24,
    "1kings": 22,
    "2kings": 25,
    "1chronicles": 29,
    "2chronicles": 36,
    ezra: 10,
    nehemiah: 13,
    esther: 10,
    job: 42,
    psalms: 150,
    proverbs: 31,
    ecclesiastes: 12,
    songofsolomon: 8,
    isaiah: 66,
    jeremiah: 52,
    lamentations: 5,
    ezekiel: 48,
    daniel: 12,
    hosea: 14,
    joel: 3,
    amos: 9,
    obadiah: 1,
    jonah: 4,
    micah: 7,
    nahum: 3,
    habakkuk: 3,
    zephaniah: 3,
    haggai: 2,
    zechariah: 14,
    malachi: 4,
    // New Testament
    matthew: 28,
    mark: 16,
    luke: 24,
    john: 21,
    acts: 28,
    romans: 16,
    "1corinthians": 16,
    "2corinthians": 13,
    galatians: 6,
    ephesians: 6,
    philippians: 4,
    colossians: 4,
    "1thessalonians": 5,
    "2thessalonians": 3,
    "1timothy": 6,
    "2timothy": 4,
    titus: 3,
    philemon: 1,
    hebrews: 13,
    james: 5,
    "1peter": 5,
    "2peter": 3,
    "1john": 5,
    "2john": 1,
    "3john": 1,
    jude: 1,
    revelation: 22,
  }

  private readonly EXPECTED_VERSE_COUNTS = {
    genesis: 1533,
    exodus: 1213,
    leviticus: 859,
    numbers: 1288,
    deuteronomy: 959,
    joshua: 658,
    judges: 618,
    ruth: 85,
    "1samuel": 810,
    "2samuel": 695,
    "1kings": 816,
    "2kings": 719,
    "1chronicles": 942,
    "2chronicles": 822,
    ezra: 280,
    nehemiah: 406,
    esther: 167,
    job: 1070,
    psalms: 2461,
    proverbs: 915,
    ecclesiastes: 222,
    songofsolomon: 117,
    isaiah: 1292,
    jeremiah: 1364,
    lamentations: 154,
    ezekiel: 1273,
    daniel: 357,
    hosea: 197,
    joel: 73,
    amos: 146,
    obadiah: 21,
    jonah: 48,
    micah: 105,
    nahum: 47,
    habakkuk: 56,
    zephaniah: 53,
    haggai: 38,
    zechariah: 211,
    malachi: 55,
    matthew: 1071,
    mark: 678,
    luke: 1151,
    john: 879,
    acts: 1007,
    romans: 433,
    "1corinthians": 437,
    "2corinthians": 257,
    galatians: 149,
    ephesians: 155,
    philippians: 104,
    colossians: 95,
    "1thessalonians": 89,
    "2thessalonians": 47,
    "1timothy": 113,
    "2timothy": 83,
    titus: 46,
    philemon: 25,
    hebrews: 303,
    james: 108,
    "1peter": 105,
    "2peter": 61,
    "1john": 105,
    "2john": 13,
    "3john": 14,
    jude: 25,
    revelation: 404,
  }

  async validateAllTranslations(): Promise<void> {
    console.log("🔍 Starting Bible Data Validation...")
    console.log("=".repeat(80))

    const translations = ["kjv", "web", "asv", "ylt", "darby"]
    const results: BibleValidationResult[] = []

    for (const translation of translations) {
      console.log(`\n📖 Validating ${translation.toUpperCase()}...`)
      const result = await this.validateTranslation(translation)
      results.push(result)

      if (result.status === "missing") {
        console.log(`❌ ${translation.toUpperCase()} is missing - downloading...`)
        await this.downloadTranslation(translation)
      } else if (result.status === "incomplete") {
        console.log(`⚠️  ${translation.toUpperCase()} is incomplete - attempting to fix...`)
        await this.fixIncompleteTranslation(translation, result)
      } else {
        console.log(`✅ ${translation.toUpperCase()} is complete`)
      }
    }

    this.generateValidationReport(results)
  }

  private async validateTranslation(translationId: string): Promise<BibleValidationResult> {
    try {
      const response = await fetch(`https://blob.vercel-storage.com/bibles/${translationId}.json`)

      if (!response.ok) {
        return {
          translation: translationId,
          totalBooks: 0,
          totalChapters: 0,
          totalVerses: 0,
          missingBooks: Object.keys(this.EXPECTED_BOOKS),
          incompleteBooks: [],
          status: "missing",
        }
      }

      const bibleData = await response.json()
      const books = bibleData.books || {}

      let totalChapters = 0
      let totalVerses = 0
      const missingBooks: string[] = []
      const incompleteBooks: Array<{ book: string; expectedChapters: number; actualChapters: number }> = []

      // Check each expected book
      for (const [bookName, expectedChapters] of Object.entries(this.EXPECTED_BOOKS)) {
        if (!books[bookName]) {
          missingBooks.push(bookName)
          continue
        }

        const actualChapters = Object.keys(books[bookName]).length
        totalChapters += actualChapters

        if (actualChapters < expectedChapters) {
          incompleteBooks.push({
            book: bookName,
            expectedChapters,
            actualChapters,
          })
        }

        // Count verses
        for (const chapter of Object.values(books[bookName])) {
          totalVerses += Object.keys(chapter as any).length
        }
      }

      const status = missingBooks.length > 0 ? "incomplete" : incompleteBooks.length > 0 ? "incomplete" : "complete"

      return {
        translation: translationId,
        totalBooks: Object.keys(books).length,
        totalChapters,
        totalVerses,
        missingBooks,
        incompleteBooks,
        status,
      }
    } catch (error) {
      console.error(`Error validating ${translationId}:`, error)
      return {
        translation: translationId,
        totalBooks: 0,
        totalChapters: 0,
        totalVerses: 0,
        missingBooks: Object.keys(this.EXPECTED_BOOKS),
        incompleteBooks: [],
        status: "missing",
      }
    }
  }

  private async downloadTranslation(translationId: string): Promise<void> {
    const sources = {
      kjv: [
        "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/kjv.json",
        "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/kjv.json",
        "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/kjv.json",
      ],
      web: [
        "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/web.json",
        "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/web.json",
      ],
      asv: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/asv.json"],
      ylt: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/ylt.json"],
      darby: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/darby.json"],
    }

    const urls = sources[translationId] || []

    for (const url of urls) {
      try {
        console.log(`  📥 Downloading from: ${url}`)
        const response = await fetch(url)

        if (!response.ok) {
          console.log(`  ❌ HTTP ${response.status} - trying next source`)
          continue
        }

        const rawData = await response.json()
        const processedData = this.processBibleData(rawData, translationId)

        if (processedData && processedData.metadata.totalVerses > 1000) {
          await put(`bibles/${translationId}.json`, JSON.stringify(processedData, null, 2), {
            access: "public",
            contentType: "application/json",
          })

          console.log(`  ✅ ${translationId.toUpperCase()} downloaded and uploaded successfully!`)
          console.log(
            `     📊 ${processedData.metadata.totalVerses} verses, ${processedData.metadata.totalChapters} chapters`,
          )
          return
        }
      } catch (error) {
        console.log(`  ❌ Error downloading from ${url}:`, error.message)
        continue
      }
    }

    console.log(`  ❌ All download sources failed for ${translationId.toUpperCase()}`)
  }

  private async fixIncompleteTranslation(translationId: string, result: BibleValidationResult): Promise<void> {
    console.log(`🔧 Attempting to fix incomplete ${translationId.toUpperCase()}...`)

    // For now, re-download the entire translation
    // In a more sophisticated system, we could try to download only missing books
    await this.downloadTranslation(translationId)
  }

  private processBibleData(rawData: any, translationId: string): any {
    const translationInfo = {
      kjv: { name: "King James Version", abbreviation: "KJV", year: 1769 },
      web: { name: "World English Bible", abbreviation: "WEB", year: 2000 },
      asv: { name: "American Standard Version", abbreviation: "ASV", year: 1901 },
      ylt: { name: "Young's Literal Translation", abbreviation: "YLT", year: 1898 },
      darby: { name: "Darby Translation", abbreviation: "DARBY", year: 1890 },
    }

    const books: Record<string, Record<number, Record<number, string>>> = {}
    let totalVerses = 0
    let totalChapters = 0

    try {
      // Handle different JSON formats
      if (Array.isArray(rawData)) {
        // Format: [{ book, chapter, verse, text }]
        for (const verse of rawData) {
          if (!verse.book || !verse.chapter || !verse.verse || !verse.text) continue

          const bookName = this.normalizeBookName(verse.book)
          if (!bookName) continue

          if (!books[bookName]) books[bookName] = {}
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

          if (!books[bookName]) books[bookName] = {}
          if (!books[bookName][verse.chapter]) {
            books[bookName][verse.chapter] = {}
            totalChapters++
          }

          books[bookName][verse.chapter][verse.verse] = verse.text.trim()
          totalVerses++
        }
      }

      if (totalVerses === 0) {
        console.log(`❌ No verses found in ${translationId} data`)
        return null
      }

      const info = translationInfo[translationId] || {
        name: translationId.toUpperCase(),
        abbreviation: translationId.toUpperCase(),
        year: 2000,
      }

      return {
        translation: {
          id: translationId,
          name: info.name,
          abbreviation: info.abbreviation,
          language: "en",
          year: info.year,
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
      console.error(`Error processing ${translationId} data:`, error)
      return null
    }
  }

  private normalizeBookName(bookName: string): string | null {
    const bookMapping = {
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

    if (bookMapping[bookName]) return bookMapping[bookName]

    // Try variations
    const variations = [
      bookName.trim(),
      bookName.replace(/^\d+\s*/, (match) => match.trim() + " "),
      bookName.replace(/(\d+)([A-Z])/, "$1 $2"),
      bookName.replace(/([a-z])([A-Z])/g, "$1 $2"),
    ]

    for (const variation of variations) {
      if (bookMapping[variation]) return bookMapping[variation]
    }

    return bookName.toLowerCase().replace(/\s+/g, "")
  }

  private generateValidationReport(results: BibleValidationResult[]): void {
    console.log("\n" + "=".repeat(80))
    console.log("📊 BIBLE DATA VALIDATION REPORT")
    console.log("=".repeat(80))

    const totalTranslations = results.length
    const completeTranslations = results.filter((r) => r.status === "complete").length
    const incompleteTranslations = results.filter((r) => r.status === "incomplete").length
    const missingTranslations = results.filter((r) => r.status === "missing").length

    console.log(`\n📈 SUMMARY`)
    console.log(`Total Translations: ${totalTranslations}`)
    console.log(`✅ Complete: ${completeTranslations}`)
    console.log(`⚠️  Incomplete: ${incompleteTranslations}`)
    console.log(`❌ Missing: ${missingTranslations}`)

    console.log(`\n📋 DETAILED RESULTS`)
    for (const result of results) {
      const statusIcon = result.status === "complete" ? "✅" : result.status === "incomplete" ? "⚠️" : "❌"

      console.log(`\n${statusIcon} ${result.translation.toUpperCase()}`)
      console.log(`   Books: ${result.totalBooks}/66`)
      console.log(`   Chapters: ${result.totalChapters}`)
      console.log(`   Verses: ${result.totalVerses}`)

      if (result.missingBooks.length > 0) {
        console.log(
          `   Missing Books (${result.missingBooks.length}): ${result.missingBooks.slice(0, 5).join(", ")}${result.missingBooks.length > 5 ? "..." : ""}`,
        )
      }

      if (result.incompleteBooks.length > 0) {
        console.log(`   Incomplete Books (${result.incompleteBooks.length}):`)
        for (const book of result.incompleteBooks.slice(0, 3)) {
          console.log(`     • ${book.book}: ${book.actualChapters}/${book.expectedChapters} chapters`)
        }
        if (result.incompleteBooks.length > 3) {
          console.log(`     • ... and ${result.incompleteBooks.length - 3} more`)
        }
      }
    }

    // Expected totals
    const expectedTotalVerses = Object.values(this.EXPECTED_VERSE_COUNTS).reduce((a, b) => a + b, 0)
    const expectedTotalChapters = Object.values(this.EXPECTED_BOOKS).reduce((a, b) => a + b, 0)

    console.log(`\n📊 EXPECTED TOTALS (per translation)`)
    console.log(`   Books: 66`)
    console.log(`   Chapters: ${expectedTotalChapters}`)
    console.log(`   Verses: ${expectedTotalVerses}`)

    if (completeTranslations === totalTranslations) {
      console.log(`\n🎉 ALL TRANSLATIONS COMPLETE! Your Bible database is production-ready.`)
    } else {
      console.log(`\n⚠️  ${incompleteTranslations + missingTranslations} translation(s) need attention.`)
    }

    console.log("=".repeat(80))
  }
}

// Run the validation
const validator = new BibleDataValidator()
await validator.validateAllTranslations()
