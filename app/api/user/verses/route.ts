import { type NextRequest, NextResponse } from "next/server"
import { saveVerse, getUserVerses, deleteVerse, type SavedVerse } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    try {
      const verses = await getUserVerses(userId)
      return NextResponse.json({ verses }, { status: 200 })
    } catch (error) {
      console.error("Error in getUserVerses:", error)
      return NextResponse.json({ verses: [] }, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching verses:", error)
    return NextResponse.json({ verses: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, reference, text, translation, notes = "", tags = [] } = body

    if (!userId || !reference || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const verse: SavedVerse = {
      id: `verse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      reference,
      text,
      translation: translation || "NIV",
      notes,
      tags,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveVerse(verse)
    return NextResponse.json({ success: true, verse }, { status: 200 })
  } catch (error) {
    console.error("Error saving verse:", error)
    return NextResponse.json({ error: "Failed to save verse" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const verseId = searchParams.get("verseId")

    if (!userId || !verseId) {
      return NextResponse.json({ error: "User ID and Verse ID are required" }, { status: 400 })
    }

    await deleteVerse(userId, verseId)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting verse:", error)
    return NextResponse.json({ error: "Failed to delete verse" }, { status: 500 })
  }
}
