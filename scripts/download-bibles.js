const fs = require("fs")
const path = require("path")

console.log("🚀 Starting Bible Database Setup...")

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log("📁 Created data directory")
}

// Bible books structure
const bibleBooks = {
  oldTestament: [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
  ],
  newTestament: [
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
  ],
}

// Sample Bible data (KJV - Public Domain)
const sampleBibleData = {
  translation: "KJV",
  name: "King James Version",
  language: "English",
  year: 1611,
  copyright: "Public Domain",
  books: {},
}

// Add sample verses for testing
const sampleVerses = {
  Genesis: {
    1: {
      1: "In the beginning God created the heaven and the earth.",
      2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      3: "And God said, Let there be light: and there was light.",
    },
  },
  John: {
    3: {
      16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
    },
    14: {
      6: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    },
  },
  Romans: {
    8: {
      28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    },
  },
  Philippians: {
    4: {
      13: "I can do all things through Christ which strengtheneth me.",
    },
  },
  Psalms: {
    23: {
      1: "The LORD is my shepherd; I shall not want.",
      2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    },
  },
  Matthew: {
    5: {
      3: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
      4: "Blessed are they that mourn: for they shall be comforted.",
      5: "Blessed are the meek: for they shall inherit the earth.",
    },
  },
  "1 Corinthians": {
    13: {
      4: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.",
      5: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
      13: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    },
  },
}

// Add sample verses to the bible data
Object.keys(sampleVerses).forEach((book) => {
  sampleBibleData.books[book] = sampleVerses[book]
})

// Save the sample Bible data
const bibleFilePath = path.join(dataDir, "kjv-bible.json")
fs.writeFileSync(bibleFilePath, JSON.stringify(sampleBibleData, null, 2))

console.log("✅ Sample KJV Bible data created successfully!")
console.log(`📖 Saved to: ${bibleFilePath}`)

// Create a translations index
const translationsIndex = [
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    year: 1611,
    copyright: "Public Domain",
    filename: "kjv-bible.json",
    available: true,
  },
]

const indexFilePath = path.join(dataDir, "translations.json")
fs.writeFileSync(indexFilePath, JSON.stringify(translationsIndex, null, 2))

console.log("✅ Translations index created!")
console.log(`📋 Saved to: ${indexFilePath}`)

// Create Bible statistics
const stats = {
  totalTranslations: 1,
  totalBooks: Object.keys(sampleBibleData.books).length,
  totalChapters: Object.values(sampleBibleData.books).reduce((acc, book) => acc + Object.keys(book).length, 0),
  totalVerses: Object.values(sampleBibleData.books).reduce((acc, book) => {
    return acc + Object.values(book).reduce((chapterAcc, chapter) => chapterAcc + Object.keys(chapter).length, 0)
  }, 0),
  lastUpdated: new Date().toISOString(),
  availableBooks: Object.keys(sampleBibleData.books),
  sampleVerses: [
    { book: "John", chapter: 3, verse: 16, text: sampleVerses.John[3][16] },
    { book: "Psalms", chapter: 23, verse: 1, text: sampleVerses.Psalms[23][1] },
    { book: "Philippians", chapter: 4, verse: 13, text: sampleVerses.Philippians[4][13] },
  ],
}

const statsFilePath = path.join(dataDir, "bible-stats.json")
fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2))

console.log("✅ Bible statistics created!")
console.log(`📊 Saved to: ${statsFilePath}`)

console.log("\n🎉 Bible Database Setup Complete!")
console.log("\n📈 Database Statistics:")
console.log(`   📚 Translations: ${stats.totalTranslations}`)
console.log(`   📖 Books: ${stats.totalBooks}`)
console.log(`   📄 Chapters: ${stats.totalChapters}`)
console.log(`   📝 Verses: ${stats.totalVerses}`)
console.log("\n🔗 Next Steps:")
console.log("   1. Visit /test-local-bible to test the database")
console.log('   2. Search for verses like "love", "faith", or "hope"')
console.log("   3. View daily verses and chapter navigation")
console.log("\n💡 To expand the database:")
console.log("   - Add more public domain translations")
console.log("   - Import from Bible Gateway or other sources")
console.log("   - Use the Bible API service for real-time data")

// Bible download sources (public domain)
const BIBLE_SOURCES = {
  kjv: {
    name: "King James Version",
    urls: [
      "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/kjv.json",
      "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/kjv.json",
    ],
    format: "json",
  },
  web: {
    name: "World English Bible",
    urls: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/web.json"],
    format: "json",
  },
  asv: {
    name: "American Standard Version",
    urls: ["https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/asv.json"],
    format: "json",
  },
}

// Book name mappings
const BOOK_MAPPINGS = {
  Genesis: "gen",
  Exodus: "exo",
  Leviticus: "lev",
  Numbers: "num",
  Deuteronomy: "deu",
  Joshua: "jos",
  Judges: "jdg",
  Ruth: "rut",
  "1 Samuel": "1sa",
  "2 Samuel": "2sa",
  "1 Kings": "1ki",
  "2 Kings": "2ki",
  "1 Chronicles": "1ch",
  "2 Chronicles": "2ch",
  Ezra: "ezr",
  Nehemiah: "neh",
  Esther: "est",
  Job: "job",
  Psalms: "psa",
  Proverbs: "pro",
  Ecclesiastes: "ecc",
  "Song of Solomon": "sng",
  Isaiah: "isa",
  Jeremiah: "jer",
  Lamentations: "lam",
  Ezekiel: "eze",
  Daniel: "dan",
  Hosea: "hos",
  Joel: "joe",
  Amos: "amo",
  Obadiah: "oba",
  Jonah: "jon",
  Micah: "mic",
  Nahum: "nah",
  Habakkuk: "hab",
  Zephaniah: "zep",
  Haggai: "hag",
  Zechariah: "zec",
  Malachi: "mal",
  Matthew: "mat",
  Mark: "mar",
  Luke: "luk",
  John: "joh",
  Acts: "act",
  Romans: "rom",
  "1 Corinthians": "1co",
  "2 Corinthians": "2co",
  Galatians: "gal",
  Ephesians: "eph",
  Philippians: "phi",
  Colossians: "col",
  "1 Thessalonians": "1th",
  "2 Thessalonians": "2th",
  "1 Timothy": "1ti",
  "2 Timothy": "2ti",
  Titus: "tit",
  Philemon: "phm",
  Hebrews: "heb",
  James: "jas",
  "1 Peter": "1pe",
  "2 Peter": "2pe",
  "1 John": "1jo",
  "2 John": "2jo",
  "3 John": "3jo",
  Jude: "jud",
  Revelation: "rev",
}

async function downloadBible(translationId, source) {
  console.log(`\n📖 Downloading ${source.name} (${translationId.toUpperCase()})...`)

  const dataDir = "./public/data/bibles"
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  for (const url of source.urls) {
    try {
      console.log(`  Trying: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        console.log(`  ❌ Failed: ${response.status}`)
        continue
      }

      const data = await response.json()
      const filePath = path.join(dataDir, `${translationId}.json`)

      // Process and standardize the data
      const processedData = processBibleData(data, translationId)

      fs.writeFileSync(filePath, JSON.stringify(processedData, null, 2))
      console.log(`  ✅ Downloaded: ${processedData.verses.length} verses`)
      console.log(`  📁 Saved to: ${filePath}`)

      return true
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`)
    }
  }

  console.log(`  ⚠️  Could not download ${source.name}`)
  return false
}

function processBibleData(rawData, translationId) {
  const verses = []

  try {
    if (Array.isArray(rawData)) {
      // Format: [{ book, chapter, verse, text }]
      for (const item of rawData) {
        const bookId = getBookId(item.book || item.book_name)
        if (bookId && item.chapter && item.verse && item.text) {
          verses.push({
            translationId,
            bookId,
            chapter: Number.parseInt(item.chapter),
            verse: Number.parseInt(item.verse),
            text: item.text.trim(),
          })
        }
      }
    } else if (rawData.books) {
      // Format: { books: [...] }
      for (const book of rawData.books) {
        const bookId = getBookId(book.name)
        if (bookId && book.chapters) {
          for (const chapterData of book.chapters) {
            if (chapterData.verses) {
              for (const verse of chapterData.verses) {
                verses.push({
                  translationId,
                  bookId,
                  chapter: chapterData.chapter,
                  verse: verse.verse,
                  text: verse.text.trim(),
                })
              }
            }
          }
        }
      }
    } else if (rawData.verses) {
      // Format: { verses: [...] }
      for (const verse of rawData.verses) {
        const bookId = getBookId(verse.book)
        if (bookId) {
          verses.push({
            translationId,
            bookId,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text.trim(),
          })
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${translationId} data:`, error)
  }

  return {
    translation: {
      id: translationId,
      name: BIBLE_SOURCES[translationId]?.name || translationId.toUpperCase(),
      abbreviation: translationId.toUpperCase(),
      isPublicDomain: true,
    },
    verses,
    stats: {
      totalVerses: verses.length,
      books: [...new Set(verses.map((v) => v.bookId))].length,
      downloadDate: new Date().toISOString(),
    },
  }
}

function getBookId(bookName) {
  if (!bookName) return null

  // Direct mapping
  if (BOOK_MAPPINGS[bookName]) {
    return BOOK_MAPPINGS[bookName]
  }

  // Try case-insensitive search
  for (const [name, id] of Object.entries(BOOK_MAPPINGS)) {
    if (name.toLowerCase() === bookName.toLowerCase()) {
      return id
    }
  }

  // Try partial matches
  for (const [name, id] of Object.entries(BOOK_MAPPINGS)) {
    if (name.toLowerCase().includes(bookName.toLowerCase()) || bookName.toLowerCase().includes(name.toLowerCase())) {
      return id
    }
  }

  console.warn(`Unknown book: ${bookName}`)
  return null
}

async function createSampleData() {
  console.log("\n📝 Creating sample Bible data...")

  const sampleVerses = [
    // Genesis 1:1-3
    {
      translationId: "kjv",
      bookId: "gen",
      chapter: 1,
      verse: 1,
      text: "In the beginning God created the heaven and the earth.",
    },
    {
      translationId: "kjv",
      bookId: "gen",
      chapter: 1,
      verse: 2,
      text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
    },
    {
      translationId: "kjv",
      bookId: "gen",
      chapter: 1,
      verse: 3,
      text: "And God said, Let there be light: and there was light.",
    },

    // John 3:16-17
    {
      translationId: "kjv",
      bookId: "joh",
      chapter: 3,
      verse: 16,
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    },
    {
      translationId: "kjv",
      bookId: "joh",
      chapter: 3,
      verse: 17,
      text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
    },

    // Psalm 23:1-4
    { translationId: "kjv", bookId: "psa", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
    {
      translationId: "kjv",
      bookId: "psa",
      chapter: 23,
      verse: 2,
      text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    },
    {
      translationId: "kjv",
      bookId: "psa",
      chapter: 23,
      verse: 3,
      text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    },
    {
      translationId: "kjv",
      bookId: "psa",
      chapter: 23,
      verse: 4,
      text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    },

    // Popular verses
    {
      translationId: "kjv",
      bookId: "rom",
      chapter: 8,
      verse: 28,
      text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    },
    {
      translationId: "kjv",
      bookId: "phi",
      chapter: 4,
      verse: 13,
      text: "I can do all things through Christ which strengtheneth me.",
    },
    {
      translationId: "kjv",
      bookId: "jer",
      chapter: 29,
      verse: 11,
      text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    },
    {
      translationId: "kjv",
      bookId: "isa",
      chapter: 40,
      verse: 31,
      text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    },
    {
      translationId: "kjv",
      bookId: "pro",
      chapter: 3,
      verse: 5,
      text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    },
    {
      translationId: "kjv",
      bookId: "pro",
      chapter: 3,
      verse: 6,
      text: "In all thy ways acknowledge him, and he shall direct thy paths.",
    },
  ]

  const dataDir = "./public/data/bibles"
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const sampleData = {
    translation: {
      id: "kjv",
      name: "King James Version",
      abbreviation: "KJV",
      isPublicDomain: true,
    },
    verses: sampleVerses,
    stats: {
      totalVerses: sampleVerses.length,
      books: [...new Set(sampleVerses.map((v) => v.bookId))].length,
      downloadDate: new Date().toISOString(),
    },
  }

  const filePath = path.join(dataDir, "kjv-sample.json")
  fs.writeFileSync(filePath, JSON.stringify(sampleData, null, 2))

  console.log(`✅ Created sample data: ${sampleVerses.length} verses`)
  console.log(`📁 Saved to: ${filePath}`)
}

async function main() {
  console.log("🚀 Bible Download Script Starting...")
  console.log("📚 Downloading public domain Bible translations")

  let successCount = 0

  for (const [translationId, source] of Object.entries(BIBLE_SOURCES)) {
    const success = await downloadBible(translationId, source)
    if (success) successCount++
  }

  // Always create sample data as fallback
  await createSampleData()

  console.log("\n📊 Download Summary:")
  console.log(`✅ Successfully downloaded: ${successCount}/${Object.keys(BIBLE_SOURCES).length} translations`)
  console.log("📝 Sample data created as fallback")
  console.log("\n🎉 Bible download complete!")
  console.log("💡 You can now use the Bible database in your application")
}

// Run the script
main().catch(console.error)
