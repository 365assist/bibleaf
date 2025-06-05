import { type NextRequest, NextResponse } from "next/server"
import { bibleBlobService, type BibleTranslationData } from "@/lib/bible-blob-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { translationId, data }: { translationId: string; data: BibleTranslationData } = body

    if (!translationId || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Translation ID and data are required",
        },
        { status: 400 },
      )
    }

    console.log(`Uploading Bible translation: ${translationId}`)
    const url = await bibleBlobService.uploadBibleTranslation(translationId, data)

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload Bible translation",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Bible translation ${translationId} uploaded successfully`,
      url,
      translationId,
    })
  } catch (error) {
    console.error("Error uploading Bible translation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload Bible translation",
      },
      { status: 500 },
    )
  }
}
