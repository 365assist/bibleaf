interface Translation {
  version: string
  name: string
  text: string
  language: string
  year: number
  notes?: string
}

interface VerseTranslations {
  [reference: string]: Translation[]
}

export class TranslationService {
  private translations: VerseTranslations = {
    "john 3:16": [
      {
        version: "NIV",
        name: "New International Version",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        language: "English",
        year: 2011,
      },
      {
        version: "ESV",
        name: "English Standard Version",
        text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        language: "English",
        year: 2001,
      },
      {
        version: "KJV",
        name: "King James Version",
        text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        language: "English",
        year: 1611,
        notes: "Classic English translation with historical significance",
      },
      {
        version: "NASB",
        name: "New American Standard Bible",
        text: "For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish, but have eternal life.",
        language: "English",
        year: 2020,
      },
      {
        version: "NLT",
        name: "New Living Translation",
        text: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
        language: "English",
        year: 2015,
        notes: "Thought-for-thought translation for clarity",
      },
      {
        version: "GREEK",
        name: "Greek (Textus Receptus)",
        text: "οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλὰ ἔχῃ ζωὴν αἰώνιον.",
        language: "Greek",
        year: 100,
        notes: "Original New Testament Greek text",
      },
    ],
  }

  getTranslations(reference: string): Translation[] {
    const normalizedRef = reference.toLowerCase().trim()
    return this.translations[normalizedRef] || []
  }

  getTranslation(reference: string, version: string): Translation | null {
    const translations = this.getTranslations(reference)
    return translations.find((t) => t.version.toUpperCase() === version.toUpperCase()) || null
  }

  getSupportedVersions(): string[] {
    return ["NIV", "ESV", "KJV", "NASB", "NLT", "CSB", "HCSB", "NET", "GREEK", "HEBREW"]
  }

  getVersionInfo(version: string): { name: string; description: string; year: number } | null {
    const versionMap: { [key: string]: { name: string; description: string; year: number } } = {
      NIV: {
        name: "New International Version",
        description: "Balanced approach between word-for-word and thought-for-thought translation",
        year: 2011,
      },
      ESV: {
        name: "English Standard Version",
        description: "Essentially literal translation emphasizing word-for-word accuracy",
        year: 2001,
      },
      KJV: {
        name: "King James Version",
        description: "Historic English translation with traditional language",
        year: 1611,
      },
      NASB: {
        name: "New American Standard Bible",
        description: "Highly literal translation prioritizing accuracy to original texts",
        year: 2020,
      },
      NLT: {
        name: "New Living Translation",
        description: "Thought-for-thought translation emphasizing clarity and readability",
        year: 2015,
      },
      GREEK: {
        name: "Greek New Testament",
        description: "Original Greek text of the New Testament",
        year: 100,
      },
    }

    return versionMap[version.toUpperCase()] || null
  }

  compareTranslations(reference: string, versions: string[]): Translation[] {
    const allTranslations = this.getTranslations(reference)
    return versions
      .map((version) => allTranslations.find((t) => t.version.toUpperCase() === version.toUpperCase()))
      .filter((t): t is Translation => t !== undefined)
  }

  async getOriginalLanguageInsight(reference: string): Promise<{
    originalText: string
    keyWords: Array<{
      word: string
      transliteration: string
      meaning: string
      significance: string
    }>
    grammaticalNotes: string
  } | null> {
    // This would integrate with biblical language databases
    // For now, return sample data for John 3:16
    if (reference.toLowerCase().includes("john 3:16")) {
      return {
        originalText: "οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον...",
        keyWords: [
          {
            word: "ἠγάπησεν",
            transliteration: "ēgapēsen",
            meaning: "loved (aorist active indicative)",
            significance: "Refers to God's unconditional, sacrificial love (agape)",
          },
          {
            word: "μονογενῆ",
            transliteration: "monogenē",
            meaning: "one and only, unique",
            significance: "Emphasizes Christ's unique relationship with the Father",
          },
          {
            word: "αἰώνιον",
            transliteration: "aiōnion",
            meaning: "eternal, everlasting",
            significance: "Not just endless time, but quality of divine life",
          },
        ],
        grammaticalNotes:
          "The aorist tense of 'loved' indicates a completed action in the past, referring to God's decisive act of love in sending Christ.",
      }
    }

    return null
  }
}

export const translationService = new TranslationService()
