import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bibleaf.ai"

  const robots = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /api/
Disallow: /dashboard/
Disallow: /settings/
Disallow: /auth/
Disallow: /admin/
Disallow: /test*/
Disallow: /debug*/

# Allow public pages
Allow: /
Allow: /about
Allow: /contact
Allow: /pricing
Allow: /bible/
Allow: /topics/
Allow: /daily-verse

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/api/sitemap`

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  })
}
