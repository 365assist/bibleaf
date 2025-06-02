# Environment Variables Setup Guide

## Required Environment Variables

Your `.env.local` file should be in the root directory of your project and contain:

### 1. Stripe Configuration
\`\`\`env
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
\`\`\`

**Where to get these:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_live_` for production or `sk_test_` for testing)
3. Copy your **Publishable key** (starts with `pk_live_` for production or `pk_test_` for testing)
4. For webhook secret, go to [Webhooks](https://dashboard.stripe.com/webhooks) and copy the signing secret

### 2. App Configuration
\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### 3. AI Services
\`\`\`env
DEEPINFRA_API_KEY=your_deepinfra_key
\`\`\`

**Where to get this:**
1. Go to [DeepInfra](https://deepinfra.com/)
2. Sign up and get your API key

### 4. Storage (Already configured)
\`\`\`env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
\`\`\`

## Checking Your Environment

Run this command to check if all variables are set:
\`\`\`bash
node scripts/check-env.js
\`\`\`

## Common Issues

1. **Missing .env.local file**: Create it in your project root
2. **Wrong key format**: Make sure keys start with the correct prefix
3. **Test vs Live keys**: Don't mix test and live keys
4. **Spaces in values**: Don't add spaces around the = sign

## Security Notes

- Never commit `.env.local` to git
- Use test keys for development
- Use live keys only for production
- Regenerate keys if they're compromised
