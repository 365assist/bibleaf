import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle Bible URL patterns
  if (pathname.startsWith("/bible/")) {
    // Handle verse reference patterns like /bible/John3:16/1
    const verseReferenceMatch = pathname.match(/^\/bible\/([^/]+)\/(\d+)$/)
    if (verseReferenceMatch) {
      const reference = verseReferenceMatch[1]
      const possibleVerse = verseReferenceMatch[2]

      // Check if this looks like a verse reference (e.g., John3:16)
      if (reference.includes("3%3A") || reference.includes(":")) {
        // Redirect to verse route
        const cleanReference = reference.replace(/3%3A/g, "3:")
        return NextResponse.redirect(new URL(`/bible/verse/${cleanReference}`, request.url))
      }
    }

    // Handle malformed URLs like /bible/John3%3A16/1
    const malformedMatch = pathname.match(/^\/bible\/([^/]+%3A[^/]+)\/(.+)$/)
    if (malformedMatch) {
      const reference = decodeURIComponent(malformedMatch[1])
      return NextResponse.redirect(new URL(`/bible/verse/${reference}`, request.url))
    }

    // Handle book/chapter/verse pattern like /bible/John/3/16
    const bookChapterVerseMatch = pathname.match(/^\/bible\/([^/]+)\/(\d+)\/(\d+)$/)
    if (bookChapterVerseMatch) {
      const book = bookChapterVerseMatch[1]
      const chapter = bookChapterVerseMatch[2]
      const verse = bookChapterVerseMatch[3]

      // Redirect to chapter with verse anchor
      return NextResponse.redirect(new URL(`/bible/${book}/${chapter}?verse=${verse}`, request.url))
    }
  }

  // Get response
  const response = NextResponse.next()

  // Add CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")
  }

  return response
}

// Run middleware on Bible routes and API routes
export const config = {
  matcher: ["/bible/:path*", "/api/:path*"],
}
