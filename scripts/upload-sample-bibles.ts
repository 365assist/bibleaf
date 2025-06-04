// Script to upload sample Bible data to Vercel Blob storage
import { bibleBlobService, type BibleTranslationData } from "../lib/bible-blob-service"

// Sample KJV data
const kjvData: BibleTranslationData = {
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
    genesis: {
      1: {
        1: "In the beginning God created the heaven and the earth.",
        2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        3: "And God said, Let there be light: and there was light.",
      },
    },
    john: {
      3: {
        16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
        18: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
      },
      14: {
        6: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
      },
    },
    psalms: {
      23: {
        1: "The LORD is my shepherd; I shall not want.",
        2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
        6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
      },
      91: {
        1: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
        2: "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
      },
    },
    romans: {
      8: {
        28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
        31: "What shall we then say to these things? If God be for us, who can be against us?",
      },
    },
    philippians: {
      4: {
        13: "I can do all things through Christ which strengtheneth me.",
        19: "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
      },
    },
    jeremiah: {
      29: {
        11: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
      },
    },
    matthew: {
      6: {
        33: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      },
      28: {
        19: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
        20: "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
      },
    },
  },
  metadata: {
    totalVerses: 20,
    totalChapters: 8,
    downloadDate: new Date().toISOString(),
    source: "sample-data",
  },
}

// Sample WEB data
const webData: BibleTranslationData = {
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
      3: {
        16: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
        17: "For God didn't send his Son into the world to judge the world, but that the world should be saved through him.",
      },
    },
    psalms: {
      23: {
        1: "Yahweh is my shepherd: I shall lack nothing.",
        2: "He makes me lie down in green pastures. He leads me beside still waters.",
        3: "He restores my soul. He guides me in the paths of righteousness for his name's sake.",
      },
    },
    romans: {
      8: {
        28: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
      },
    },
  },
  metadata: {
    totalVerses: 6,
    totalChapters: 3,
    downloadDate: new Date().toISOString(),
    source: "sample-data",
  },
}

async function uploadSampleBibles() {
  console.log("Uploading sample Bible data to Vercel Blob...")

  try {
    // Upload KJV
    const kjvUrl = await bibleBlobService.uploadBibleTranslation("kjv", kjvData)
    if (kjvUrl) {
      console.log("✅ KJV uploaded successfully:", kjvUrl)
    } else {
      console.log("❌ Failed to upload KJV")
    }

    // Upload WEB
    const webUrl = await bibleBlobService.uploadBibleTranslation("web", webData)
    if (webUrl) {
      console.log("✅ WEB uploaded successfully:", webUrl)
    } else {
      console.log("❌ Failed to upload WEB")
    }

    // List available translations
    const translations = await bibleBlobService.listAvailableTranslations()
    console.log("📚 Available translations:", translations)

    // Get stats
    const stats = await bibleBlobService.getBibleStats()
    console.log("📊 Bible statistics:", stats)

    console.log("🎉 Sample Bible upload complete!")
  } catch (error) {
    console.error("❌ Error uploading sample Bibles:", error)
  }
}

// Run the upload
uploadSampleBibles()
