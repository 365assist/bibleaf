# Stripe Setup Guide for BibleAF

## 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Switch to "Test mode" for development

## 2. Get API Keys

1. Go to Developers > API keys in your Stripe dashboard
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)
4. Add these to your `.env.local` file:
   \`\`\`
   STRIPE_SECRET_KEY=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
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RUrSKBiT317Uae5jhAJMMdai8imCBjOQ3VVo1XNZxzCEQdFLvdEy0yjr7txL6uOICCKipp9oLKJM98sxl9H7AMg007MMMyEPg
   \`\`\`

## 3. Create Products and Prices

### Basic Plan ($4.99/month)
1. Go to Products in your Stripe dashboard
2. Click "Add product"
3. Name: "BibleAF Basic"
4. Description: "Essential features for daily Bible study"
5. Add a price: $4.99 USD, Recurring monthly
6. Copy the Price ID (starts with `price_`) and update `STRIPE_PRODUCTS.basic.priceId` in `lib/stripe-server.ts`

### Premium Plan ($9.99/month)
1. Create another product: "BibleAF Premium"
2. Description: "Advanced features for deeper spiritual growth"
3. Add a price: $9.99 USD, Recurring monthly
4. Copy the Price ID and update `STRIPE_PRODUCTS.premium.priceId`

### Annual Plan ($99.99/year)
1. Create another product: "BibleAF Annual"
2. Description: "Best value with 2 months free"
3. Add a price: $99.99 USD, Recurring yearly
4. Copy the Price ID and update `STRIPE_PRODUCTS.annual.priceId`

## 4. Set Up Webhooks

1. Go to Developers > Webhooks in Stripe dashboard
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/payment/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add to your `.env.local`:
   \`\`\`
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   \`\`\`

## 5. Test the Integration

### Test Cards
Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Testing Flow
1. Start your development server
2. Go to the dashboard and try to upgrade a plan
3. Use a test card number
4. Verify the webhook receives events
5. Check that user subscription is updated

## 6. Production Setup

1. Switch to "Live mode" in Stripe dashboard
2. Get live API keys (start with `pk_live_` and `sk_live_`)
3. Update webhook endpoint to production URL
4. Update environment variables in production
5. Test with real payment methods

## 7. Security Notes

- Never expose secret keys in client-side code
- Always validate webhook signatures
- Use HTTPS in production
- Store sensitive data securely
- Regularly rotate API keys

## 8. Monitoring

- Set up Stripe dashboard alerts
- Monitor failed payments
- Track subscription metrics
- Set up error logging for webhook failures
