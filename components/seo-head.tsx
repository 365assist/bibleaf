import type React from "react"
import Head from "next/head"
import type { StructuredData } from "@/lib/structured-data"

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article"
  structuredData?: StructuredData | StructuredData[]
  keywords?: string[]
  noIndex?: boolean
  children?: React.ReactNode
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = "/images/divine-light-background.png",
  ogType = "website",
  structuredData,
  keywords = [],
  noIndex = false,
  children,
}: SEOHeadProps) {
  const fullTitle = title.includes("BibleAF") ? title : `${title} | BibleAF`
  const fullCanonical = canonical || (typeof window !== "undefined" ? window.location.href : "")
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `https://bibleaf.com${ogImage}`

  const defaultKeywords = [
    "Bible",
    "Scripture",
    "Christian",
    "Faith",
    "AI Bible study",
    "Biblical wisdom",
    "Spiritual guidance",
    "Bible verses",
    "Bible search",
    "Christian app",
  ]

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])]

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="BibleAF" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@bibleaf" />
      <meta name="twitter:creator" content="@bibleaf" />

      {/* Additional Meta Tags */}
      <meta name="author" content="BibleAF" />
      <meta name="publisher" content="BibleAF" />
      <meta name="application-name" content="BibleAF" />
      <meta name="theme-color" content="#f59e0b" />

      {/* Apple Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="BibleAF" />

      {/* Microsoft Meta Tags */}
      <meta name="msapplication-TileColor" content="#f59e0b" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData]),
          }}
        />
      )}

      {/* Additional head content */}
      {children}
    </Head>
  )
}

// Utility function to generate meta tags for Bible verses
export function generateVerseMeta(reference: string, text: string) {
  return {
    title: `${reference} - Bible Verse`,
    description: `"${text}" - Read and study ${reference} with AI-powered insights and commentary on BibleAF.`,
    keywords: ["Bible verse", reference, "Scripture", "Bible study", "Christian verse", "Biblical wisdom"],
  }
}

// Utility function to generate meta tags for Bible chapters
export function generateChapterMeta(book: string, chapter: number) {
  return {
    title: `${book} Chapter ${chapter} - Bible`,
    description: `Read ${book} Chapter ${chapter} with verse-by-verse commentary, cross-references, and AI-powered insights on BibleAF.`,
    keywords: ["Bible chapter", book, `${book} ${chapter}`, "Scripture reading", "Bible study", "Christian reading"],
  }
}

// Utility function to generate meta tags for topics
export function generateTopicMeta(topic: string) {
  return {
    title: `Bible Verses About ${topic}`,
    description: `Discover biblical wisdom about ${topic} with curated verses, AI-powered insights, and spiritual guidance on BibleAF.`,
    keywords: ["Bible verses", topic, `Bible about ${topic}`, "Scripture", "Biblical wisdom", "Christian guidance"],
  }
}
