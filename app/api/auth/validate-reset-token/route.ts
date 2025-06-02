import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Fetch reset token data from blob storage
    try {
      const response = await fetch(`https://blob.vercel-storage.com/password-reset/${token}.json`)

      if (!response.ok) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 })
      }

      const resetData = await response.json()
      const expiresAt = new Date(resetData.expiresAt)
      const now = new Date()

      if (now > expiresAt) {
        return NextResponse.json({ error: "Token has expired" }, { status: 400 })
      }

      return NextResponse.json({ valid: true })
    } catch (fetchError) {
      console.error("Failed to validate token:", fetchError)
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
