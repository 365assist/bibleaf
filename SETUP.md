# BibleAF Setup Guide

## Environment Variables

1. Copy `.env.example` to `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in your API keys:

### Deep Infra AI (Required)
- Sign up at https://deepinfra.com
- Get your API key from the dashboard
- Add to `DEEPINFRA_API_KEY`

### Vercel Blob Storage (Required)
- Already configured in your Vercel project
- Token should be available in your Vercel dashboard

### Stripe (Optional - for payments)
- Sign up at https://stripe.com
- Get your test keys from the dashboard
- Create products and prices in Stripe dashboard
- Update the `stripePriceId` values in `lib/stripe-config.ts`

## Testing the App

### 1. Test AI Features
- Go to `/dashboard`
- Try Bible search with queries like:
  - "verses about overcoming fear"
  - "what does the Bible say about forgiveness?"
- Test life guidance with situations like:
  - "I'm struggling with anxiety"
  - "I need wisdom for a difficult decision"

### 2. Test Verse Management
- Save verses from search results
- Go to "My Verses" tab
- Add notes and tags
- Test search and filtering

### 3. Test Subscription Flow
- Click "Upgrade Plan" in profile
- Try the demo payment flow
- Check usage limits

## Deployment

1. Push to your Vercel project
2. Add environment variables in Vercel dashboard
3. Deploy and test

## Troubleshooting

- If AI features don't work, check `DEEPINFRA_API_KEY`
- If blob storage fails, check `BLOB_READ_WRITE_TOKEN`
- Check browser console for detailed error messages
- All features have fallback modes for testing
