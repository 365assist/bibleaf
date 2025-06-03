// Environment Variables Check Script
console.log("🔍 Checking Environment Variables...\n")

const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "DEEPINFRA_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
]

const optionalEnvVars = ["ELEVENLABS_API_KEY", "OPENAI_API_KEY"]

// Check required variables
const missing = []
const present = []

requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    present.push(varName)
    console.log(`✅ ${varName}: Present`)
  } else {
    missing.push(varName)
    console.log(`❌ ${varName}: MISSING`)
  }
})

console.log("\n📋 Optional Variables:")
optionalEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Present`)
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`)
  }
})

console.log("\n📊 Summary:")
console.log(`✅ Required variables present: ${present.length}/${requiredEnvVars.length}`)
console.log(`❌ Required variables missing: ${missing.length}`)

if (missing.length > 0) {
  console.log("\n🚨 Missing required environment variables:")
  missing.forEach((varName) => {
    console.log(`   - ${varName}`)
  })
  console.log("\nPlease add these to your .env.local file or Vercel environment variables")
} else {
  console.log("\n🎉 All required environment variables are set!")
}

// Additional checks
console.log("\n🔧 Additional Configuration Checks:")

// Check if we're in a Vercel environment
if (process.env.VERCEL) {
  console.log("✅ Running on Vercel platform")
  console.log(`📍 Region: ${process.env.VERCEL_REGION || "Not specified"}`)
} else {
  console.log("⚠️  Not running on Vercel (this is normal for local development)")
}

// Check Stripe configuration
if (process.env.STRIPE_SECRET_KEY) {
  const isTestKey = process.env.STRIPE_SECRET_KEY.startsWith("sk_test_")
  const isLiveKey = process.env.STRIPE_SECRET_KEY.startsWith("sk_live_")

  if (isTestKey) {
    console.log("🧪 Using Stripe TEST mode")
  } else if (isLiveKey) {
    console.log("🚀 Using Stripe LIVE mode")
  } else {
    console.log("⚠️  Stripe key format not recognized")
  }
}

console.log("\n✨ Environment check complete!")
