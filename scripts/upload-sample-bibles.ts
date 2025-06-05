// Script to upload sample Bible data to Vercel Blob storage
import { put } from "@vercel/blob"

// Sample KJV data
const kjvData = {
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
const webData = {
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
  console.log("🚀 Starting Bible data upload to Vercel Blob...")

  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN environment variable not found")
      console.log("Please ensure your Vercel Blob token is configured in environment variables")
      return
    }

    console.log("✅ Blob token found, proceeding with upload...")

    // Upload KJV Bible
    console.log("📖 Uploading King James Version (KJV)...")
    const kjvBlob = await put("bibles/kjv.json", JSON.stringify(kjvData, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    console.log("✅ KJV uploaded successfully!")
    console.log(`   URL: ${kjvBlob.url}`)
    console.log(`   Size: ${kjvBlob.size} bytes`)

    // Upload WEB Bible
    console.log("📖 Uploading World English Bible (WEB)...")
    const webBlob = await put("bibles/web.json", JSON.stringify(webData, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    console.log("✅ WEB uploaded successfully!")
    console.log(`   URL: ${webBlob.url}`)
    console.log(`   Size: ${webBlob.size} bytes`)

    // Upload ASV Bible (additional sample)
    const asvData = {
      translation: {
        id: "asv",
        name: "American Standard Version",
        abbreviation: "ASV",
        language: "en",
        year: 1901,
        copyright: "Public Domain",
        isPublicDomain: true,
      },
      books: {
        john: {
          3: {
            16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.",
          },
        },
        psalms: {
          23: {
            1: "Jehovah is my shepherd; I shall not want.",
            2: "He maketh me to lie down in green pastures; He leadeth me beside still waters.",
          },
        },
      },
      metadata: {
        totalVerses: 3,
        totalChapters: 2,
        downloadDate: new Date().toISOString(),
        source: "sample-data",
      },
    }

    console.log("📖 Uploading American Standard Version (ASV)...")
    const asvBlob = await put("bibles/asv.json", JSON.stringify(asvData, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    console.log("✅ ASV uploaded successfully!")
    console.log(`   URL: ${asvBlob.url}`)
    console.log(`   Size: ${asvBlob.size} bytes`)

    // Create index file
    const indexData = {
      translations: [
        {
          id: "kjv",
          name: "King James Version",
          abbreviation: "KJV",
          language: "en",
          year: 1769,
          isPublicDomain: true,
          url: kjvBlob.url,
        },
        {
          id: "web",
          name: "World English Bible",
          abbreviation: "WEB",
          language: "en",
          year: 2000,
          isPublicDomain: true,
          url: webBlob.url,
        },
        {
          id: "asv",
          name: "American Standard Version",
          abbreviation: "ASV",
          language: "en",
          year: 1901,
          isPublicDomain: true,
          url: asvBlob.url,
        },
      ],
      lastUpdated: new Date().toISOString(),
      totalTranslations: 3,
    }

    console.log("📋 Creating translations index...")
    const indexBlob = await put("bibles/index.json", JSON.stringify(indexData, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    console.log("✅ Index created successfully!")
    console.log(`   URL: ${indexBlob.url}`)

    // Summary
    console.log("\n🎉 Bible upload complete!")
    console.log("📊 Summary:")
    console.log(`   • 3 Bible translations uploaded`)
    console.log(`   • KJV: 20 verses across 8 chapters`)
    console.log(`   • WEB: 6 verses across 3 chapters`)
    console.log(`   • ASV: 3 verses across 2 chapters`)
    console.log(`   • Total: 29 verses available for testing`)
    console.log("\n🔗 Files uploaded:")
    console.log(`   • ${kjvBlob.url}`)
    console.log(`   • ${webBlob.url}`)
    console.log(`   • ${asvBlob.url}`)
    console.log(`   • ${indexBlob.url}`)

    console.log("\n✨ Your Bible app now has cloud storage!")
    console.log("Visit /test-blob-bible to test the integration")
  } catch (error) {
    console.error("❌ Error uploading Bible data:", error)

    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        console.log("\n🔑 Authentication Error:")
        console.log("Please check that your BLOB_READ_WRITE_TOKEN is correct")
        console.log("You can find your token in the Vercel dashboard under Storage > Blob")
      } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
        console.log("\n🚫 Permission Error:")
        console.log("Your blob token may not have write permissions")
        console.log("Please ensure you're using a read-write token")
      } else {
        console.log("\n🔧 Troubleshooting:")
        console.log("1. Check your internet connection")
        console.log("2. Verify your BLOB_READ_WRITE_TOKEN is set correctly")
        console.log("3. Try again in a few moments")
      }
    }
  }
}

// Run the upload
uploadSampleBibles()
