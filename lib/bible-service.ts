// Bible books data with chapter counts
const BIBLE_BOOKS = [
  // Old Testament
  { name: "Genesis", chapters: 50, testament: "old" },
  { name: "Exodus", chapters: 40, testament: "old" },
  { name: "Leviticus", chapters: 27, testament: "old" },
  { name: "Numbers", chapters: 36, testament: "old" },
  { name: "Deuteronomy", chapters: 34, testament: "old" },
  { name: "Joshua", chapters: 24, testament: "old" },
  { name: "Judges", chapters: 21, testament: "old" },
  { name: "Ruth", chapters: 4, testament: "old" },
  { name: "1 Samuel", chapters: 31, testament: "old" },
  { name: "2 Samuel", chapters: 24, testament: "old" },
  { name: "1 Kings", chapters: 22, testament: "old" },
  { name: "2 Kings", chapters: 25, testament: "old" },
  { name: "1 Chronicles", chapters: 29, testament: "old" },
  { name: "2 Chronicles", chapters: 36, testament: "old" },
  { name: "Ezra", chapters: 10, testament: "old" },
  { name: "Nehemiah", chapters: 13, testament: "old" },
  { name: "Esther", chapters: 10, testament: "old" },
  { name: "Job", chapters: 42, testament: "old" },
  { name: "Psalms", chapters: 150, testament: "old" },
  { name: "Proverbs", chapters: 31, testament: "old" },
  { name: "Ecclesiastes", chapters: 12, testament: "old" },
  { name: "Song of Solomon", chapters: 8, testament: "old" },
  { name: "Isaiah", chapters: 66, testament: "old" },
  { name: "Jeremiah", chapters: 52, testament: "old" },
  { name: "Lamentations", chapters: 5, testament: "old" },
  { name: "Ezekiel", chapters: 48, testament: "old" },
  { name: "Daniel", chapters: 12, testament: "old" },
  { name: "Hosea", chapters: 14, testament: "old" },
  { name: "Joel", chapters: 3, testament: "old" },
  { name: "Amos", chapters: 9, testament: "old" },
  { name: "Obadiah", chapters: 1, testament: "old" },
  { name: "Jonah", chapters: 4, testament: "old" },
  { name: "Micah", chapters: 7, testament: "old" },
  { name: "Nahum", chapters: 3, testament: "old" },
  { name: "Habakkuk", chapters: 3, testament: "old" },
  { name: "Zephaniah", chapters: 3, testament: "old" },
  { name: "Haggai", chapters: 2, testament: "old" },
  { name: "Zechariah", chapters: 14, testament: "old" },
  { name: "Malachi", chapters: 4, testament: "old" },

  // New Testament
  { name: "Matthew", chapters: 28, testament: "new" },
  { name: "Mark", chapters: 16, testament: "new" },
  { name: "Luke", chapters: 24, testament: "new" },
  { name: "John", chapters: 21, testament: "new" },
  { name: "Acts", chapters: 28, testament: "new" },
  { name: "Romans", chapters: 16, testament: "new" },
  { name: "1 Corinthians", chapters: 16, testament: "new" },
  { name: "2 Corinthians", chapters: 13, testament: "new" },
  { name: "Galatians", chapters: 6, testament: "new" },
  { name: "Ephesians", chapters: 6, testament: "new" },
  { name: "Philippians", chapters: 4, testament: "new" },
  { name: "Colossians", chapters: 4, testament: "new" },
  { name: "1 Thessalonians", chapters: 5, testament: "new" },
  { name: "2 Thessalonians", chapters: 3, testament: "new" },
  { name: "1 Timothy", chapters: 6, testament: "new" },
  { name: "2 Timothy", chapters: 4, testament: "new" },
  { name: "Titus", chapters: 3, testament: "new" },
  { name: "Philemon", chapters: 1, testament: "new" },
  { name: "Hebrews", chapters: 13, testament: "new" },
  { name: "James", chapters: 5, testament: "new" },
  { name: "1 Peter", chapters: 5, testament: "new" },
  { name: "2 Peter", chapters: 3, testament: "new" },
  { name: "1 John", chapters: 5, testament: "new" },
  { name: "2 John", chapters: 1, testament: "new" },
  { name: "3 John", chapters: 1, testament: "new" },
  { name: "Jude", chapters: 1, testament: "new" },
  { name: "Revelation", chapters: 22, testament: "new" },
]

// Book name variations and aliases
const BOOK_ALIASES: Record<string, string> = {
  // Common variations
  genesis: "Genesis",
  gen: "Genesis",
  exodus: "Exodus",
  exod: "Exodus",
  ex: "Exodus",
  leviticus: "Leviticus",
  lev: "Leviticus",
  numbers: "Numbers",
  num: "Numbers",
  deuteronomy: "Deuteronomy",
  deut: "Deuteronomy",
  dt: "Deuteronomy",
  joshua: "Joshua",
  josh: "Joshua",
  judges: "Judges",
  judg: "Judges",
  ruth: "Ruth",
  "1samuel": "1 Samuel",
  "1sam": "1 Samuel",
  "2samuel": "2 Samuel",
  "2sam": "2 Samuel",
  "1kings": "1 Kings",
  "1kgs": "1 Kings",
  "2kings": "2 Kings",
  "2kgs": "2 Kings",
  "1chronicles": "1 Chronicles",
  "1chron": "1 Chronicles",
  "1chr": "1 Chronicles",
  "2chronicles": "2 Chronicles",
  "2chron": "2 Chronicles",
  "2chr": "2 Chronicles",
  ezra: "Ezra",
  nehemiah: "Nehemiah",
  neh: "Nehemiah",
  esther: "Esther",
  est: "Esther",
  job: "Job",
  psalm: "Psalms",
  psalms: "Psalms",
  ps: "Psalms",
  psa: "Psalms",
  proverbs: "Proverbs",
  prov: "Proverbs",
  pr: "Proverbs",
  ecclesiastes: "Ecclesiastes",
  eccl: "Ecclesiastes",
  ecc: "Ecclesiastes",
  songofsolomon: "Song of Solomon",
  song: "Song of Solomon",
  sos: "Song of Solomon",
  isaiah: "Isaiah",
  isa: "Isaiah",
  jeremiah: "Jeremiah",
  jer: "Jeremiah",
  lamentations: "Lamentations",
  lam: "Lamentations",
  ezekiel: "Ezekiel",
  ezek: "Ezekiel",
  eze: "Ezekiel",
  daniel: "Daniel",
  dan: "Daniel",
  hosea: "Hosea",
  hos: "Hosea",
  joel: "Joel",
  amos: "Amos",
  obadiah: "Obadiah",
  obad: "Obadiah",
  jonah: "Jonah",
  jon: "Jonah",
  micah: "Micah",
  mic: "Micah",
  nahum: "Nahum",
  nah: "Nahum",
  habakkuk: "Habakkuk",
  hab: "Habakkuk",
  zephaniah: "Zephaniah",
  zeph: "Zephaniah",
  haggai: "Haggai",
  hag: "Haggai",
  zechariah: "Zechariah",
  zech: "Zechariah",
  malachi: "Malachi",
  mal: "Malachi",

  // New Testament
  matthew: "Matthew",
  matt: "Matthew",
  mt: "Matthew",
  mark: "Mark",
  mk: "Mark",
  luke: "Luke",
  lk: "Luke",
  john: "John",
  jn: "John",
  acts: "Acts",
  romans: "Romans",
  rom: "Romans",
  "1corinthians": "1 Corinthians",
  "1cor": "1 Corinthians",
  "2corinthians": "2 Corinthians",
  "2cor": "2 Corinthians",
  galatians: "Galatians",
  gal: "Galatians",
  ephesians: "Ephesians",
  eph: "Ephesians",
  philippians: "Philippians",
  phil: "Philippians",
  colossians: "Colossians",
  col: "Colossians",
  "1thessalonians": "1 Thessalonians",
  "1thess": "1 Thessalonians",
  "1th": "1 Thessalonians",
  "2thessalonians": "2 Thessalonians",
  "2thess": "2 Thessalonians",
  "2th": "2 Thessalonians",
  "1timothy": "1 Timothy",
  "1tim": "1 Timothy",
  "1ti": "1 Timothy",
  "2timothy": "2 Timothy",
  "2tim": "2 Timothy",
  "2ti": "2 Timothy",
  titus: "Titus",
  tit: "Titus",
  philemon: "Philemon",
  phlm: "Philemon",
  hebrews: "Hebrews",
  heb: "Hebrews",
  james: "James",
  jas: "James",
  "1peter": "1 Peter",
  "1pet": "1 Peter",
  "1pe": "1 Peter",
  "2peter": "2 Peter",
  "2pet": "2 Peter",
  "2pe": "2 Peter",
  "1john": "1 John",
  "1jn": "1 John",
  "2john": "2 John",
  "2jn": "2 John",
  "3john": "3 John",
  "3jn": "3 John",
  jude: "Jude",
  revelation: "Revelation",
  rev: "Revelation",
}

export interface BibleBook {
  name: string
  chapters: number
  testament: "old" | "new"
}

export interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
}

export interface BibleVerse {
  verse: number
  text: string
}

export class BibleService {
  static getAllBooks(): BibleBook[] {
    return BIBLE_BOOKS
  }

  static getBook(bookName: string): BibleBook | null {
    // Normalize the book name
    const normalizedName = this.normalizeBookName(bookName)
    if (!normalizedName) return null

    return BIBLE_BOOKS.find((book) => book.name === normalizedName) || null
  }

  static normalizeBookName(bookName: string): string | null {
    if (!bookName) return null

    // Remove extra spaces and convert to lowercase
    const cleaned = bookName.trim().toLowerCase().replace(/\s+/g, "")

    // Check direct match first
    const directMatch = BIBLE_BOOKS.find((book) => book.name.toLowerCase() === bookName.toLowerCase())
    if (directMatch) return directMatch.name

    // Check aliases
    if (BOOK_ALIASES[cleaned]) {
      return BOOK_ALIASES[cleaned]
    }

    // Check partial matches
    const partialMatch = BIBLE_BOOKS.find((book) => book.name.toLowerCase().includes(cleaned))
    if (partialMatch) return partialMatch.name

    return null
  }

  static getOldTestamentBooks(): BibleBook[] {
    return BIBLE_BOOKS.filter((book) => book.testament === "old")
  }

  static getNewTestamentBooks(): BibleBook[] {
    return BIBLE_BOOKS.filter((book) => book.testament === "new")
  }

  static isValidChapter(bookName: string, chapter: number): boolean {
    const book = this.getBook(bookName)
    if (!book) return false

    return chapter >= 1 && chapter <= book.chapters
  }

  static getBookChapterCount(bookName: string): number {
    const book = this.getBook(bookName)
    return book ? book.chapters : 0
  }

  static getNextChapter(bookName: string, chapter: number): { book: string; chapter: number } | null {
    const book = this.getBook(bookName)
    if (!book) return null

    // If not the last chapter of the book
    if (chapter < book.chapters) {
      return { book: bookName, chapter: chapter + 1 }
    }

    // Find next book
    const currentIndex = BIBLE_BOOKS.findIndex((b) => b.name === book.name)
    if (currentIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[currentIndex + 1]
      return { book: nextBook.name, chapter: 1 }
    }

    return null // Last chapter of the Bible
  }

  static getPreviousChapter(bookName: string, chapter: number): { book: string; chapter: number } | null {
    const book = this.getBook(bookName)
    if (!book) return null

    // If not the first chapter of the book
    if (chapter > 1) {
      return { book: bookName, chapter: chapter - 1 }
    }

    // Find previous book
    const currentIndex = BIBLE_BOOKS.findIndex((b) => b.name === book.name)
    if (currentIndex > 0) {
      const prevBook = BIBLE_BOOKS[currentIndex - 1]
      return { book: prevBook.name, chapter: prevBook.chapters }
    }

    return null // First chapter of the Bible
  }

  // Mock chapter data - in a real app, this would come from a Bible API
  static async getChapter(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const book = this.getBook(bookName)
    if (!book || !this.isValidChapter(bookName, chapter)) {
      return null
    }

    // This is mock data - replace with actual Bible API call
    const mockVerses: BibleVerse[] = Array.from({ length: 20 }, (_, i) => ({
      verse: i + 1,
      text: `This is verse ${i + 1} of ${bookName} chapter ${chapter}. In a real implementation, this would contain the actual Bible text from an API like ESV API, Bible Gateway, or YouVersion.`,
    }))

    return {
      book: book.name,
      chapter,
      verses: mockVerses,
    }
  }

  static searchBooks(query: string): BibleBook[] {
    if (!query) return []

    const normalizedQuery = query.toLowerCase()
    return BIBLE_BOOKS.filter((book) => book.name.toLowerCase().includes(normalizedQuery))
  }
}
