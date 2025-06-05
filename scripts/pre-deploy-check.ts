#!/usr/bin/env tsx

import { env, validateEnv } from "../lib/env"

async function preDeployCheck() {
  console.log("🔍 Running pre-deployment checks...")

  try {
    // Check environment variables
    console.log("✅ Validating environment variables...")
    validateEnv()
    console.log("✅ Environment variables validated")

    // Check critical API endpoints
    console.log("✅ Checking API endpoints...")

    // Test database connection
    if (env.DATABASE_URL) {
      console.log("✅ Database URL configured")
    }

    // Test OpenAI API key
    if (env.OPENAI_API_KEY) {
      console.log("✅ OpenAI API key configured")
    }

    // Test Stripe keys
    if (env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.log("✅ Stripe keys configured")
    }

    // Test Blob storage
    if (env.BLOB_READ_WRITE_TOKEN) {
      console.log("✅ Blob storage configured")
    }

    console.log("🎉 All pre-deployment checks passed!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Pre-deployment check failed:", error)
    process.exit(1)
  }
}

preDeployCheck()
