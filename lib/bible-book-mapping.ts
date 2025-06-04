export interface BibleBookInfo {
  name: string
  chapters: number
  testament: "old" | "new"
}

// Complete Bible book mapping with all variations
export const BIBLE_BOOKS: Record<string, BibleBookInfo> = {
  // Old Testament
  genesis: { name: "Genesis", chapters: 50, testament: "old" },
  gen: { name: "Genesis", chapters: 50, testament: "old" },
  ge: { name: "Genesis", chapters: 50, testament: "old" },

  exodus: { name: "Exodus", chapters: 40, testament: "old" },
  exod: { name: "Exodus", chapters: 40, testament: "old" },
  ex: { name: "Exodus", chapters: 40, testament: "old" },

  leviticus: { name: "Leviticus", chapters: 27, testament: "old" },
  lev: { name: "Leviticus", chapters: 27, testament: "old" },
  le: { name: "Leviticus", chapters: 27, testament: "old" },

  numbers: { name: "Numbers", chapters: 36, testament: "old" },
  num: { name: "Numbers", chapters: 36, testament: "old" },
  nu: { name: "Numbers", chapters: 36, testament: "old" },

  deuteronomy: { name: "Deuteronomy", chapters: 34, testament: "old" },
  deut: { name: "Deuteronomy", chapters: 34, testament: "old" },
  de: { name: "Deuteronomy", chapters: 34, testament: "old" },

  joshua: { name: "Joshua", chapters: 24, testament: "old" },
  josh: { name: "Joshua", chapters: 24, testament: "old" },
  jos: { name: "Joshua", chapters: 24, testament: "old" },

  judges: { name: "Judges", chapters: 21, testament: "old" },
  judg: { name: "Judges", chapters: 21, testament: "old" },
  jdg: { name: "Judges", chapters: 21, testament: "old" },

  ruth: { name: "Ruth", chapters: 4, testament: "old" },
  ru: { name: "Ruth", chapters: 4, testament: "old" },

  "1samuel": { name: "1 Samuel", chapters: 31, testament: "old" },
  "1sam": { name: "1 Samuel", chapters: 31, testament: "old" },
  "1sa": { name: "1 Samuel", chapters: 31, testament: "old" },
  "1 samuel": { name: "1 Samuel", chapters: 31, testament: "old" },
  "1 sam": { name: "1 Samuel", chapters: 31, testament: "old" },

  "2samuel": { name: "2 Samuel", chapters: 24, testament: "old" },
  "2sam": { name: "2 Samuel", chapters: 24, testament: "old" },
  "2sa": { name: "2 Samuel", chapters: 24, testament: "old" },
  "2 samuel": { name: "2 Samuel", chapters: 24, testament: "old" },
  "2 sam": { name: "2 Samuel", chapters: 24, testament: "old" },

  "1kings": { name: "1 Kings", chapters: 22, testament: "old" },
  "1kgs": { name: "1 Kings", chapters: 22, testament: "old" },
  "1ki": { name: "1 Kings", chapters: 22, testament: "old" },
  "1 kings": { name: "1 Kings", chapters: 22, testament: "old" },

  "2kings": { name: "2 Kings", chapters: 25, testament: "old" },
  "2kgs": { name: "2 Kings", chapters: 25, testament: "old" },
  "2ki": { name: "2 Kings", chapters: 25, testament: "old" },
  "2 kings": { name: "2 Kings", chapters: 25, testament: "old" },

  "1chronicles": { name: "1 Chronicles", chapters: 29, testament: "old" },
  "1chron": { name: "1 Chronicles", chapters: 29, testament: "old" },
  "1chr": { name: "1 Chronicles", chapters: 29, testament: "old" },
  "1ch": { name: "1 Chronicles", chapters: 29, testament: "old" },
  "1 chronicles": { name: "1 Chronicles", chapters: 29, testament: "old" },

  "2chronicles": { name: "2 Chronicles", chapters: 36, testament: "old" },
  "2chron": { name: "2 Chronicles", chapters: 36, testament: "old" },
  "2chr": { name: "2 Chronicles", chapters: 36, testament: "old" },
  "2ch": { name: "2 Chronicles", chapters: 36, testament: "old" },
  "2 chronicles": { name: "2 Chronicles", chapters: 36, testament: "old" },

  ezra: { name: "Ezra", chapters: 10, testament: "old" },
  ezr: { name: "Ezra", chapters: 10, testament: "old" },

  nehemiah: { name: "Nehemiah", chapters: 13, testament: "old" },
  neh: { name: "Nehemiah", chapters: 13, testament: "old" },
  ne: { name: "Nehemiah", chapters: 13, testament: "old" },

  esther: { name: "Esther", chapters: 10, testament: "old" },
  esth: { name: "Esther", chapters: 10, testament: "old" },
  es: { name: "Esther", chapters: 10, testament: "old" },

  job: { name: "Job", chapters: 42, testament: "old" },

  psalms: { name: "Psalms", chapters: 150, testament: "old" },
  psalm: { name: "Psalms", chapters: 150, testament: "old" },
  ps: { name: "Psalms", chapters: 150, testament: "old" },
  psa: { name: "Psalms", chapters: 150, testament: "old" },

  proverbs: { name: "Proverbs", chapters: 31, testament: "old" },
  prov: { name: "Proverbs", chapters: 31, testament: "old" },
  pr: { name: "Proverbs", chapters: 31, testament: "old" },

  ecclesiastes: { name: "Ecclesiastes", chapters: 12, testament: "old" },
  eccles: { name: "Ecclesiastes", chapters: 12, testament: "old" },
  ecc: { name: "Ecclesiastes", chapters: 12, testament: "old" },
  ec: { name: "Ecclesiastes", chapters: 12, testament: "old" },

  songofsolomon: { name: "Song of Solomon", chapters: 8, testament: "old" },
  "song of solomon": { name: "Song of Solomon", chapters: 8, testament: "old" },
  "song of songs": { name: "Song of Solomon", chapters: 8, testament: "old" },
  song: { name: "Song of Solomon", chapters: 8, testament: "old" },
  sos: { name: "Song of Solomon", chapters: 8, testament: "old" },

  isaiah: { name: "Isaiah", chapters: 66, testament: "old" },
  isa: { name: "Isaiah", chapters: 66, testament: "old" },
  is: { name: "Isaiah", chapters: 66, testament: "old" },

  jeremiah: { name: "Jeremiah", chapters: 52, testament: "old" },
  jer: { name: "Jeremiah", chapters: 52, testament: "old" },
  je: { name: "Jeremiah", chapters: 52, testament: "old" },

  lamentations: { name: "Lamentations", chapters: 5, testament: "old" },
  lam: { name: "Lamentations", chapters: 5, testament: "old" },
  la: { name: "Lamentations", chapters: 5, testament: "old" },

  ezekiel: { name: "Ezekiel", chapters: 48, testament: "old" },
  ezek: { name: "Ezekiel", chapters: 48, testament: "old" },
  eze: { name: "Ezekiel", chapters: 48, testament: "old" },

  daniel: { name: "Daniel", chapters: 12, testament: "old" },
  dan: { name: "Daniel", chapters: 12, testament: "old" },
  da: { name: "Daniel", chapters: 12, testament: "old" },

  hosea: { name: "Hosea", chapters: 14, testament: "old" },
  hos: { name: "Hosea", chapters: 14, testament: "old" },
  ho: { name: "Hosea", chapters: 14, testament: "old" },

  joel: { name: "Joel", chapters: 3, testament: "old" },
  joe: { name: "Joel", chapters: 3, testament: "old" },

  amos: { name: "Amos", chapters: 9, testament: "old" },
  am: { name: "Amos", chapters: 9, testament: "old" },

  obadiah: { name: "Obadiah", chapters: 1, testament: "old" },
  obad: { name: "Obadiah", chapters: 1, testament: "old" },
  ob: { name: "Obadiah", chapters: 1, testament: "old" },

  jonah: { name: "Jonah", chapters: 4, testament: "old" },
  jon: { name: "Jonah", chapters: 4, testament: "old" },

  micah: { name: "Micah", chapters: 7, testament: "old" },
  mic: { name: "Micah", chapters: 7, testament: "old" },

  nahum: { name: "Nahum", chapters: 3, testament: "old" },
  nah: { name: "Nahum", chapters: 3, testament: "old" },
  na: { name: "Nahum", chapters: 3, testament: "old" },

  habakkuk: { name: "Habakkuk", chapters: 3, testament: "old" },
  hab: { name: "Habakkuk", chapters: 3, testament: "old" },

  zephaniah: { name: "Zephaniah", chapters: 3, testament: "old" },
  zeph: { name: "Zephaniah", chapters: 3, testament: "old" },
  zep: { name: "Zephaniah", chapters: 3, testament: "old" },

  haggai: { name: "Haggai", chapters: 2, testament: "old" },
  hag: { name: "Haggai", chapters: 2, testament: "old" },

  zechariah: { name: "Zechariah", chapters: 14, testament: "old" },
  zech: { name: "Zechariah", chapters: 14, testament: "old" },
  zec: { name: "Zechariah", chapters: 14, testament: "old" },

  malachi: { name: "Malachi", chapters: 4, testament: "old" },
  mal: { name: "Malachi", chapters: 4, testament: "old" },

  // New Testament
  matthew: { name: "Matthew", chapters: 28, testament: "new" },
  matt: { name: "Matthew", chapters: 28, testament: "new" },
  mt: { name: "Matthew", chapters: 28, testament: "new" },

  mark: { name: "Mark", chapters: 16, testament: "new" },
  mk: { name: "Mark", chapters: 16, testament: "new" },

  luke: { name: "Luke", chapters: 24, testament: "new" },
  lk: { name: "Luke", chapters: 24, testament: "new" },

  john: { name: "John", chapters: 21, testament: "new" },
  jn: { name: "John", chapters: 21, testament: "new" },

  acts: { name: "Acts", chapters: 28, testament: "new" },
  ac: { name: "Acts", chapters: 28, testament: "new" },

  romans: { name: "Romans", chapters: 16, testament: "new" },
  rom: { name: "Romans", chapters: 16, testament: "new" },
  ro: { name: "Romans", chapters: 16, testament: "new" },

  "1corinthians": { name: "1 Corinthians", chapters: 16, testament: "new" },
  "1cor": { name: "1 Corinthians", chapters: 16, testament: "new" },
  "1co": { name: "1 Corinthians", chapters: 16, testament: "new" },
  "1 corinthians": { name: "1 Corinthians", chapters: 16, testament: "new" },
  "1 cor": { name: "1 Corinthians", chapters: 16, testament: "new" },

  "2corinthians": { name: "2 Corinthians", chapters: 13, testament: "new" },
  "2cor": { name: "2 Corinthians", chapters: 13, testament: "new" },
  "2co": { name: "2 Corinthians", chapters: 13, testament: "new" },
  "2 corinthians": { name: "2 Corinthians", chapters: 13, testament: "new" },
  "2 cor": { name: "2 Corinthians", chapters: 13, testament: "new" },

  galatians: { name: "Galatians", chapters: 6, testament: "new" },
  gal: { name: "Galatians", chapters: 6, testament: "new" },
  ga: { name: "Galatians", chapters: 6, testament: "new" },

  ephesians: { name: "Ephesians", chapters: 6, testament: "new" },
  eph: { name: "Ephesians", chapters: 6, testament: "new" },

  philippians: { name: "Philippians", chapters: 4, testament: "new" },
  phil: { name: "Philippians", chapters: 4, testament: "new" },
  php: { name: "Philippians", chapters: 4, testament: "new" },

  colossians: { name: "Colossians", chapters: 4, testament: "new" },
  col: { name: "Colossians", chapters: 4, testament: "new" },

  "1thessalonians": { name: "1 Thessalonians", chapters: 5, testament: "new" },
  "1thess": { name: "1 Thessalonians", chapters: 5, testament: "new" },
  "1th": { name: "1 Thessalonians", chapters: 5, testament: "new" },
  "1 thessalonians": { name: "1 Thessalonians", chapters: 5, testament: "new" },
  "1 thess": { name: "1 Thessalonians", chapters: 5, testament: "new" },

  "2thessalonians": { name: "2 Thessalonians", chapters: 3, testament: "new" },
  "2thess": { name: "2 Thessalonians", chapters: 3, testament: "new" },
  "2th": { name: "2 Thessalonians", chapters: 3, testament: "new" },
  "2 thessalonians": { name: "2 Thessalonians", chapters: 3, testament: "new" },
  "2 thess": { name: "2 Thessalonians", chapters: 3, testament: "new" },

  "1timothy": { name: "1 Timothy", chapters: 6, testament: "new" },
  "1tim": { name: "1 Timothy", chapters: 6, testament: "new" },
  "1ti": { name: "1 Timothy", chapters: 6, testament: "new" },
  "1 timothy": { name: "1 Timothy", chapters: 6, testament: "new" },
  "1 tim": { name: "1 Timothy", chapters: 6, testament: "new" },

  "2timothy": { name: "2 Timothy", chapters: 4, testament: "new" },
  "2tim": { name: "2 Timothy", chapters: 4, testament: "new" },
  "2ti": { name: "2 Timothy", chapters: 4, testament: "new" },
  "2 timothy": { name: "2 Timothy", chapters: 4, testament: "new" },
  "2 tim": { name: "2 Timothy", chapters: 4, testament: "new" },

  titus: { name: "Titus", chapters: 3, testament: "new" },
  tit: { name: "Titus", chapters: 3, testament: "new" },

  philemon: { name: "Philemon", chapters: 1, testament: "new" },
  phlm: { name: "Philemon", chapters: 1, testament: "new" },
  phm: { name: "Philemon", chapters: 1, testament: "new" },

  hebrews: { name: "Hebrews", chapters: 13, testament: "new" },
  heb: { name: "Hebrews", chapters: 13, testament: "new" },

  james: { name: "James", chapters: 5, testament: "new" },
  jas: { name: "James", chapters: 5, testament: "new" },

  "1peter": { name: "1 Peter", chapters: 5, testament: "new" },
  "1pet": { name: "1 Peter", chapters: 5, testament: "new" },
  "1pe": { name: "1 Peter", chapters: 5, testament: "new" },
  "1 peter": { name: "1 Peter", chapters: 5, testament: "new" },
  "1 pet": { name: "1 Peter", chapters: 5, testament: "new" },

  "2peter": { name: "2 Peter", chapters: 3, testament: "new" },
  "2pet": { name: "2 Peter", chapters: 3, testament: "new" },
  "2pe": { name: "2 Peter", chapters: 3, testament: "new" },
  "2 peter": { name: "2 Peter", chapters: 3, testament: "new" },
  "2 pet": { name: "2 Peter", chapters: 3, testament: "new" },

  "1john": { name: "1 John", chapters: 5, testament: "new" },
  "1jn": { name: "1 John", chapters: 5, testament: "new" },
  "1 john": { name: "1 John", chapters: 5, testament: "new" },

  "2john": { name: "2 John", chapters: 1, testament: "new" },
  "2jn": { name: "2 John", chapters: 1, testament: "new" },
  "2 john": { name: "2 John", chapters: 1, testament: "new" },

  "3john": { name: "3 John", chapters: 1, testament: "new" },
  "3jn": { name: "3 John", chapters: 1, testament: "new" },
  "3 john": { name: "3 John", chapters: 1, testament: "new" },

  jude: { name: "Jude", chapters: 1, testament: "new" },

  revelation: { name: "Revelation", chapters: 22, testament: "new" },
  rev: { name: "Revelation", chapters: 22, testament: "new" },
  re: { name: "Revelation", chapters: 22, testament: "new" },
}

// Normalize book name to match database format
export function normalizeBookName(bookName: string): string | null {
  if (!bookName) return null

  // Convert to lowercase and remove extra spaces
  const normalized = bookName.toLowerCase().trim().replace(/\s+/g, " ")

  // Direct lookup
  if (BIBLE_BOOKS[normalized]) {
    return normalized
  }

  // Try without spaces for numbered books
  const withoutSpaces = normalized.replace(/\s/g, "")
  if (BIBLE_BOOKS[withoutSpaces]) {
    return withoutSpaces
  }

  // Try common variations
  const variations = [
    normalized.replace(/\s/g, ""),
    normalized.replace(/\./g, ""),
    normalized.replace(/\s/g, "").replace(/\./g, ""),
  ]

  for (const variation of variations) {
    if (BIBLE_BOOKS[variation]) {
      return variation
    }
  }

  return null
}

// Get book information
export function getBookInfo(bookName: string): BibleBookInfo | null {
  const normalized = normalizeBookName(bookName)
  if (!normalized) return null

  return BIBLE_BOOKS[normalized] || null
}

// Get all books
export function getAllBooks(): Array<{ id: string; info: BibleBookInfo }> {
  // Get unique books (avoid duplicates from abbreviations)
  const uniqueBooks = new Map<string, { id: string; info: BibleBookInfo }>()

  for (const [id, info] of Object.entries(BIBLE_BOOKS)) {
    const key = `${info.name}-${info.chapters}`
    if (!uniqueBooks.has(key)) {
      uniqueBooks.set(key, { id, info })
    }
  }

  return Array.from(uniqueBooks.values()).sort((a, b) => {
    // Sort by testament first, then by order
    if (a.info.testament !== b.info.testament) {
      return a.info.testament === "old" ? -1 : 1
    }
    return a.info.name.localeCompare(b.info.name)
  })
}
