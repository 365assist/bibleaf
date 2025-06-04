"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen } from "lucide-react"

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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Bible Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter reference (e.g., John 3:16)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Examples:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>John 3:16 (specific verse)</li>
            <li>Psalm 23 (entire chapter)</li>
            <li>Genesis (book, starts at chapter 1)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
