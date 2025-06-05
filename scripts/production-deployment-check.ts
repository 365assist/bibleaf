import fs from "fs"
import path from "path"

console.log("🚀 BibleAF Production Deployment Check")
console.log("=====================================\n")

interface CheckResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

const results: CheckResult[] = []

// Check 1: Image Optimization
console.log("📸 Checking Image Optimization...")
const imageDir = path.join(process.cwd(), "public", "images")
if (fs.existsSync(imageDir)) {
  const images = fs.readdirSync(imageDir)
  const pngImages = images.filter((img) => img.endsWith(".png"))
  const webpImages = images.filter((img) => img.endsWith(".webp"))

  if (webpImages.length > 0) {
    results.push({
      name: "Image Optimization",
      status: "pass",
      message: `Found ${webpImages.length} WebP images, ${pngImages.length} PNG images`,
    })
  } else {
    results.push({
      name: "Image Optimization",
      status: "warning",
      message: "No WebP images found. Consider converting PNGs to WebP for better performance",
    })
  }
} else {
  results.push({
    name: "Image Optimization",
    status: "warning",
    message: "Images directory not found",
  })
}

// Check 2: SEO Components
console.log("🔍 Checking SEO Implementation...")
const seoComponentPath = path.join(process.cwd(), "components", "seo-head.tsx")
if (fs.existsSync(seoComponentPath)) {
  results.push({
    name: "SEO Components",
    status: "pass",
    message: "SEO Head component found and implemented",
  })
} else {
  results.push({
    name: "SEO Components",
    status: "fail",
    message: "SEO Head component missing",
  })
}

// Check 3: Accessibility Features
console.log("♿ Checking Accessibility Features...")
const layoutPath = path.join(process.cwd(), "app", "layout.tsx")
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, "utf-8")
  const hasSkipLink = layoutContent.includes("skip-link")
  const hasAriaLabels = layoutContent.includes("aria-label")

  if (hasSkipLink) {
    results.push({
      name: "Accessibility - Skip Link",
      status: "pass",
      message: "Skip to content link implemented",
    })
  } else {
    results.push({
      name: "Accessibility - Skip Link",
      status: "fail",
      message: "Skip to content link missing",
    })
  }
} else {
  results.push({
    name: "Accessibility",
    status: "fail",
    message: "Layout file not found",
  })
}

// Check 4: PWA Configuration
console.log("📱 Checking PWA Configuration...")
const manifestPath = path.join(process.cwd(), "manifest.json")
const swPath = path.join(process.cwd(), "public", "sw.js")

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  if (manifest.name && manifest.icons && manifest.start_url) {
    results.push({
      name: "PWA Manifest",
      status: "pass",
      message: "PWA manifest properly configured",
    })
  } else {
    results.push({
      name: "PWA Manifest",
      status: "warning",
      message: "PWA manifest incomplete",
    })
  }
} else {
  results.push({
    name: "PWA Manifest",
    status: "fail",
    message: "PWA manifest missing",
  })
}

if (fs.existsSync(swPath)) {
  results.push({
    name: "Service Worker",
    status: "pass",
    message: "Service worker found",
  })
} else {
  results.push({
    name: "Service Worker",
    status: "warning",
    message: "Service worker not found",
  })
}

// Check 5: About and Contact Pages
console.log("📄 Checking Required Pages...")
const aboutPath = path.join(process.cwd(), "app", "about", "page.tsx")
const contactPath = path.join(process.cwd(), "app", "contact", "page.tsx")

if (fs.existsSync(aboutPath)) {
  results.push({
    name: "About Page",
    status: "pass",
    message: "About page implemented",
  })
} else {
  results.push({
    name: "About Page",
    status: "fail",
    message: "About page missing",
  })
}

if (fs.existsSync(contactPath)) {
  results.push({
    name: "Contact Page",
    status: "pass",
    message: "Contact page implemented",
  })
} else {
  results.push({
    name: "Contact Page",
    status: "fail",
    message: "Contact page missing",
  })
}

// Check 6: AI Disclaimer
console.log("🤖 Checking AI Disclaimer...")
const disclaimerPath = path.join(process.cwd(), "components", "ai-disclaimer.tsx")
if (fs.existsSync(disclaimerPath)) {
  results.push({
    name: "AI Disclaimer",
    status: "pass",
    message: "AI disclaimer component implemented",
  })
} else {
  results.push({
    name: "AI Disclaimer",
    status: "fail",
    message: "AI disclaimer component missing",
  })
}

// Check 7: Robots.txt and Sitemap
console.log("🤖 Checking SEO Files...")
const robotsPath = path.join(process.cwd(), "public", "robots.txt")
const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml")

if (fs.existsSync(robotsPath)) {
  results.push({
    name: "Robots.txt",
    status: "pass",
    message: "Robots.txt file found",
  })
} else {
  results.push({
    name: "Robots.txt",
    status: "warning",
    message: "Robots.txt file missing",
  })
}

if (fs.existsSync(sitemapPath)) {
  results.push({
    name: "Sitemap",
    status: "pass",
    message: "Sitemap.xml file found",
  })
} else {
  results.push({
    name: "Sitemap",
    status: "warning",
    message: "Sitemap.xml file missing",
  })
}

// Check 8: Next.js Configuration
console.log("⚙️ Checking Next.js Configuration...")
const nextConfigPath = path.join(process.cwd(), "next.config.js")
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, "utf-8")
  const hasImageOptimization = configContent.includes("images:") || configContent.includes("formats:")

  if (hasImageOptimization) {
    results.push({
      name: "Next.js Image Optimization",
      status: "pass",
      message: "Image optimization configured",
    })
  } else {
    results.push({
      name: "Next.js Image Optimization",
      status: "warning",
      message: "Image optimization not configured",
    })
  }
} else {
  results.push({
    name: "Next.js Configuration",
    status: "warning",
    message: "next.config.js not found",
  })
}

// Display Results
console.log("\n📊 DEPLOYMENT READINESS REPORT")
console.log("================================\n")

const passed = results.filter((r) => r.status === "pass").length
const failed = results.filter((r) => r.status === "fail").length
const warnings = results.filter((r) => r.status === "warning").length

results.forEach((result) => {
  const icon = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⚠️"
  console.log(`${icon} ${result.name}: ${result.message}`)
})

console.log("\n📈 SUMMARY")
console.log("===========")
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`⚠️ Warnings: ${warnings}`)
console.log(`📊 Total: ${results.length}`)

const score = Math.round((passed / results.length) * 100)
console.log(`\n🎯 Deployment Readiness Score: ${score}%`)

if (score >= 90) {
  console.log("🚀 EXCELLENT! Ready for production deployment!")
} else if (score >= 75) {
  console.log("✅ GOOD! Minor improvements recommended before deployment.")
} else if (score >= 60) {
  console.log("⚠️ FAIR! Several improvements needed before deployment.")
} else {
  console.log("❌ NEEDS WORK! Major improvements required before deployment.")
}

console.log("\n🔧 NEXT STEPS:")
console.log("1. Address any failed checks above")
console.log("2. Run `npm run build` to test production build")
console.log("3. Run Lighthouse audit for performance/accessibility")
console.log("4. Test on mobile devices")
console.log("5. Deploy to Vercel with `vercel --prod`")

console.log("\n✨ BibleAF is ready to transform Bible study with AI! ✨")
