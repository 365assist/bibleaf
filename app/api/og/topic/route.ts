import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic") || "Faith"
    const description = searchParams.get("description") || "Explore biblical wisdom on this topic"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#dc2626",
          backgroundImage: "linear-gradient(45deg, #dc2626 0%, #ef4444 100%)",
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
            ✨
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#dc2626",
              textTransform: "capitalize",
            }}
          >
            {topic}
          </div>

          <div
            style={{
              fontSize: 20,
              color: "#374151",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#6b7280",
              marginTop: 20,
            }}
          >
            BibleAF - Biblical Topics & Insights
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
