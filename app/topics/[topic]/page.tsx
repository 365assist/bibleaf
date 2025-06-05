import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, Search, Heart } from "lucide-react"
import Link from "next/link"
import { SEOService } from "@/lib/seo-utils"
import { SEOHead } from "@/components/seo-head"

interface PageProps {
  params: {
    topic: string
  }
}

// Popular biblical topics
const validTopics = [
  "love",
  "faith",
  "hope",
  "peace",
  "joy",
  "forgiveness",
  "salvation",
  "prayer",
  "wisdom",
  "strength",
  "courage",
  "grace",
  "mercy",
  "trust",
  "healing",
  "comfort",
  "guidance",
  "protection",
  "blessing",
  "worship",
  "fear",
  "anxiety",
  "depression",
  "marriage",
  "family",
  "children",
  "money",
  "work",
  "purpose",
  "calling",
  "service",
  "leadership",
]

const topicContent: Record<
  string,
  {
    description: string
    keyVerses: { reference: string; text: string }[]
    relatedTopics: string[]
  }
> = {
  love: {
    description:
      "Love is the greatest commandment and the foundation of Christian faith. Explore what the Bible teaches about God's love, loving others, and the nature of divine love.",
    keyVerses: [
      { reference: "1 John 4:8", text: "God is love." },
      { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son..." },
      { reference: "1 Corinthians 13:4-7", text: "Love is patient, love is kind..." },
    ],
    relatedTopics: ["grace", "mercy", "forgiveness", "marriage"],
  },
  faith: {
    description:
      "Faith is confidence in what we hope for and assurance about what we do not see. Discover biblical teachings about faith, trust, and believing in God.",
    keyVerses: [
      {
        reference: "Hebrews 11:1",
        text: "Faith is confidence in what we hope for and assurance about what we do not see.",
      },
      {
        reference: "Romans 10:17",
        text: "Faith comes from hearing the message, and the message is heard through the word about Christ.",
      },
      { reference: "Matthew 17:20", text: "If you have faith as small as a mustard seed..." },
    ],
    relatedTopics: ["trust", "hope", "salvation", "prayer"],
  },
  hope: {
    description:
      "Hope in the Bible is not wishful thinking but confident expectation based on God's promises. Learn about the hope we have in Christ and eternal life.",
    keyVerses: [
      { reference: "Romans 15:13", text: "May the God of hope fill you with all joy and peace as you trust in him..." },
      { reference: "1 Peter 1:3", text: "In his great mercy he has given us new birth into a living hope..." },
      { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord..." },
    ],
    relatedTopics: ["faith", "peace", "salvation", "comfort"],
  },
  // Add more topics as needed
}

export default function TopicPage({ params }: PageProps) {
  const topic = decodeURIComponent(params.topic).toLowerCase()

  if (!validTopics.includes(topic)) {
    notFound()
  }

  const content = topicContent[topic]
  const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1)
  const seoData = SEOService.generateVersePageSEO(topicTitle, 1) // Using verse SEO as template

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        structuredData={seoData.structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {topicTitle} in the Bible
            </h1>
            <p className="text-xl text-muted-foreground">
              {content?.description ||
                `Discover what the Bible says about ${topic} with AI-powered insights and relevant verses.`}
            </p>
          </div>

          {/* Search for this topic */}
          <Card className="divine-light-card mb-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">Search Bible Verses About {topicTitle}</h2>
              <p className="text-muted-foreground mb-6">
                Use our AI-powered search to find relevant verses about {topic}
              </p>
              <Link href={`/dashboard?search=${encodeURIComponent(topic)}`}>
                <Button className="divine-button">
                  <Search className="h-4 w-4 mr-2" />
                  Search "{topicTitle}" Verses
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Key Verses */}
          {content?.keyVerses && (
            <Card className="divine-light-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-amber-600" />
                  Key Verses About {topicTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content.keyVerses.map((verse, index) => (
                    <div key={index} className="border-l-4 border-amber-500 pl-4">
                      <p className="text-lg italic mb-2">"{verse.text}"</p>
                      <p className="text-sm text-muted-foreground font-semibold">- {verse.reference}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Topics */}
          {content?.relatedTopics && (
            <Card className="divine-light-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-amber-600" />
                  Related Biblical Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {content.relatedTopics.map((relatedTopic) => (
                    <Link key={relatedTopic} href={`/topics/${relatedTopic}`}>
                      <Button variant="outline" size="sm" className="hover:bg-amber-50">
                        {relatedTopic.charAt(0).toUpperCase() + relatedTopic.slice(1)}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="divine-light-card">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Explore More Biblical Wisdom</h2>
              <p className="text-muted-foreground mb-6">
                Discover deeper insights about {topic} and other biblical topics with BibleAF's AI-powered study tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="divine-button">Start Bible Study</Button>
                </Link>
                <Link href="/daily-verse">
                  <Button variant="outline">Get Daily Verses</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const topic = decodeURIComponent(params.topic).toLowerCase()

  if (!validTopics.includes(topic)) {
    return {
      title: "Topic Not Found - BibleAF",
    }
  }

  const seoData = SEOService.generateTopicPageSEO(topic)

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(", "),
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: seoData.ogType,
      images: [seoData.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage],
    },
    alternates: {
      canonical: seoData.canonical,
    },
  }
}

export async function generateStaticParams() {
  return validTopics.map((topic) => ({
    topic: topic,
  }))
}
