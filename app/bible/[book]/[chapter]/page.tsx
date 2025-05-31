import { notFound } from "next/navigation"
import { BibleService } from "@/lib/bible-service"
import BibleChapterReader from "@/components/bible-chapter-reader"

interface PageProps {
  params: {
    book: string
    chapter: string
  }
  searchParams: {
    verse?: string
  }
}

export default function BibleChapterPage({ params, searchParams }: PageProps) {
  const bookParam = decodeURIComponent(params.book)
  const chapter = Number.parseInt(params.chapter)
  const verse = searchParams.verse ? Number.parseInt(searchParams.verse) : undefined

  // Handle common book name variations
  let book = bookParam
  if (bookParam.toLowerCase() === "psalm") {
    book = "Psalms"
  } else if (bookParam.toLowerCase() === "psalms") {
    book = "Psalms"
  }

  // Validate book and chapter
  const bookInfo = BibleService.getBook(book)
  if (!bookInfo || isNaN(chapter) || chapter < 1 || chapter > bookInfo.chapters) {
    console.log(`Book not found: ${book}, Original param: ${bookParam}`)
    console.log(
      "Available books:",
      BibleService.getAllBooks().map((b) => b.name),
    )
    notFound()
  }

  return (
    <div className="container py-8">
      <BibleChapterReader book={book} chapter={chapter} highlightVerse={verse} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const bookParam = decodeURIComponent(params.book)
  const chapter = Number.parseInt(params.chapter)

  // Handle common book name variations
  let book = bookParam
  if (bookParam.toLowerCase() === "psalm") {
    book = "Psalms"
  }

  return {
    title: `${book} ${chapter} - BibleAF`,
    description: `Read ${book} chapter ${chapter} with AI-powered insights and audio narration.`,
  }
}
