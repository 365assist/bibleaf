# Bible API Integration Setup

This document explains how to set up and configure the Bible API integrations for BibleAF.

## ESV API Setup

The ESV API is the primary Bible text source and provides high-quality, accurate Bible text.

### 1. Get ESV API Key

1. Visit [ESV API website](https://api.esv.org/)
2. Create a free account
3. Generate an API key
4. Add to your environment variables:

\`\`\`bash
ESV_API_KEY=your_esv_api_key_here
\`\`\`

### 2. ESV API Features

- **Text Retrieval**: Get chapters, verses, and passages
- **Search**: Full-text search across the ESV Bible
- **Multiple Formats**: HTML, plain text, audio
- **Rate Limits**: 5,000 requests per day (free tier)

### 3. Usage Examples

\`\`\`typescript
// Get a chapter
const chapter = await bibleAPIService.getChapter('John', 3, 'ESV')

// Get a specific verse
const verse = await bibleAPIService.getVerse('John 3:16', 'ESV')

// Search for verses
const results = await bibleAPIService.searchBible('love', 'ESV')
\`\`\`

## Bible Gateway Integration

Bible Gateway provides access to multiple translations but requires careful implementation.

### 1. Implementation Options

**Option A: Official API (Recommended)**
- Contact Bible Gateway for API access
- Requires partnership agreement
- Full access to all translations

**Option B: Web Scraping (Limited)**
- Parse public Bible Gateway pages
- Must respect rate limits and terms of service
- Limited to public content only

### 2. Available Translations

- NIV (New International Version)
- KJV (King James Version)
- NASB (New American Standard Bible)
- NLT (New Living Translation)
- CSB (Christian Standard Bible)
- And many more...

### 3. Rate Limiting

If using web scraping:
- Implement delays between requests
- Cache results to minimize requests
- Respect robots.txt
- Consider using a proxy service

## YouVersion API Integration

YouVersion has the largest collection of Bible translations but requires partnership.

### 1. Partnership Requirements

1. Contact YouVersion for API access
2. Explain your use case and application
3. Sign partnership agreement
4. Receive API credentials

### 2. Features

- 2,000+ Bible versions
- 1,300+ languages
- Reading plans
- Verse of the day
- Social features

### 3. Implementation

\`\`\`typescript
// Example YouVersion API call (requires partnership)
const response = await fetch('https://api.youversion.com/v1/verses', {
  headers: {
    'Authorization': 'Bearer YOUR_YOUVERSION_TOKEN',
    'Content-Type': 'application/json'
  }
})
\`\`\`

## Fallback Strategy

The Bible API service implements a fallback strategy:

1. **Primary**: ESV API for ESV translation
2. **Secondary**: Bible Gateway for other translations
3. **Tertiary**: YouVersion API
4. **Fallback**: Local verse database for common verses

## Environment Variables

Add these to your `.env.local` file:

\`\`\`bash
# ESV API
ESV_API_KEY=your_esv_api_key_here

# Bible Gateway (if using official API)
BIBLE_GATEWAY_API_KEY=your_bible_gateway_key_here

# YouVersion (if partnership approved)
YOUVERSION_API_KEY=your_youversion_key_here
YOUVERSION_API_SECRET=your_youversion_secret_here
\`\`\`

## Rate Limiting and Caching

### 1. Implement Caching

\`\`\`typescript
// Cache Bible chapters for 24 hours
const cacheKey = `bible:${book}:${chapter}:${translation}`
const cached = await redis.get(cacheKey)
if (cached) {
  return JSON.parse(cached)
}

// Fetch from API and cache
const result = await fetchFromAPI()
await redis.setex(cacheKey, 86400, JSON.stringify(result))
\`\`\`

### 2. Rate Limiting

\`\`\`typescript
// Implement rate limiting per API
const rateLimiter = new RateLimiter({
  esv: { requests: 5000, window: 86400000 }, // 5000/day
  bibleGateway: { requests: 100, window: 3600000 }, // 100/hour
})
\`\`\`

## Testing

### 1. Test ESV API

\`\`\`bash
curl -H "Authorization: Token YOUR_ESV_API_KEY" \
  "https://api.esv.org/v3/passage/text/?q=John+3:16"
\`\`\`

### 2. Test Your Implementation

\`\`\`typescript
// Test in your app
const verse = await bibleAPIService.getVerse('John 3:16', 'ESV')
console.log(verse)
\`\`\`

## Legal Considerations

1. **Copyright**: Respect Bible translation copyrights
2. **Terms of Service**: Follow each API's terms
3. **Attribution**: Provide proper attribution for Bible text
4. **Commercial Use**: Some APIs restrict commercial usage

## Next Steps

1. Set up ESV API key
2. Test basic functionality
3. Implement caching layer
4. Add error handling and fallbacks
5. Consider partnerships for additional translations
6. Monitor usage and performance
