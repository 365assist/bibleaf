"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
  bookName: string
}

export default function TestDailyVerse() {
  const [verse, setVerse] = useState<BibleVerse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiResponse, setApiResponse] = useState<any>(null)

  const loadVerse = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("Fetching daily verse...")
      const response = await fetch("/api/bible/daily-verse?translation=niv")
      console.log("Response status:", response.status)

      const text = await response.text()
      console.log("Raw response:", text)

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${text}`)
      }

      setApiResponse(data)

      if (data.success && data.verse) {
        setVerse({
          book: data.verse.book,
          chapter: data.verse.chapter,
          verse: data.verse.verse,
          text: data.verse.text,
          translation: data.verse.translation,
          bookName: data.verse.bookName || data.verse.book,
        })
      } else {
        setError("API returned unsuccessful response")
      }
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVerse()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Daily Verse API Test
            <Button onClick={loadVerse} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Reload
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading verse...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-semibold text-destructive mb-2">Error</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}

          {verse && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Daily Verse</h3>
              <blockquote className="text-lg italic mb-4">"{verse.text}"</blockquote>
              <p className="font-semibold text-primary">
                {verse.bookName} {verse.chapter}:{verse.verse} ({verse.translation})
              </p>
            </div>
          )}

          {apiResponse && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Raw API Response</h3>
              <pre className="text-xs overflow-auto bg-background p-3 rounded border">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
