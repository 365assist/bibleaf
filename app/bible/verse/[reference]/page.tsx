import VersePageClient from "./VersePageClient"

interface PageProps {
  params: {
    reference: string
  }
  searchParams: {
    translation?: string
  }
}

export default function VersePage({ params, searchParams }: PageProps) {
  return <VersePageClient params={params} searchParams={searchParams} />
}

interface MetadataProps {
  params: {
    reference: string
  }
}

// Parse verse reference like "John3:16" or "John%203:16"
function parseVerseReference(reference: string): { book: string; chapter: number; verse: number } | null {
  try {
    // Decode URL encoding
    const decoded = decodeURIComponent(reference)

    // Handle different formats:
    // "John3:16", "John 3:16", "1John3:16", "1 John 3:16"
    const patterns = [
      /^(.+?)(\d+):(\d+)$/, // "John3:16" or "1John3:16"
      /^(.+?)\s+(\d+):(\d+)$/, // "John 3:16" or "1 John 3:16"
    ]

    for (const pattern of patterns) {
      const match = decoded.match(pattern)
      if (match) {
        const book = match[1].trim()
        const chapter = Number.parseInt(match[2])
        const verse = Number.parseInt(match[3])

        if (!isNaN(chapter) && !isNaN(verse)) {
          return { book, chapter, verse }
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error parsing verse reference:", error)
    return null
  }
}

export async function generateMetadata({ params }: MetadataProps) {
  const parsed = parseVerseReference(params.reference)

  if (!parsed) {
    return {
      title: "Verse Not Found - BibleAF",
    }
  }

  const { book, chapter, verse } = parsed

  return {
    title: `${book} ${chapter}:${verse} - BibleAF`,
    description: `Read ${book} ${chapter}:${verse} with AI-powered insights and audio narration.`,
  }
}
