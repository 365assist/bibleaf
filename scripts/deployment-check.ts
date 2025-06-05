// Simple deployment readiness check
import * as fs from "fs"
import * as path from "path"

console.log("🔍 Checking deployment readiness...")

// Check for critical files
const criticalFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "lib/env.ts",
  "next.config.js",
  "package.json",
  "tailwind.config.ts",
]

let allFilesExist = true

for (const file of criticalFiles) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`❌ Missing critical file: ${file}`)
    allFilesExist = false
  } else {
    console.log(`✅ Found: ${file}`)
  }
}

// Check environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
]

let allEnvVarsPresent = true

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`)
    allEnvVarsPresent = false
  } else {
    console.log(`✅ Environment variable present: ${envVar}`)
  }
}

// Check package.json scripts
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
  const requiredScripts = ["build", "start", "dev"]

  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) {
      console.error(`❌ Missing package.json script: ${script}`)
      allFilesExist = false
    } else {
      console.log(`✅ Package.json script present: ${script}`)
    }
  }
} catch (error) {
  console.error("❌ Error reading package.json:", error)
  allFilesExist = false
}

if (allFilesExist && allEnvVarsPresent) {
  console.log("🎉 Deployment readiness check passed!")
  process.exit(0)
} else {
  console.error("❌ Deployment readiness check failed!")
  process.exit(1)
}
