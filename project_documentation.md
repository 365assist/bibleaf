# BibleAF - Project Documentation

## Project Overview

BibleAF is a comprehensive cross-platform Bible application that serves as an AI-powered spiritual companion. The app combines modern AI technology with timeless biblical wisdom to provide users with an enriching spiritual experience.

## Core Features

### AI-powered Bible Search
- Semantic understanding of user queries
- Relevant verse and passage recommendations
- Direct links to full Bible chapters with verse highlighting
- Usage tracking with freemium limits

### Life Guidance System
- Matches user situations to biblical stories and wisdom
- Provides contextual spiritual guidance
- Personalized recommendations based on user needs
- Thoughtful presentation of biblical wisdom

### Bible Reader
- Complete Bible text with chapter and verse navigation
- Verse highlighting and bookmarking
- Reading progress tracking
- Multiple translations support

### Personal Verse Collection
- Save verses with personal notes
- Tag-based organization
- Search and filter functionality
- Sync across devices

### Daily Verses
- Personalized verse recommendations
- Daily notifications
- Contextual spiritual insights
- Save to personal collection

### Theme Support
- Dark and light mode
- System preference detection
- Seamless theme switching
- Consistent styling across themes

## User System

### Authentication
- Complete signup and login flows
- Secure password handling
- Profile management
- Session persistence

### Subscription Management
- Freemium model (5 free searches/day)
- Three subscription tiers:
  - Basic ($4.99/month)
  - Premium ($9.99/month)
  - Annual ($49.99/year)
- Secure payment processing with Stripe
- Subscription management interface

## Technical Implementation

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Responsive design for all device sizes
- Client-side state management

### Backend
- Next.js API routes
- Vercel Blob storage for data persistence
- Deep Infra AI integration for intelligent search
- Stripe integration for payments
- Usage tracking and rate limiting

### PWA Capabilities
- Installable on devices
- Offline functionality
- Service worker for caching
- Push notifications for daily verses
- Offline/online state management

## Data Architecture

### User Data
- Authentication information
- Profile details
- Subscription status
- Usage metrics

### Content Storage
- Bible text and metadata
- User-saved verses
- Personal notes and tags
- Reading progress

### API Structure
- RESTful endpoints
- Proper error handling
- Rate limiting
- Data validation

## Deployment

The application is built for deployment on Vercel, with the following environment variables required:

- `NEXT_PUBLIC_APP_URL`: The public URL of the application
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Secret for Stripe webhook verification
- `DEEP_INFRA_API_KEY`: API key for Deep Infra AI services
- `BLOB_READ_WRITE_TOKEN`: Token for Vercel Blob storage

## Future Enhancements

1. Enhanced offline capabilities with full Bible text caching
2. Social sharing features for verses and insights
3. Study groups and community features
4. Advanced study tools like cross-references and commentaries
5. Additional Bible translations and languages

## Conclusion

BibleAF represents a modern approach to Bible study and spiritual growth, leveraging AI technology to make biblical wisdom more accessible and relevant to users' daily lives. The combination of intelligent search, personalized guidance, and thoughtful design creates a premium spiritual companion that grows with the user.
