# Bible API Integration Setup

This document explains how to set up and configure the Bible API integrations for BibleAF.

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

## Local Bible Storage

The application primarily uses local Bible data stored in Vercel Blob storage for fast, reliable access.

### 1. Available Translations

- KJV (King James Version)
- NIV (New International Version)
- NASB (New American Standard Bible)
- NLT (New Living Translation)
- CSB (Christian Standard Bible)

### 2. Data Management

Bible text is stored in JSON format in Vercel Blob storage:
- Fast retrieval
- No API rate limits
- Offline capability
- Consistent availability

## Fallback Strategy

The Bible API service implements a fallback strategy:

1. **Primary**: Local Bible data from blob storage
2. **Secondary**: YouVersion API (if configured)
3. **Fallback**: Hardcoded popular verses for common references

## Environment Variables

Add these to your `.env.local` file:

\`\`\`bash
# YouVersion (if partnership approved)
YOUVERSION_API_KEY=your_youversion_key_here
YOUVERSION_API_SECRET=your_youversion_secret_here

# Vercel Blob Storage (required)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...your_token_here
\`\`\`

## Rate Limiting and Caching

### 1. Local Storage Benefits

Using local Bible data eliminates most rate limiting concerns:
- No API calls for Bible text retrieval
- Instant response times
- No external dependencies

### 2. YouVersion Rate Limiting

If using YouVersion API:
\`\`\`typescript
// Implement rate limiting for YouVersion
const rateLimiter = new RateLimiter({
  youversion: { requests: 1000, window: 3600000 }, // 1000/hour
})
\`\`\`

## Testing

### 1. Test Local Bible Data

\`\`\`typescript
// Test local Bible service
const verse = await bibleAPIService.getVerse('John 3:16', 'KJV')
console.log(verse)
\`\`\`

### 2. Test YouVersion Integration

\`\`\`bash
# Test YouVersion API (if configured)
curl -H "Authorization: Bearer YOUR_YOUVERSION_TOKEN" \
  "https://api.youversion.com/v1/verses"
\`\`\`

## Legal Considerations

1. **Copyright**: Respect Bible translation copyrights
2. **Terms of Service**: Follow YouVersion's terms if using their API
3. **Attribution**: Provide proper attribution for Bible text
4. **Commercial Use**: Some translations may restrict commercial usage

## Next Steps

1. Upload Bible data to blob storage using provided scripts
2. Test local Bible functionality
3. Consider YouVersion partnership for additional translations
4. Implement caching for optimal performance
5. Monitor usage and performance
