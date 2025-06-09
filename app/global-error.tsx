"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="divine-light-bg">
          <div className="divine-light-overlay">
            <div className="min-h-screen flex items-center justify-center p-4">
              <Card className="divine-light-card max-w-md w-full text-center">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-red-600">Something went wrong</CardTitle>
                  <CardDescription>An unexpected error occurred. Please try again.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500">
                    "The Lord is close to the brokenhearted and saves those who are crushed in spirit." - Psalm 34:18
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="divine-button flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Go Home
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
