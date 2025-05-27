import { type NextRequest, NextResponse } from "next/server"
import { saveReadingProgress, getReadingProgress, type ReadingProgress } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const progress = await getReadingProgress(userId)
    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error fetching reading progress:", error)
    return NextResponse.json({ error: "Failed to fetch reading progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentBook, currentChapter, currentVerse, completedChapters } = body

    if (!userId || !currentBook || currentChapter === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const progress: ReadingProgress = {
      userId,
      currentBook,
      currentChapter,
      currentVerse: currentVerse || 1,
      lastReadAt: new Date().toISOString(),
      completedChapters: completedChapters || {},
    }

    await saveReadingProgress(progress)
    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("Error saving reading progress:", error)
    return NextResponse.json({ error: "Failed to save reading progress" }, { status: 500 })
  }
}
