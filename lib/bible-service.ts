export interface BibleVerse {
  verse: number
  text: string
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
  testament: "Old" | "New"
}

export class BibleService {
  private static books: BibleBook[] = [
    // Old Testament
    { name: "Genesis", chapters: 50, testament: "Old" },
    { name: "Exodus", chapters: 40, testament: "Old" },
    { name: "Leviticus", chapters: 27, testament: "Old" },
    { name: "Numbers", chapters: 36, testament: "Old" },
    { name: "Deuteronomy", chapters: 34, testament: "Old" },
    { name: "Joshua", chapters: 24, testament: "Old" },
    { name: "Judges", chapters: 21, testament: "Old" },
    { name: "Ruth", chapters: 4, testament: "Old" },
    { name: "1 Samuel", chapters: 31, testament: "Old" },
    { name: "2 Samuel", chapters: 24, testament: "Old" },
    { name: "1 Kings", chapters: 22, testament: "Old" },
    { name: "2 Kings", chapters: 25, testament: "Old" },
    { name: "1 Chronicles", chapters: 29, testament: "Old" },
    { name: "2 Chronicles", chapters: 36, testament: "Old" },
    { name: "Ezra", chapters: 10, testament: "Old" },
    { name: "Nehemiah", chapters: 13, testament: "Old" },
    { name: "Esther", chapters: 10, testament: "Old" },
    { name: "Job", chapters: 42, testament: "Old" },
    { name: "Psalms", chapters: 150, testament: "Old" },
    { name: "Proverbs", chapters: 31, testament: "Old" },
    { name: "Ecclesiastes", chapters: 12, testament: "Old" },
    { name: "Song of Solomon", chapters: 8, testament: "Old" },
    { name: "Isaiah", chapters: 66, testament: "Old" },
    { name: "Jeremiah", chapters: 52, testament: "Old" },
    { name: "Lamentations", chapters: 5, testament: "Old" },
    { name: "Ezekiel", chapters: 48, testament: "Old" },
    { name: "Daniel", chapters: 12, testament: "Old" },
    { name: "Hosea", chapters: 14, testament: "Old" },
    { name: "Joel", chapters: 3, testament: "Old" },
    { name: "Amos", chapters: 9, testament: "Old" },
    { name: "Obadiah", chapters: 1, testament: "Old" },
    { name: "Jonah", chapters: 4, testament: "Old" },
    { name: "Micah", chapters: 7, testament: "Old" },
    { name: "Nahum", chapters: 3, testament: "Old" },
    { name: "Habakkuk", chapters: 3, testament: "Old" },
    { name: "Zephaniah", chapters: 3, testament: "Old" },
    { name: "Haggai", chapters: 2, testament: "Old" },
    { name: "Zechariah", chapters: 14, testament: "Old" },
    { name: "Malachi", chapters: 4, testament: "Old" },

    // New Testament
    { name: "Matthew", chapters: 28, testament: "New" },
    { name: "Mark", chapters: 16, testament: "New" },
    { name: "Luke", chapters: 24, testament: "New" },
    { name: "John", chapters: 21, testament: "New" },
    { name: "Acts", chapters: 28, testament: "New" },
    { name: "Romans", chapters: 16, testament: "New" },
    { name: "1 Corinthians", chapters: 16, testament: "New" },
    { name: "2 Corinthians", chapters: 13, testament: "New" },
    { name: "Galatians", chapters: 6, testament: "New" },
    { name: "Ephesians", chapters: 6, testament: "New" },
    { name: "Philippians", chapters: 4, testament: "New" },
    { name: "Colossians", chapters: 4, testament: "New" },
    { name: "1 Thessalonians", chapters: 5, testament: "New" },
    { name: "2 Thessalonians", chapters: 3, testament: "New" },
    { name: "1 Timothy", chapters: 6, testament: "New" },
    { name: "2 Timothy", chapters: 4, testament: "New" },
    { name: "Titus", chapters: 3, testament: "New" },
    { name: "Philemon", chapters: 1, testament: "New" },
    { name: "Hebrews", chapters: 13, testament: "New" },
    { name: "James", chapters: 5, testament: "New" },
    { name: "1 Peter", chapters: 5, testament: "New" },
    { name: "2 Peter", chapters: 3, testament: "New" },
    { name: "1 John", chapters: 5, testament: "New" },
    { name: "2 John", chapters: 1, testament: "New" },
    { name: "3 John", chapters: 1, testament: "New" },
    { name: "Jude", chapters: 1, testament: "New" },
    { name: "Revelation", chapters: 22, testament: "New" },
  ]

  static getBooks(): BibleBook[] {
    return this.books
  }

  static getBook(bookName: string): BibleBook | undefined {
    return this.books.find(
      (book) =>
        book.name.toLowerCase() === bookName.toLowerCase() ||
        book.name.toLowerCase().replace(/\s+/g, "") === bookName.toLowerCase().replace(/\s+/g, ""),
    )
  }

  static parseReference(reference: string): { book: string; chapter: number; verse?: number } | null {
    // Parse references like "John 3:16", "Psalm 23", "1 Corinthians 13:4-7"
    const match = reference.match(/^((?:\d\s+)?[A-Za-z\s]+)\s+(\d+)(?::(\d+))?/)
    if (!match) return null

    const book = match[1].trim()
    const chapter = Number.parseInt(match[2])
    const verse = match[3] ? Number.parseInt(match[3]) : undefined

    return { book, chapter, verse }
  }

  static async getChapter(book: string, chapter: number, translation = "NIV"): Promise<BibleChapter | null> {
    // In a real app, this would fetch from a Bible API
    // For demo purposes, we'll return sample content for popular chapters

    const sampleChapters: Record<string, BibleChapter> = {
      "john-3": {
        book: "John",
        chapter: 3,
        translation: "NIV",
        verses: [
          {
            verse: 1,
            text: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.",
          },
          {
            verse: 2,
            text: "He came to Jesus at night and said, 'Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.'",
          },
          {
            verse: 3,
            text: "Jesus replied, 'Very truly I tell you, no one can see the kingdom of God unless they are born again.'",
          },
          {
            verse: 4,
            text: "'How can someone be born when they are old?' Nicodemus asked. 'Surely they cannot enter a second time into their mother's womb to be born!'",
          },
          {
            verse: 5,
            text: "Jesus answered, 'Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.",
          },
          { verse: 6, text: "Flesh gives birth to flesh, but the Spirit gives birth to spirit." },
          { verse: 7, text: "You should not be surprised at my saying, 'You must be born again.'" },
          {
            verse: 8,
            text: "The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit.",
          },
          { verse: 9, text: "How can this be?' Nicodemus asked." },
          { verse: 10, text: "You are Israel's teacher,' said Jesus, 'and do you not understand these things?" },
          {
            verse: 11,
            text: "Very truly I tell you, we speak of what we know, and we testify to what we have seen, but still you people do not accept our testimony.",
          },
          {
            verse: 12,
            text: "I have spoken to you of earthly things and you do not believe; how then will you believe if I speak of heavenly things?",
          },
          { verse: 13, text: "No one has ever gone into heaven except the one who came from heaven—the Son of Man." },
          {
            verse: 14,
            text: "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,",
          },
          { verse: 15, text: "that everyone who believes may have eternal life in him." },
          {
            verse: 16,
            text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          },
          {
            verse: 17,
            text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
          },
          {
            verse: 18,
            text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son.",
          },
          {
            verse: 19,
            text: "This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil.",
          },
          {
            verse: 20,
            text: "Everyone who does evil hates the light, and will not come into the light for fear that their deeds will be exposed.",
          },
          {
            verse: 21,
            text: "But whoever lives by the truth comes into the light, so that it may be seen plainly that what they have done has been done in the sight of God.",
          },
        ],
      },
      "psalm-23": {
        book: "Psalms",
        chapter: 23,
        translation: "NIV",
        verses: [
          { verse: 1, text: "The Lord is my shepherd, I lack nothing." },
          { verse: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
          { verse: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
          {
            verse: 4,
            text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          },
          {
            verse: 5,
            text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.",
          },
          {
            verse: 6,
            text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.",
          },
        ],
      },
      "romans-8": {
        book: "Romans",
        chapter: 8,
        translation: "NIV",
        verses: [
          { verse: 1, text: "Therefore, there is now no condemnation for those who are in Christ Jesus," },
          {
            verse: 2,
            text: "because through Christ Jesus the law of the Spirit who gives life has set you free from the law of sin and death.",
          },
          {
            verse: 3,
            text: "For what the law was powerless to do because it was weakened by the flesh, God did by sending his own Son in the likeness of sinful flesh to be a sin offering. And so he condemned sin in the flesh,",
          },
          {
            verse: 4,
            text: "in order that the righteous requirement of the law might be fully met in us, who do not live according to the flesh but according to the Spirit.",
          },
          // ... more verses would be here
          {
            verse: 28,
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          },
          {
            verse: 31,
            text: "What, then, shall we say in response to these things? If God is for us, who can be against us?",
          },
          {
            verse: 38,
            text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,",
          },
          {
            verse: 39,
            text: "neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
          },
        ],
      },
    }

    const key = `${book.toLowerCase().replace(/\s+/g, "")}-${chapter}`
    const chapter_data = sampleChapters[key]

    if (chapter_data) {
      return chapter_data
    }

    // Return a placeholder chapter for books/chapters not in our sample data
    const bookInfo = this.getBook(book)
    if (!bookInfo || chapter > bookInfo.chapters) {
      return null
    }

    return {
      book: bookInfo.name,
      chapter,
      translation,
      verses: [
        {
          verse: 1,
          text: `This is a placeholder for ${bookInfo.name} chapter ${chapter}. In a full implementation, this would contain the actual Bible text from a comprehensive Bible API or database.`,
        },
      ],
    }
  }
}
