import { type NextRequest, NextResponse } from "next/server"
import { crossReferenceService } from "@/lib/cross-reference-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const includeThematic = searchParams.get("includeThematic") === "true"
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "20")

    if (!reference) {
      return NextResponse.json({ error: "Reference parameter is required" }, { status: 400 })
    }

    // Get cross-references
    const crossReferences = await crossReferenceService.getEnhancedCrossReferences(reference, {
      maxResults,
      includeContext: true,
      includeThematic,
    })

    // Get thematic groups if requested
    let thematicGroups = []
    if (includeThematic) {
      thematicGroups = await crossReferenceService.getThematicGroups(reference)
    }

    // Get relationship analysis
    const relationshipAnalysis = await crossReferenceService.analyzeRelationships(reference)

    return NextResponse.json({
      reference,
      references: crossReferences,
      thematicGroups,
      relationshipAnalysis,
      metadata: {
        totalFound: crossReferences.length,
        searchTime: Date.now(),
        includesThematic: includeThematic,
      },
    })
  } catch (error) {
    console.error("Cross-reference API error:", error)
    return NextResponse.json({ error: "Failed to fetch cross-references" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, context, userPreferences } = body

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    // Get AI-enhanced cross-references based on context
    const aiCrossReferences = await crossReferenceService.getAICrossReferences(reference, context, userPreferences)

    return NextResponse.json({
      reference,
      references: aiCrossReferences,
      context,
      metadata: {
        aiEnhanced: true,
        searchTime: Date.now(),
      },
    })
  } catch (error) {
    console.error("AI Cross-reference API error:", error)
    return NextResponse.json({ error: "Failed to generate AI cross-references" }, { status: 500 })
  }
}
