// Script to check if all required environment variables are set
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "DEEPINFRA_API_KEY",
  "BLOB_READ_WRITE_TOKEN",
]

const optionalEnvVars = ["ELEVENLABS_API_KEY", "OPENAI_API_KEY"]

console.log("🔍 Checking Environment Variables...\n")

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
  console.log("\nPlease add these to your .env.local file")
  process.exit(1)
} else {
  console.log("\n🎉 All required environment variables are set!")
}
