import type { Metadata } from "next"
import ComprehensiveBibleSearch from "@/components/comprehensive-bible-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, Database, Search, Bookmark } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Complete Bible Search | BibleAF.ai",
  description:
    "Search through the complete Bible with multiple translations. Access 31,000+ verses across 66 books with AI-powered insights.",
  keywords: "Bible search, Bible verses, KJV, Bible translations, scripture search",
}

export default function BiblePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Bible Database
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Search through 31,000+ verses across multiple translations
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Book size={16} />
              <span>66 Books</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={16} />
              <span>5 Translations</span>
            </div>
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span>Full-Text Search</span>
            </div>
          </div>
        </div>

        {/* Main Search Component */}
        <div className="mb-12">
          <ComprehensiveBibleSearch />
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book size={20} />
                Browse by Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Navigate through all 66 books of the Bible chapter by chapter.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/test-full-bible">Browse Books</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search size={20} />
                AI Bible Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered insights and contextual Bible verse recommendations.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">AI Search</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bookmark size={20} />
                Daily Verses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Discover daily inspiration with curated Bible verses and reflections.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Daily Verses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Available Bible Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "kjv", name: "King James Version", year: "1769", description: "Classic English translation" },
                {
                  id: "web",
                  name: "World English Bible",
                  year: "2000",
                  description: "Modern public domain translation",
                },
                {
                  id: "asv",
                  name: "American Standard Version",
                  year: "1901",
                  description: "Scholarly American translation",
                },
                {
                  id: "ylt",
                  name: "Young's Literal Translation",
                  year: "1898",
                  description: "Word-for-word literal translation",
                },
                { id: "darby", name: "Darby Translation", year: "1890", description: "Plymouth Brethren translation" },
              ].map((translation) => (
                <div key={translation.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{translation.name}</h4>
                  <p className="text-sm text-muted-foreground">{translation.year}</p>
                  <p className="text-xs text-muted-foreground mt-1">{translation.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
