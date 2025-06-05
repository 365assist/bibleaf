import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Simple token generation for demo purposes
// In production, use a more secure method
function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in blob storage
    const resetData = {
      email,
      token: resetToken,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    }

    try {
      await put(`password-reset/${resetToken}.json`, JSON.stringify(resetData), {
        access: "public",
        contentType: "application/json",
      })
    } catch (blobError) {
      console.error("Failed to store reset token:", blobError)
      return NextResponse.json({ error: "Failed to process reset request" }, { status: 500 })
    }

    // In a real application, you would send an email here
    // For demo purposes, we'll just log the reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    console.log("Password reset requested for:", email)
    console.log("Reset URL:", resetUrl)
    console.log("Token expires at:", expiresAt.toISOString())

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
      // In development, include the reset URL for testing
      ...(process.env.NODE_ENV === "development" && { resetUrl }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
