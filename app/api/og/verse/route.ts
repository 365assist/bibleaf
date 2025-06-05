import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book") || "John"
    const chapter = searchParams.get("chapter") || "3"
    const verse = searchParams.get("verse")

    const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`
    const title = `${reference} - Bible Study with AI`

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef3c7",
          backgroundImage: "linear-gradient(45deg, #fef3c7 0%, #fde68a 100%)",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 40,
            margin: 40,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #d97706 0%, #f59e0b 100%)",
                backgroundClip: "text",
                color: "transparent",
                marginRight: 20,
              }}
            >
              📖
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              BibleAF
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#374151",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            {reference}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            AI-Powered Bible Study & Insights
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
