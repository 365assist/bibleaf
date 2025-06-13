# Bible Data Setup

This document explains how to set up and manage Bible data for BibleAF using local storage.

## Local Bible Storage

BibleAF uses Vercel Blob storage to store Bible translations locally for fast, reliable access without external API dependencies.

### 1. Available Translations

The following Bible translations are supported:

- **KJV** (King James Version) - Public Domain
- **NIV** (New International Version) - Requires licensing
- **NASB** (New American Standard Bible) - Requires licensing  
- **NLT** (New Living Translation) - Requires licensing
- **CSB** (Christian Standard Bible) - Requires licensing
- **WEB** (World English Bible) - Public Domain

### 2. Data Storage Format

Bible text is stored in JSON format in Vercel Blob storage:

\`\`\`json
{
  "translation": {
    "id": "kjv",
    "name": "King James Version",
    "abbreviation": "KJV",
    "language": "en",
    "year": 1769,
    "copyright": "Public Domain",
    "isPublicDomain": true
  },
  "books": {
    "john": {
      "1": {
        "1": "In the beginning was the Word...",
        "2": "The same was in the beginning with God..."
      }
    }
  },
  "metadata": {
    "totalVerses": 31102,
    "totalChapters": 1189,
    "downloadDate": "2024-01-01T00:00:00.000Z",
    "source": "public-domain"
  }
}
\`\`\`

### 3. Benefits of Local Storage

- **Fast Performance**: No API calls or network delays
- **Reliability**: No external dependencies or rate limits
- **Offline Capability**: Works without internet connection
- **Cost Effective**: No API fees or usage limits
- **Consistent Availability**: Always accessible

## Setting Up Bible Data

### 1. Upload Sample Data

Use the provided script to upload sample Bible data:

\`\`\`bash
# Upload sample Bible chapters for testing
npm run upload-sample-bibles
\`\`\`

### 2. Upload Full Bible Translations

For production use, upload complete Bible translations:

\`\`\`bash
# Download and upload full Bible translations
npm run download-full-bibles
\`\`\`

### 3. Validate Data

Check that Bible data is properly uploaded:

\`\`\`bash
# Validate Bible data integrity
npm run bible-data-validator
\`\`\`

## Environment Variables

Only Vercel Blob storage is required:

\`\`\`bash
# Vercel Blob Storage (required)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...your_token_here
\`\`\`

## API Usage

### 1. Get Chapter

\`\`\`typescript
import { bibleAPIService } from '@/lib/bible-api-service'

// Get a chapter
const chapter = await bibleAPIService.getChapter('John', 3, 'KJV')
\`\`\`

### 2. Get Verse

\`\`\`typescript
// Get a specific verse
const verse = await bibleAPIService.getVerse('John 3:16', 'KJV')
\`\`\`

### 3. Search Bible

\`\`\`typescript
// Search for verses
const results = await bibleAPIService.searchBible('love', 'KJV', 10)
\`\`\`

### 4. Daily Verse

\`\`\`typescript
// Get daily verse
const dailyVerse = await bibleAPIService.getDailyVerse('KJV')
\`\`\`

## Data Management Scripts

### 1. Bible Downloader

Downloads Bible text from public domain sources:

\`\`\`bash
npm run bible-downloader
\`\`\`

### 2. Data Validator

Validates Bible data integrity:

\`\`\`bash
npm run bible-data-validator
\`\`\`

### 3. Cross References Generator

Generates cross-reference data:

\`\`\`bash
npm run generate-cross-references
\`\`\`

### 4. Concordance Builder

Builds searchable concordance:

\`\`\`bash
npm run build-concordance
\`\`\`

## Performance Optimization

### 1. Caching

The Bible service implements intelligent caching:

- In-memory cache for frequently accessed chapters
- 30-minute cache expiry for optimal performance
- Automatic cache invalidation when data updates

### 2. Lazy Loading

Bible data is loaded on-demand:

- Only requested chapters are fetched
- Search results are paginated
- Minimal memory footprint

### 3. Compression

Bible data is stored efficiently:

- JSON compression reduces storage size
- Optimized data structure for fast access
- Minimal bandwidth usage

## Legal Considerations

### 1. Public Domain Translations

- KJV (King James Version) - Public Domain
- WEB (World English Bible) - Public Domain
- These can be used freely without licensing

### 2. Copyrighted Translations

- NIV, NASB, NLT, CSB require proper licensing
- Contact publishers for commercial use permissions
- Provide proper attribution as required

### 3. Attribution

Always provide proper attribution:

\`\`\`html
<!-- Example attribution -->
<p>Scripture taken from the King James Version, public domain.</p>
\`\`\`

## Troubleshooting

### 1. Missing Bible Data

If Bible data is not found:

1. Check blob storage configuration
2. Run upload scripts to populate data
3. Verify environment variables
4. Check network connectivity

### 2. Performance Issues

If Bible loading is slow:

1. Check blob storage region
2. Verify caching is working
3. Monitor memory usage
4. Consider data optimization

### 3. Search Not Working

If Bible search fails:

1. Verify search index is built
2. Check query formatting
3. Ensure data is properly uploaded
4. Review search parameters

## Next Steps

1. **Setup**: Configure Vercel Blob storage
2. **Upload**: Run Bible data upload scripts
3. **Test**: Verify Bible functionality works
4. **Optimize**: Monitor performance and optimize as needed
5. **Scale**: Add more translations as needed
\`\`\`

Let's update the environment variables example file to remove YouVersion references:

\`\`\`example file=".env.local.example"
# ===========================================
# STRIPE CONFIGURATION (REQUIRED)
# ===========================================
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_51...your_actual_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...your_publishable_key_here

# ===========================================
# APP CONFIGURATION (REQUIRED)
# ===========================================
NEXT_PUBLIC_APP_URL=https://your-domain.com

# ===========================================
# AI SERVICES (REQUIRED FOR AI FEATURES)
# ===========================================
# DeepInfra API Key for AI Bible search and guidance
DEEPINFRA_API_KEY=your_deepinfra_api_key_here

# OpenAI API Key (alternative to DeepInfra)
OPENAI_API_KEY=sk-...your_openai_key_here

# ===========================================
# TEXT-TO-SPEECH (OPTIONAL)
# ===========================================
# ElevenLabs API Key for text-to-speech features
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ===========================================
# STORAGE (REQUIRED)
# ===========================================
# Vercel Blob Storage Token (already configured in your environment)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...your_token_here

# ===========================================
# DEVELOPMENT ONLY
# ===========================================
# For local development, you might want to use test keys:
# STRIPE_SECRET_KEY=sk_test_51...your_test_key_here
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...your_test_key_here
