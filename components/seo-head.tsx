import Head from "next/head"
import { SEOService } from "@/lib/seo-utils"

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  noindex?: boolean
  structuredData?: any
}

export function SEOHead({
  title = "BibleAF – AI-Powered Bible Study for Modern Believers",
  description = "BibleAF is an AI-powered Bible study tool offering smart verse search, daily devotionals, and spiritual guidance. Experience Scripture in a new way.",
  canonical,
  ogImage = "/images/og-image.png",
  ogType = "website",
  noindex = false,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title.includes("BibleAF") ? title : `${title} | BibleAF`
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bibleaf.ai"
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="theme-color" content="#e9b949" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="BibleAF" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="author" content="BibleAF Team" />
      <meta
        name="keywords"
        content="Bible study, AI, Scripture search, daily devotional, Christian app, Bible verses, spiritual guidance"
      />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Website structured data (always include on homepage) */}
      {canonical === "/" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SEOService.generateWebsiteStructuredData()),
          }}
        />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
}
