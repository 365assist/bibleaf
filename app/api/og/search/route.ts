import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "Search the Bible"
    const results = searchParams.get("results") || "0"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#7c3aed",
          backgroundImage: "linear-gradient(45deg, #7c3aed 0%, #a855f7 100%)",
          fontSize: 32,
          fontWeight: 600,
          color: "white",
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
            padding: 60,
            margin: 40,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxWidth: "80%",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 20,
            }}
          >
            🔍
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#7c3aed",
            }}
          >
            Bible Search
          </div>

          <div
            style={{
              fontSize: 24,
              marginBottom: 20,
              fontStyle: "italic",
              color: "#374151",
            }}
          >
            "{query}"
          </div>

          <div
            style={{
              fontSize: 20,
              color: "#6b7280",
            }}
          >
            {results} results found • BibleAF
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
