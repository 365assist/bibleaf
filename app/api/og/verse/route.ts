import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const verse = searchParams.get("verse") || "John 3:16"
    const text = searchParams.get("text") || "For God so loved the world..."
    const translation = searchParams.get("translation") || "NIV"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e40af",
          backgroundImage: "linear-gradient(45deg, #1e40af 0%, #3b82f6 100%)",
          fontSize: 32,
          fontWeight: 600,
          color: "white",
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            padding: 60,
            margin: 40,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxWidth: "90%",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 30,
            }}
          >
            📖
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              marginBottom: 30,
              maxWidth: "800px",
              fontStyle: "italic",
            }}
          >
            "{text}"
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#1e40af",
              marginBottom: 10,
            }}
          >
            {verse}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#6b7280",
            }}
          >
            {translation} • BibleAF
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
