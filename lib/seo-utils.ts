export interface SEOData {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  structuredData?: any
  noindex?: boolean
  alternateLanguages?: { hreflang: string; href: string }[]
}

export class SEOService {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bibleaf.ai"

  static generateVersePageSEO(book: string, chapter: number, verse?: number): SEOData {
    const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`
    const verseText = verse ? ` verse ${verse}` : ""

    return {
      title: `${reference} - Bible Study with AI Insights | BibleAF`,
      description: `Read ${reference}${verseText} with AI-powered commentary, cross-references, and spiritual insights. Experience deeper Bible study with BibleAF's intelligent features.`,
      keywords: [
        book.toLowerCase(),
        `${book.toLowerCase()} ${chapter}`,
        verse ? `${book.toLowerCase()} ${chapter}:${verse}` : "",
        "bible verse",
        "scripture",
        "ai bible study",
        "biblical commentary",
        "christian devotional",
        "bible reading",
        "spiritual guidance",
      ].filter(Boolean),
      canonical: `/bible/${encodeURIComponent(book.toLowerCase())}/${chapter}${verse ? `?verse=${verse}` : ""}`,
      ogImage: `/api/og/verse?book=${encodeURIComponent(book)}&chapter=${chapter}${verse ? `&verse=${verse}` : ""}`,
      ogType: "article",
      structuredData: this.generateVerseStructuredData(book, chapter, verse),
    }
  }

  static generateSearchPageSEO(query: string, results?: number): SEOData {
    return {
      title: `"${query}" - Bible Search Results | BibleAF`,
      description: `Find Bible verses about "${query}" with AI-powered search. Discover ${results || "relevant"} scripture passages with intelligent insights and commentary.`,
      keywords: [
        query.toLowerCase(),
        "bible search",
        "scripture search",
        "find bible verses",
        "ai bible search",
        "biblical topics",
        "christian search",
      ],
      canonical: `/search?q=${encodeURIComponent(query)}`,
      ogImage: `/api/og/search?q=${encodeURIComponent(query)}`,
      noindex: true, // Search result pages typically shouldn't be indexed
    }
  }

  static generateTopicPageSEO(topic: string): SEOData {
    const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1)

    return {
      title: `${topicTitle} in the Bible - Verses & AI Insights | BibleAF`,
      description: `Explore what the Bible says about ${topic.toLowerCase()}. Find relevant verses, AI-generated insights, and spiritual guidance on ${topic.toLowerCase()} from Scripture.`,
      keywords: [
        topic.toLowerCase(),
        `${topic.toLowerCase()} bible verses`,
        `what does the bible say about ${topic.toLowerCase()}`,
        "biblical perspective",
        "scripture about",
        "christian teaching",
        "bible study topic",
      ],
      canonical: `/topics/${encodeURIComponent(topic.toLowerCase())}`,
      ogImage: `/api/og/topic?topic=${encodeURIComponent(topic)}`,
      structuredData: this.generateTopicStructuredData(topic),
    }
  }

  static generateDailyVersePageSEO(date: string): SEOData {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      title: `Daily Bible Verse for ${formattedDate} | BibleAF`,
      description: `Today's Bible verse with AI-powered insights and spiritual reflection. Start your day with God's Word and personalized devotional content.`,
      keywords: [
        "daily bible verse",
        "daily devotional",
        "today bible verse",
        "daily scripture",
        "christian daily reading",
        "bible verse of the day",
        "spiritual daily bread",
      ],
      canonical: `/daily-verse/${date}`,
      ogImage: `/api/og/daily-verse?date=${date}`,
      structuredData: this.generateDailyVerseStructuredData(date),
    }
  }

  private static generateVerseStructuredData(book: string, chapter: number, verse?: number) {
    const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${reference} - Bible Study with AI Insights`,
      description: `Read and study ${reference} with AI-powered commentary and spiritual insights`,
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
        "@id": `${this.baseUrl}/bible/${encodeURIComponent(book.toLowerCase())}/${chapter}`,
      },
      about: {
        "@type": "Thing",
        name: `${book} Chapter ${chapter}`,
        description: `Biblical text from the book of ${book}, chapter ${chapter}`,
      },
      keywords: `${book}, Bible, Scripture, ${reference}, Christian, Biblical study`,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "Book",
        name: "The Holy Bible",
        author: "Various Biblical Authors",
      },
    }
  }

  private static generateTopicStructuredData(topic: string) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${topic} in the Bible - Verses & Insights`,
      description: `Biblical perspective and verses about ${topic}`,
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
      about: {
        "@type": "Thing",
        name: topic,
        description: `Biblical teachings and verses about ${topic}`,
      },
      keywords: `${topic}, Bible, Scripture, Christian teaching, Biblical perspective`,
      inLanguage: "en-US",
    }
  }

  private static generateDailyVerseStructuredData(date: string) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Daily Bible Verse for ${date}`,
      description: "Daily Bible verse with AI-powered insights and spiritual reflection",
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
      datePublished: date,
      dateModified: date,
      about: {
        "@type": "Thing",
        name: "Daily Bible Verse",
        description: "Daily spiritual reading and reflection",
      },
      keywords: "Daily Bible verse, devotional, Scripture, Christian daily reading",
      inLanguage: "en-US",
    }
  }

  static generateBreadcrumbs(items: { name: string; url?: string }[]) {
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

  static generateWebsiteStructuredData() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BibleAF",
      alternateName: "Bible AF - AI-Powered Bible Study",
      url: this.baseUrl,
      description:
        "AI-powered Bible study platform with intelligent verse search, daily devotionals, and spiritual guidance",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "BibleAF",
        logo: {
          "@type": "ImageObject",
          url: `${this.baseUrl}/icons/icon-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: ["https://twitter.com/bibleaf", "https://github.com/bibleaf"],
      },
      inLanguage: "en-US",
      copyrightYear: 2024,
      genre: "Religious Education",
      audience: {
        "@type": "Audience",
        audienceType: "Christians, Bible students, spiritual seekers",
      },
    }
  }
}
