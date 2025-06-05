# Bible Database Setup Guide

## Overview

This system creates a complete, self-hosted Bible database using public domain translations. No API keys or external dependencies required!

## 🚀 Quick Start

1. **Download Bible Data**
   \`\`\`bash
   node scripts/download-bibles.js
   \`\`\`

2. **Test the Database**
   - Visit `/test-local-bible` to see stats and test functionality
   - Search for verses, view daily verse, test chapter loading

## 📚 Available Translations

### Public Domain Translations
- **KJV** - King James Version (1769)
- **ASV** - American Standard Version (1901) 
- **WEB** - World English Bible (2000)
- **YLT** - Young's Literal Translation (1898)
- **DARBY** - Darby Translation (1890)

## 🗄️ Database Structure

### Files Created
\`\`\`
public/data/bibles/
├── kjv.json          # King James Version
├── web.json          # World English Bible  
├── asv.json          # American Standard Version
└── kjv-sample.json   # Sample data (fallback)
\`\`\`

### Data Format
\`\`\`json
{
  "translation": {
    "id": "kjv",
    "name": "King James Version",
    "abbreviation": "KJV",
    "isPublicDomain": true
  },
  "verses": [
    {
      "translationId": "kjv",
      "bookId": "gen",
      "chapter": 1,
      "verse": 1,
      "text": "In the beginning God created the heaven and the earth."
    }
  ],
  "stats": {
    "totalVerses": 31102,
    "books": 66,
    "downloadDate": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

## 🔧 API Endpoints

### Get Chapter
\`\`\`
GET /api/bible/chapter?book=john&chapter=3&translation=kjv
\`\`\`

### Search Verses
\`\`\`
POST /api/bible/search
{
  "query": "love",
  "translation": "kjv",
  "limit": 10
}
\`\`\`

### Daily Verse
\`\`\`
GET /api/bible/daily-verse?translation=kjv
\`\`\`

### Database Stats
\`\`\`
GET /api/bible/stats
\`\`\`

## 📖 Supported Books

All 66 canonical books:
- **Old Testament**: Genesis through Malachi (39 books)
- **New Testament**: Matthew through Revelation (27 books)

## 🔍 Search Features

- **Full-text search** across all verses
- **Translation-specific** or cross-translation search
- **Configurable limits** (default: 50 results)
- **Relevance ranking** by text matching

## 💾 Data Sources

### Primary Sources
1. **GitHub Repositories** with public domain Bible texts
2. **Sacred Texts Archive** (sacred-texts.com)
3. **World English Bible** official distribution
4. **Crosswire Bible Society** SWORD modules

### Backup Sources
- Local sample data with essential verses
- Fallback generation for testing

## 🛠️ Adding New Translations

1. **Find Public Domain Source**
   - Ensure translation is public domain
   - Locate JSON, XML, or CSV format

2. **Add to Download Script**
   \`\`\`javascript
   const BIBLE_SOURCES = {
     newTranslation: {
       name: 'New Translation Name',
       urls: ['https://source-url.com/bible.json'],
       format: 'json'
     }
   }
   \`\`\`

3. **Update Translation List**
   \`\`\`typescript
   export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
     {
       id: 'newTranslation',
       name: 'New Translation Name',
       abbreviation: 'NTN',
       language: 'en',
       isPublicDomain: true
     }
   ]
   \`\`\`

## 🚨 Legal Considerations

### Public Domain Translations
✅ **Safe to Use**:
- King James Version (1769 and earlier)
- American Standard Version (1901)
- Young's Literal Translation (1898)
- Darby Translation (1890)
- World English Bible (dedicated to public domain)

❌ **Copyrighted** (require permission):
- NIV, ESV, NASB, NLT, CSB, etc.
- Most modern translations

### Copyright Guidelines
- Only use translations explicitly in public domain
- Check copyright status in your jurisdiction
- Consider fair use limitations for copyrighted works
- Provide proper attribution even for public domain works

## 🔧 Troubleshooting

### No Data Loading
1. Check if files exist in `public/data/bibles/`
2. Verify JSON format is valid
3. Check browser console for errors
4. Run download script again

### Search Not Working
1. Ensure database is initialized
2. Check translation ID matches available translations
3. Verify search query is not empty

### Performance Issues
1. Consider implementing database indexing
2. Add pagination for large result sets
3. Implement caching for frequently accessed chapters

## 🎯 Next Steps

1. **Add More Translations** - Find additional public domain sources
2. **Implement Caching** - Add Redis or local storage caching
3. **Add Concordance** - Build word frequency and cross-reference system
4. **Offline Support** - Cache data in service worker for PWA
5. **Advanced Search** - Add regex, phrase, and boolean search operators

## 📊 Database Statistics

After running the download script, you should see:
- **~31,000 verses** per complete translation
- **66 books** (39 OT + 27 NT)
- **~783 chapters** total
- **Multiple translations** available

Visit `/test-local-bible` to see real-time statistics and test functionality.
