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
  const book = decodeURIComponent(params.book)
  const chapter = Number.parseInt(params.chapter)
  const verse = searchParams.verse ? Number.parseInt(searchParams.verse) : undefined

  // Validate book and chapter
  const bookInfo = BibleService.getBook(book)
  if (!bookInfo || isNaN(chapter) || chapter < 1 || chapter > bookInfo.chapters) {
    notFound()
  }

  return (
    <div className="container py-8">
      <BibleChapterReader book={book} chapter={chapter} highlightVerse={verse} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const book = decodeURIComponent(params.book)
  const chapter = Number.parseInt(params.chapter)

  return {
    title: `${book} ${chapter} - BibleAF`,
    description: `Read ${book} chapter ${chapter} with AI-powered insights and audio narration.`,
  }
}
