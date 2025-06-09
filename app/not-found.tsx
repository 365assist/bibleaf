import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="divine-light-bg">
      <div className="divine-light-overlay">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="divine-light-card max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Trust in the Lord with all your heart and lean not on your own understanding." - Proverbs 3:5
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="divine-button">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Bible
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
