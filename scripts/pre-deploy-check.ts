// Pre-deployment validation script
import * as fs from "fs"
import * as path from "path"

interface CheckResult {
  name: string
  passed: boolean
  message: string
}

const checks: CheckResult[] = []

// Check 1: Verify critical files exist
const criticalFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "next.config.js",
  "package.json",
  "tailwind.config.ts",
  "lib/env.ts",
  "public/manifest.json",
  "public/sw.js",
]

for (const file of criticalFiles) {
  const exists = fs.existsSync(path.join(process.cwd(), file))
  checks.push({
    name: `File: ${file}`,
    passed: exists,
    message: exists ? "✅ Found" : "❌ Missing",
  })
}

// Check 2: Verify environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "BLOB_READ_WRITE_TOKEN",
]

for (const envVar of requiredEnvVars) {
  const exists = !!process.env[envVar]
  checks.push({
    name: `Env: ${envVar}`,
    passed: exists,
    message: exists ? "✅ Set" : "❌ Missing",
  })
}

// Check 3: Verify package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

  const requiredScripts = ["build", "start", "dev"]
  for (const script of requiredScripts) {
    const exists = !!packageJson.scripts?.[script]
    checks.push({
      name: `Script: ${script}`,
      passed: exists,
      message: exists ? "✅ Defined" : "❌ Missing",
    })
  }

  const requiredDeps = ["next", "react", "react-dom"]
  for (const dep of requiredDeps) {
    const exists = !!(packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep])
    checks.push({
      name: `Dependency: ${dep}`,
      passed: exists,
      message: exists ? "✅ Installed" : "❌ Missing",
    })
  }
} catch (error) {
  checks.push({
    name: "Package.json",
    passed: false,
    message: "❌ Invalid or missing",
  })
}

// Check 4: Verify build configuration
try {
  const nextConfig = fs.readFileSync("next.config.js", "utf8")
  const hasValidConfig = nextConfig.includes("module.exports") || nextConfig.includes("export default")
  checks.push({
    name: "Next.js config",
    passed: hasValidConfig,
    message: hasValidConfig ? "✅ Valid" : "❌ Invalid format",
  })
} catch (error) {
  checks.push({
    name: "Next.js config",
    passed: false,
    message: "❌ Missing or unreadable",
  })
}

// Output results
console.log("\n🔍 Pre-deployment Check Results\n")
console.log("=".repeat(50))

let allPassed = true
for (const check of checks) {
  console.log(`${check.message} ${check.name}`)
  if (!check.passed) {
    allPassed = false
  }
}

console.log("=".repeat(50))

if (allPassed) {
  console.log("🎉 All pre-deployment checks passed!")
  console.log("✅ Ready for deployment")
  process.exit(0)
} else {
  console.log("❌ Some pre-deployment checks failed!")
  console.log("🔧 Please fix the issues above before deploying")
  process.exit(1)
}
