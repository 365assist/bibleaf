export interface StructuredData {
  "@context": string
  "@type": string
  [key: string]: any
}

export class StructuredDataService {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bibleaf.ai"

  static generateWebsiteStructuredData(): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BibleAF",
      alternateName: ["Bible AF", "AI-Powered Bible Study", "BibleAF App"],
      url: this.baseUrl,
      description:
        "AI-powered Bible study platform with intelligent verse search, daily devotionals, spiritual guidance, and pastoral care for deeper faith understanding.",
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
        logo: {
          "@type": "ImageObject",
          url: `${this.baseUrl}/icons/icon-512x512.png`,
          width: 512,
          height: 512,
        },
        foundingDate: "2024",
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          url: `${this.baseUrl}/contact`,
          availableLanguage: "English",
        },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Christians, Bible students, pastors, spiritual seekers, faith communities",
      },
      category: ["Religion", "Education", "Spirituality", "Bible Study"],
      keywords:
        "Bible study, AI Bible, spiritual guidance, Christian app, biblical insights, scripture search, faith journey, pastoral care, daily devotionals",
      inLanguage: "en-US",
      isAccessibleForFree: true,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "BibleAF Subscription Plans",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Free Plan",
            price: "0",
            priceCurrency: "USD",
            description: "Basic Bible study features with limited AI searches",
          },
          {
            "@type": "Offer",
            name: "Basic Plan",
            price: "9.99",
            priceCurrency: "USD",
            billingIncrement: "monthly",
            description: "Unlimited AI searches and enhanced features",
          },
          {
            "@type": "Offer",
            name: "Premium Plan",
            price: "19.99",
            priceCurrency: "USD",
            billingIncrement: "monthly",
            description: "Full access including AI coaching and advanced tools",
          },
        ],
      },
    }
  }

  static generateBibleVerseStructuredData(verse: {
    reference: string
    text: string
    book: string
    chapter: number
    verse: number
    translation?: string
  }): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${verse.reference} - Bible Verse with AI Insights`,
      description: `"${verse.text}" - Study ${verse.reference} with AI-powered commentary, cross-references, and spiritual insights.`,
      articleBody: verse.text,
      author: {
        "@type": "Organization",
        name: "BibleAF",
      },
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
        logo: {
          "@type": "ImageObject",
          url: `${this.baseUrl}/icons/icon-512x512.png`,
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/bible/${encodeURIComponent(verse.book.toLowerCase())}/${verse.chapter}?verse=${verse.verse}`,
      },
      about: {
        "@type": "Thing",
        name: `Bible Verse ${verse.reference}`,
        description: `Biblical scripture from ${verse.book} chapter ${verse.chapter}, verse ${verse.verse}`,
        sameAs: [
          `https://www.biblegateway.com/passage/?search=${encodeURIComponent(verse.reference)}`,
          `https://www.biblehub.com/${verse.book.toLowerCase()}/${verse.chapter}-${verse.verse}.htm`,
        ],
      },
      isPartOf: {
        "@type": "Book",
        name: "The Holy Bible",
        author: "Various Biblical Authors",
        translator: verse.translation || "English Standard Version",
        inLanguage: "en",
      },
      keywords: `${verse.reference}, ${verse.book}, Bible verse, Scripture, Christian, Biblical study, spiritual guidance`,
      genre: "Religious Text",
      educationalLevel: "General",
      audience: {
        "@type": "Audience",
        audienceType: "Christians, Bible students, spiritual seekers",
      },
    }
  }

  static generateBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url ? `${this.baseUrl}${item.url}` : undefined,
      })),
    }
  }

  static generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }
  }

  static generateOrganizationStructuredData(): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BibleAF",
      alternateName: "Bible AF",
      url: this.baseUrl,
      logo: `${this.baseUrl}/icons/icon-512x512.png`,
      description:
        "AI-powered Bible study platform providing intelligent Scripture search, spiritual guidance, and pastoral care for Christians worldwide.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        url: `${this.baseUrl}/contact`,
        availableLanguage: "English",
      },
      sameAs: ["https://twitter.com/bibleaf", "https://facebook.com/bibleaf", "https://instagram.com/bibleaf"],
      offers: {
        "@type": "Offer",
        category: "Digital Service",
        name: "Bible Study Platform",
        description: "AI-powered Bible study with spiritual guidance",
        availability: "https://schema.org/InStock",
      },
    }
  }

  static generateSoftwareApplicationStructuredData(): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "BibleAF",
      applicationCategory: "Religious Application",
      operatingSystem: "Web Browser, iOS, Android",
      description:
        "AI-powered Bible study application with intelligent verse search, daily devotionals, and spiritual guidance features.",
      url: this.baseUrl,
      downloadUrl: this.baseUrl,
      softwareVersion: "1.0",
      datePublished: "2024-01-01",
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Free Plan",
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Premium Plan",
          price: "9.99",
          priceCurrency: "USD",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1250",
        bestRating: "5",
        worstRating: "1",
      },
      screenshot: `${this.baseUrl}/images/app-screenshot.png`,
      featureList: [
        "AI-powered Bible search",
        "Daily verse and devotionals",
        "Spiritual guidance and counseling",
        "Cross-references and commentary",
        "Offline reading capability",
        "Multiple Bible translations",
      ],
    }
  }

  static generateDailyVerseStructuredData(verse: {
    reference: string
    text: string
    date: string
    reflection?: string
  }): StructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Daily Bible Verse - ${verse.reference} (${verse.date})`,
      description: `Today's inspiring Bible verse: "${verse.text}" - ${verse.reference}. Start your day with God's Word and spiritual reflection.`,
      articleBody: verse.text + (verse.reflection ? `\n\nReflection: ${verse.reflection}` : ""),
      datePublished: new Date(verse.date).toISOString(),
      dateModified: new Date(verse.date).toISOString(),
      author: {
        "@type": "Organization",
        name: "BibleAF",
      },
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
        logo: {
          "@type": "ImageObject",
          url: `${this.baseUrl}/icons/icon-512x512.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/daily-verse/${verse.date}`,
      },
      about: {
        "@type": "Thing",
        name: "Daily Bible Verse",
        description: "Daily spiritual reading and reflection from Scripture",
      },
      keywords: "daily Bible verse, daily devotional, Scripture reading, Christian daily reading, spiritual growth",
      genre: "Religious Content",
      audience: {
        "@type": "Audience",
        audienceType: "Christians, spiritual seekers",
      },
    }
  }
}
