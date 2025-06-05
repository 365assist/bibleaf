"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, ArrowRight } from "lucide-react"

export default function BibleNavigation() {
  const [reference, setReference] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reference.trim()) return

    setIsLoading(true)

    try {
      // Parse different reference formats
      const cleanRef = reference.trim()

      // Check if it's a verse reference (contains :)
      if (cleanRef.includes(":")) {
        router.push(`/bible/verse/${encodeURIComponent(cleanRef)}`)
      } else {
        // Try to parse as book chapter
        const match = cleanRef.match(/^(.+?)\s*(\d+)$/)
        if (match) {
          const book = match[1].trim()
          const chapter = match[2]
          router.push(`/bible/${encodeURIComponent(book)}/${chapter}`)
        } else {
          // Just a book name, go to chapter 1
          router.push(`/bible/${encodeURIComponent(cleanRef)}/1`)
        }
      }
    } catch (error) {
      console.error("Navigation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const popularVerses = [
    { ref: "John 3:16", title: "For God so loved the world..." },
    { ref: "Psalm 23:1", title: "The Lord is my shepherd..." },
    { ref: "Romans 8:28", title: "All things work together for good..." },
    { ref: "Philippians 4:13", title: "I can do all things through Christ..." },
    { ref: "Jeremiah 29:11", title: "For I know the plans I have for you..." },
    { ref: "Isaiah 40:31", title: "Those who hope in the Lord..." },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Bible Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter reference (e.g., John 3:16, Psalm 23, Romans 8)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Popular Verses */}
        <div>
          <h3 className="text-sm font-medium mb-3">Popular Verses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {popularVerses.map((verse) => (
              <Button
                key={verse.ref}
                variant="ghost"
                className="justify-between h-auto p-3 text-left"
                onClick={() => router.push(`/bible/verse/${encodeURIComponent(verse.ref)}`)}
              >
                <div>
                  <div className="font-medium text-sm">{verse.ref}</div>
                  <div className="text-xs text-muted-foreground truncate">{verse.title}</div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            ))}
          </div>
        </div>

        {/* Format Examples */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Supported formats:</p>
          <ul className="space-y-1">
            <li>• Verse: "John 3:16", "Psalm 23:1"</li>
            <li>• Chapter: "John 3", "Psalm 23"</li>
            <li>• Book: "John", "Psalms"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
