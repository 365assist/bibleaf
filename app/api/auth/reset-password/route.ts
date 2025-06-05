import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Fetch and validate reset token
    try {
      const response = await fetch(`https://blob.vercel-storage.com/password-reset/${token}.json`)

      if (!response.ok) {
        return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
      }

      const resetData = await response.json()
      const expiresAt = new Date(resetData.expiresAt)
      const now = new Date()

      if (now > expiresAt) {
        return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
      }

      // In a real application, you would:
      // 1. Hash the new password
      // 2. Update the user's password in the database
      // 3. Invalidate all existing sessions for the user

      // For demo purposes, we'll just simulate the password update
      console.log(`Password reset successful for email: ${resetData.email}`)
      console.log(`New password length: ${password.length} characters`)

      // Mark the reset token as used by updating it
      const usedTokenData = {
        ...resetData,
        usedAt: new Date().toISOString(),
        status: "used",
      }

      await put(`password-reset/${token}.json`, JSON.stringify(usedTokenData), {
        access: "public",
        contentType: "application/json",
      })

      return NextResponse.json({
        success: true,
        message: "Password has been reset successfully",
      })
    } catch (fetchError) {
      console.error("Failed to process reset:", fetchError)
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
