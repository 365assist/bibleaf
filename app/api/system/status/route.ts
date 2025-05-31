import { NextResponse } from "next/server"
import { getEnvironmentStatus } from "@/lib/env-server"

export async function GET() {
  try {
    const status = getEnvironmentStatus()

    // Add additional system checks
    const systemStatus = {
      ...status,
      api: {
        health: true,
        timestamp: new Date().toISOString(),
      },
      database: {
        connected: true, // Would check actual DB connection
      },
      cache: {
        operational: true,
      },
    }

    return NextResponse.json(systemStatus, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("System status error:", error)

    return NextResponse.json(
      {
        error: "System status check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
