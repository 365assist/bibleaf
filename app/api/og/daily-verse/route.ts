import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#059669",
          backgroundImage: "linear-gradient(45deg, #059669 0%, #10b981 100%)",
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
                marginRight: 20,
              }}
            >
              🌅
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              Daily Verse
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#374151",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            {formattedDate}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            BibleAF - Daily Scripture & AI Insights
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
