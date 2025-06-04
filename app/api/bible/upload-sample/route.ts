import { NextResponse } from "next/server"
import { bibleBlobService } from "@/lib/bible-blob-service"

export async function POST() {
  try {
    console.log("Starting sample Bible data upload...")

    // Create comprehensive sample Bible data for KJV
    const kjvSampleData = {
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
        john: {
          1: {
            1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
            2: "The same was in the beginning with God.",
            3: "All things were made by him; and without him was not any thing made that was made.",
            4: "In him was life; and the life was the light of men.",
            5: "And the light shineth in darkness; and the darkness comprehended it not.",
            6: "There was a man sent from God, whose name was John.",
            7: "The same came for a witness, to bear witness of the Light, that all men through him might believe.",
            8: "He was not that Light, but was sent to bear witness of that Light.",
            9: "That was the true Light, which lighteth every man that cometh into the world.",
            10: "He was in the world, and the world was made by him, and the world knew him not.",
            11: "He came unto his own, and his own received him not.",
            12: "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:",
            13: "Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.",
            14: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
          },
          3: {
            16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
            17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
            18: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
            19: "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.",
            20: "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.",
            21: "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.",
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
          1: {
            1: "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
            2: "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
            3: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
            4: "The ungodly are not so: but are like the chaff which the wind driveth away.",
            5: "Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.",
            6: "For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish.",
          },
          91: {
            1: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
            2: "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
            3: "Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.",
            4: "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.",
            11: "For he shall give his angels charge over thee, to keep thee in all thy ways.",
          },
        },
        genesis: {
          1: {
            1: "In the beginning God created the heaven and the earth.",
            2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
            3: "And God said, Let there be light: and there was light.",
            4: "And God saw the light, that it was good: and God divided the light from the darkness.",
            5: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
            26: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
            27: "So God created man in his own image, in the image of God created he him; male and female created he them.",
          },
        },
        romans: {
          8: {
            28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
            31: "What shall we then say to these things? If God be for us, who can be against us?",
            38: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
            39: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
          },
          12: {
            1: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
            2: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
          },
        },
        philippians: {
          4: {
            4: "Rejoice in the Lord alway: and again I say, Rejoice.",
            6: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
            7: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
            8: "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
            13: "I can do all things through Christ which strengtheneth me.",
            19: "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
          },
        },
        matthew: {
          5: {
            3: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
            4: "Blessed are they that mourn: for they shall be comforted.",
            5: "Blessed are the meek: for they shall inherit the earth.",
            6: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.",
            7: "Blessed are the merciful: for they shall obtain mercy.",
            8: "Blessed are the pure in heart: for they shall see God.",
            9: "Blessed are the peacemakers: for they shall be called the children of God.",
          },
          6: {
            9: "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.",
            10: "Thy kingdom come, Thy will be done in earth, as it is in heaven.",
            11: "Give us this day our daily bread.",
            12: "And forgive us our debts, as we forgive our debtors.",
            13: "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.",
            33: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
          },
        },
        "1corinthians": {
          13: {
            1: "Though I speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal.",
            2: "And though I have the gift of prophecy, and understand all mysteries, and all knowledge; and though I have all faith, so that I could remove mountains, and have not charity, I am nothing.",
            3: "And though I bestow all my goods to feed the poor, and though I give my body to be burned, and have not charity, it profiteth me nothing.",
            4: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
            5: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
            6: "Rejoiceth not in iniquity, but rejoiceth in the truth;",
            7: "Beareth all things, believeth all things, hopeth all things, endureth all things.",
            8: "Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.",
            13: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
          },
        },
        proverbs: {
          3: {
            5: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
            6: "In all thy ways acknowledge him, and he shall direct thy paths.",
          },
        },
      },
      metadata: {
        totalVerses: 85,
        totalChapters: 12,
        downloadDate: new Date().toISOString(),
        source: "sample-upload",
      },
    }

    // Upload KJV sample data
    console.log("Uploading KJV sample data...")
    const kjvUrl = await bibleBlobService.uploadBibleTranslation("kjv", kjvSampleData)

    // Create WEB sample data
    const webSampleData = {
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
          1: {
            1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
            2: "The same was in the beginning with God.",
            3: "All things were made through him. Without him was not anything made that has been made.",
            4: "In him was life, and the life was the light of men.",
            5: "The light shines in the darkness, and the darkness hasn't overcome it.",
          },
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
            4: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.",
            5: "You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.",
            6: "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh's house forever.",
          },
        },
        romans: {
          8: {
            28: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
          },
        },
        philippians: {
          4: {
            13: "I can do all things through Christ, who strengthens me.",
          },
        },
      },
      metadata: {
        totalVerses: 15,
        totalChapters: 4,
        downloadDate: new Date().toISOString(),
        source: "sample-upload",
      },
    }

    // Upload WEB sample data
    console.log("Uploading WEB sample data...")
    const webUrl = await bibleBlobService.uploadBibleTranslation("web", webSampleData)

    const results = {
      kjv: kjvUrl,
      web: webUrl,
    }

    console.log("Sample Bible data upload completed:", results)

    return NextResponse.json({
      success: true,
      message: "Sample Bible data uploaded successfully",
      uploads: results,
      stats: {
        kjv: {
          books: Object.keys(kjvSampleData.books).length,
          chapters: kjvSampleData.metadata.totalChapters,
          verses: kjvSampleData.metadata.totalVerses,
        },
        web: {
          books: Object.keys(webSampleData.books).length,
          chapters: webSampleData.metadata.totalChapters,
          verses: webSampleData.metadata.totalVerses,
        },
      },
    })
  } catch (error) {
    console.error("Error uploading sample Bible data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload sample Bible data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
