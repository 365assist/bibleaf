#!/usr/bin/env tsx

console.log("🔧 BibleAF Environment Setup")
console.log("=".repeat(50))

// Check current environment variables
const requiredVars = [
  { name: "BLOB_READ_WRITE_TOKEN", required: true, description: "Vercel Blob storage token" },
  { name: "STRIPE_SECRET_KEY", required: true, description: "Stripe secret key" },
  { name: "STRIPE_WEBHOOK_SECRET", required: false, description: "Stripe webhook secret" },
  { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: true, description: "Stripe publishable key" },
  { name: "OPENAI_API_KEY", required: false, description: "OpenAI API key for AI features" },
  { name: "DEEPINFRA_API_KEY", required: false, description: "DeepInfra API key" },
  { name: "ELEVENLABS_API_KEY", required: false, description: "ElevenLabs API key for TTS" },
  { name: "NEXT_PUBLIC_APP_URL", required: false, description: "Your app URL" },
]

console.log("\n📋 Environment Variable Status:")
console.log("-".repeat(50))

const missingRequired = []
const missingOptional = []

for (const envVar of requiredVars) {
  const value = process.env[envVar.name]
  const status = value ? "✅ SET" : "❌ MISSING"
  const length = value ? ` (${value.length} chars)` : ""

  console.log(`${envVar.name}: ${status}${length}`)
  console.log(`  Description: ${envVar.description}`)

  if (!value) {
    if (envVar.required) {
      missingRequired.push(envVar)
    } else {
      missingOptional.push(envVar)
    }
  }
  console.log()
}

if (missingRequired.length > 0) {
  console.log("🚨 CRITICAL: Missing Required Environment Variables")
  console.log("-".repeat(50))

  for (const envVar of missingRequired) {
    console.log(`❌ ${envVar.name}`)

    if (envVar.name === "BLOB_READ_WRITE_TOKEN") {
      console.log("   How to get this:")
      console.log("   1. Go to https://vercel.com/dashboard")
      console.log("   2. Select your project")
      console.log("   3. Go to Storage tab")
      console.log("   4. Create a new Blob store (if you don't have one)")
      console.log("   5. Copy the BLOB_READ_WRITE_TOKEN")
      console.log("   6. Add it to your .env.local file")
    }

    if (envVar.name === "STRIPE_SECRET_KEY") {
      console.log("   How to get this:")
      console.log("   1. Go to https://dashboard.stripe.com/apikeys")
      console.log("   2. Copy your Secret key (starts with sk_)")
      console.log("   3. Add it to your .env.local file")
    }

    if (envVar.name === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") {
      console.log("   How to get this:")
      console.log("   1. Go to https://dashboard.stripe.com/apikeys")
      console.log("   2. Copy your Publishable key (starts with pk_)")
      console.log("   3. Add it to your .env.local file")
    }

    console.log()
  }
}

if (missingOptional.length > 0) {
  console.log("⚠️  Optional Environment Variables (features will be limited)")
  console.log("-".repeat(50))

  for (const envVar of missingOptional) {
    console.log(`⚠️  ${envVar.name}: ${envVar.description}`)
  }
  console.log()
}

// Generate sample .env.local file
console.log("📝 Sample .env.local file:")
console.log("-".repeat(50))
console.log(`# Copy this to your .env.local file and fill in the values
# Get these from your respective service dashboards

# Vercel Blob Storage (Required)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Services (Optional - for enhanced features)
OPENAI_API_KEY=sk-your_openai_key_here
DEEPINFRA_API_KEY=your_deepinfra_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
`)

console.log("\n🚀 Next Steps:")
console.log("-".repeat(50))
console.log("1. Create a .env.local file in your project root")
console.log("2. Copy the sample configuration above")
console.log("3. Fill in the actual values from your service dashboards")
console.log("4. Restart your development server")
console.log("5. Run the test again: /api/bible/test-blob")

if (missingRequired.length === 0) {
  console.log("\n🎉 All required environment variables are configured!")
  console.log("Your app should be ready to run.")
} else {
  console.log(`\n⚠️  ${missingRequired.length} required environment variables need to be configured.`)
}
