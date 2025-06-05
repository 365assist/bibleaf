# BibleAF Deployment Checklist

## ✅ Pre-Deployment Verification

### 🔐 Environment Variables
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key  
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `NEXT_PUBLIC_APP_URL` - Production app URL
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI features
- [ ] `ELEVENLABS_API_KEY` - ElevenLabs for text-to-speech
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

### 💳 Stripe Configuration
- [ ] Stripe account in live mode
- [ ] Products created in Stripe dashboard:
  - Basic Plan: $4.99/month
  - Premium Plan: $9.99/month  
  - Annual Plan: $99.99/year
- [ ] Webhook endpoint configured: `{domain}/api/payment/webhook`
- [ ] Webhook events enabled:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Price IDs updated in `lib/stripe-config.ts`

### 🎨 UI/UX Verification
- [ ] All pages load without errors
- [ ] Dark/light mode toggle works
- [ ] Mobile responsiveness verified
- [ ] Divine theme consistent across all pages
- [ ] Loading states work properly
- [ ] Error messages are user-friendly

### 🔍 Feature Testing
- [ ] User authentication (login/signup)
- [ ] AI Bible search functionality
- [ ] Life guidance feature
- [ ] Daily verse display
- [ ] Text-to-speech works
- [ ] Verse saving/management
- [ ] Cross-reference explorer
- [ ] Context viewer
- [ ] Commentary notes

### 📱 Cross-Platform Testing
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Android Chrome)
- [ ] Tablet responsiveness
- [ ] PWA functionality

### 🚀 Performance Optimization
- [ ] Images optimized and compressed
- [ ] Bundle size analyzed
- [ ] Core Web Vitals acceptable
- [ ] API response times under 2s
- [ ] Caching strategies implemented

### 🔒 Security Checklist
- [ ] API routes protected
- [ ] User input sanitized
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive data

## 🌐 Deployment Steps

### 1. Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add OPENAI_API_KEY
vercel env add ELEVENLABS_API_KEY
vercel env add BLOB_READ_WRITE_TOKEN
\`\`\`

### 2. Domain Configuration
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS records pointing to Vercel

### 3. Stripe Webhook Setup
- [ ] Webhook URL: `https://yourdomain.com/api/payment/webhook`
- [ ] Webhook secret added to environment variables
- [ ] Test webhook delivery

### 4. Post-Deployment Testing
- [ ] All features work in production
- [ ] Payment flow end-to-end test
- [ ] Error monitoring setup
- [ ] Analytics configured

## 🐛 Common Issues & Solutions

### Stripe Issues
- **Price ID not found**: Update price IDs in `lib/stripe-config.ts`
- **Webhook failures**: Check webhook secret and endpoint URL
- **Test vs Live mode**: Ensure all keys are for the same mode

### API Issues
- **CORS errors**: Check API route configurations
- **Timeout errors**: Implement proper error handling and fallbacks
- **Rate limiting**: Configure appropriate limits

### UI Issues
- **Hydration errors**: Check for client/server rendering mismatches
- **Theme issues**: Verify CSS variables and dark mode implementation
- **Mobile layout**: Test on actual devices

## 📊 Monitoring & Analytics

### Error Tracking
- [ ] Sentry or similar error tracking configured
- [ ] API error logging implemented
- [ ] User feedback collection

### Performance Monitoring
- [ ] Core Web Vitals tracking
- [ ] API response time monitoring
- [ ] User engagement metrics

### Business Metrics
- [ ] Conversion tracking
- [ ] Subscription analytics
- [ ] Feature usage statistics

## 🔄 Post-Launch Tasks

### Week 1
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Gather user feedback
- [ ] Performance optimization

### Month 1
- [ ] Feature usage analysis
- [ ] User retention metrics
- [ ] A/B testing setup
- [ ] Content updates

## 📞 Support & Maintenance

### Documentation
- [ ] User guide created
- [ ] FAQ section populated
- [ ] API documentation updated
- [ ] Troubleshooting guide

### Support Channels
- [ ] Help desk setup
- [ ] Email support configured
- [ ] Community forum (optional)
- [ ] Social media presence

---

## 🎯 Success Criteria

- [ ] 99.9% uptime
- [ ] < 2s page load times
- [ ] < 1% error rate
- [ ] Positive user feedback
- [ ] Successful payment processing
\`\`\`

Now let me fix any remaining issues in the codebase:
