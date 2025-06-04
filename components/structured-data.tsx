"use client"

import { usePathname } from "next/navigation"

export function StructuredData() {
  const pathname = usePathname()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BibleAF",
    description: "AI-powered Bible study platform for modern believers",
    url: "https://bibleaf.ai",
    logo: "https://bibleaf.ai/icons/icon-512x512.png",
    sameAs: ["https://twitter.com/BibleAF", "https://facebook.com/BibleAF"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-BIBLE-AF",
      contactType: "customer service",
      email: "support@bibleaf.ai",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BibleAF",
    description: "AI-powered Bible study for modern believers",
    url: "https://bibleaf.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bibleaf.ai/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BibleAF",
    description:
      "AI-powered Bible study platform with intelligent verse search, daily devotionals, and spiritual guidance",
    url: "https://bibleaf.ai",
    applicationCategory: "EducationApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with premium features available",
    },
    featureList: [
      "AI-powered Bible verse search",
      "Daily personalized verses",
      "Biblical life guidance",
      "Text-to-speech Scripture reading",
      "Cross-reference exploration",
      "Verse saving and organization",
    ],
  }

  // Page-specific schemas
  let pageSchema = null

  if (pathname === "/") {
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "BibleAF - AI-Powered Bible Study for Modern Believers",
      description: "Experience Scripture with AI-powered insights, daily devotionals, and spiritual guidance",
      url: "https://bibleaf.ai",
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "BibleAF",
        applicationCategory: "EducationApplication",
        operatingSystem: "Web Browser",
      },
    }
  } else if (pathname.startsWith("/bible/verse/")) {
    const reference = pathname.split("/").pop()
    pageSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Bible Verse: ${reference}`,
      description: `Read and study ${reference} with AI-powered insights and commentary`,
      url: `https://bibleaf.ai${pathname}`,
      author: {
        "@type": "Organization",
        name: "BibleAF",
      },
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
        logo: {
          "@type": "ImageObject",
          url: "https://bibleaf.ai/icons/icon-512x512.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://bibleaf.ai${pathname}`,
      },
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageSchema),
          }}
        />
      )}
    </>
  )
}
