import { NextResponse } from "next/server"

interface BibleTranslationData {
  translation: {
    id: string
    name: string
    abbreviation: string
    language: string
    year: number
    copyright: string
    isPublicDomain: boolean
  }
  books: {
    [bookName: string]: {
      [chapter: number]: {
        [verse: number]: string
      }
    }
  }
  metadata: {
    totalVerses: number
    totalChapters: number
    downloadDate: string
    source: string
  }
}

const sampleData: BibleTranslationData = {
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
      2: {
        1: "And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there:",
        2: "And both Jesus was called, and his disciples, to the marriage.",
        3: "And when they wanted wine, the mother of Jesus saith unto him, They have no wine.",
        4: "Jesus saith unto her, Woman, what have I to do with thee? mine hour is not yet come.",
        5: "His mother saith unto the servants, Whatsoever he saith unto you, do it.",
        6: "And there were set there six waterpots of stone, after the manner of the purifying of the Jews, containing two or three firkins apiece.",
        7: "Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.",
        8: "And he saith unto them, Draw out now, and bear unto the governor of the feast. And they bare it.",
        9: "When the ruler of the feast had tasted the water that was made wine, and knew not whence it was: (but the servants which drew the water knew;) the governor of the feast called the bridegroom,",
        10: "And saith unto him, Every man at the beginning doth set forth good wine; and when men have well drunk, then that which is worse: but thou hast kept the good wine until now.",
        11: "This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him.",
      },
      3: {
        1: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
        2: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
        3: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
        16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
        18: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
      },
      14: {
        1: "Let not your heart be troubled: ye believe in God, believe also in me.",
        2: "In my Father's house are many mansions: if it were not so, I would have told you. I go to prepare a place for you.",
        3: "And if I go and prepare a place for you, I will come again, and receive you unto myself; that where I am, there ye may be also.",
        6: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
        27: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
      },
    },
    genesis: {
      1: {
        1: "In the beginning God created the heaven and the earth.",
        2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        3: "And God said, Let there be light: and there was light.",
        4: "And God saw the light, that it was good: and God divided the light from the darkness.",
        5: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
      },
    },
    psalms: {
      23: {
        1: "The Lord is my shepherd; I shall not want.",
        2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
        6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
      },
    },
  },
  metadata: {
    totalVerses: 156,
    totalChapters: 15,
    downloadDate: new Date().toISOString(),
    source: "sample-data",
  },
}

export async function GET() {
  return NextResponse.json(sampleData)
}
