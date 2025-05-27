# BibleAF Architecture Design

## System Architecture Overview

BibleAF will follow a modern, scalable architecture based on Next.js 15 with TypeScript. The application will use a client-server model with server-side rendering (SSR) for improved performance and SEO, while leveraging client-side interactivity for a responsive user experience.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   PWA       │  │  React      │  │  Service Worker     │  │
│  │  Container  │  │  Components │  │  (Offline Support)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Server                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   API       │  │   Server    │  │     Static          │  │
│  │  Routes     │  │  Components │  │     Assets          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────┬───────────────────────────────────┬─────────────┘
            │                                   │
            ▼                                   ▼
┌───────────────────────┐           ┌───────────────────────┐
│   External Services   │           │   Data Storage        │
│                       │           │                       │
│  ┌─────────────────┐  │           │  ┌─────────────────┐  │
│  │  Deep Infra AI  │  │           │  │  Vercel Blob    │  │
│  └─────────────────┘  │           │  │  Storage        │  │
│                       │           │  └─────────────────┘  │
│  ┌─────────────────┐  │           │                       │
│  │  Payment        │  │           │  ┌─────────────────┐  │
│  │  Gateway        │  │           │  │  Authentication │  │
│  └─────────────────┘  │           │  │  Service        │  │
└───────────────────────┘           └───────────────────────┘
\`\`\`

## Technology Stack Selection

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API + SWR for data fetching
- **Icons**: Lucide Icons
- **Form Handling**: React Hook Form with Zod validation

### Backend (API Routes)
- **Runtime**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Data Storage**: Vercel Blob Storage
- **AI Integration**: Deep Infra AI API

### PWA Implementation
- **Service Worker**: Workbox
- **Manifest**: Web App Manifest
- **Offline Support**: Cache API + IndexedDB

### Payment Processing
- **Payment Gateway**: Stripe
- **Subscription Management**: Stripe Billing

## Component Architecture

The application will follow a modular component architecture with clear separation of concerns:

\`\`\`
src/
├── app/                    # App Router structure
│   ├── (auth)/             # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/        # Protected routes
│   │   ├── profile/
│   │   ├── search/
│   │   ├── guidance/
│   │   └── study/
│   ├── api/                # API routes
│   │   ├── auth/
│   │   ├── bible/
│   │   ├── ai/
│   │   ├── user/
│   │   └── payment/
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   ├── bible/              # Bible-specific components
│   ├── search/             # Search components
│   ├── guidance/           # Life guidance components
│   ├── auth/               # Authentication components
│   └── subscription/       # Subscription components
├── lib/                    # Utility functions and helpers
│   ├── ai/                 # AI integration utilities
│   ├── bible/              # Bible data utilities
│   ├── auth/               # Authentication utilities
│   ├── storage/            # Blob storage utilities
│   └── payment/            # Payment processing utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles
└── public/                 # Static assets
\`\`\`

## Data Models

### User Model
\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: {
    tier: 'free' | 'basic' | 'premium' | 'annual';
    startDate: Date;
    endDate: Date;
    status: 'active' | 'canceled' | 'expired';
    searchesUsedToday: number;
    lastSearchReset: Date;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    verseCategories: string[];
  };
}
\`\`\`

### Saved Verse Model
\`\`\`typescript
interface SavedVerse {
  id: string;
  userId: string;
  reference: string;  // e.g., "John 3:16"
  text: string;
  translation: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  tags: string[];
  isFavorite: boolean;
}
\`\`\`

### Reading Progress Model
\`\`\`typescript
interface ReadingProgress {
  userId: string;
  book: string;
  chapter: number;
  lastVerse: number;
  lastReadAt: Date;
  completedChapters: {
    [book: string]: number[];  // Array of completed chapter numbers
  };
}
\`\`\`

### Search History Model
\`\`\`typescript
interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  timestamp: Date;
  results: SearchResult[];
}

interface SearchResult {
  reference: string;
  text: string;
  relevanceScore: number;
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - User logout

### Bible
- `GET /api/bible/verse/:reference` - Get specific verse
- `GET /api/bible/chapter/:book/:chapter` - Get full chapter
- `GET /api/bible/daily` - Get daily verse

### AI Integration
- `POST /api/ai/search` - Semantic Bible search
- `POST /api/ai/guidance` - Life guidance recommendations

### User Data
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/verses` - Get saved verses
- `POST /api/user/verses` - Save new verse
- `PUT /api/user/verses/:id` - Update saved verse
- `DELETE /api/user/verses/:id` - Delete saved verse
- `GET /api/user/progress` - Get reading progress
- `PUT /api/user/progress` - Update reading progress

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/create` - Create new subscription
- `PUT /api/subscription/update` - Update subscription
- `DELETE /api/subscription/cancel` - Cancel subscription

## Storage Strategy

### Vercel Blob Storage Organization
\`\`\`
/users/{userId}/
  ├── profile.json           # User profile data
  ├── preferences.json       # User preferences
  ├── subscription.json      # Subscription details
  ├── verses/                # Saved verses
  │   ├── {verseId}.json     # Individual verse data
  │   └── index.json         # Verse index for quick access
  ├── progress/              # Reading progress
  │   ├── {book}.json        # Progress by book
  │   └── summary.json       # Overall progress summary
  └── history/               # Search history
      └── {searchId}.json    # Individual search records
\`\`\`

### Caching Strategy
- **Bible Text**: Cached in local storage for offline access
- **User Data**: Cached with SWR for fast access with background revalidation
- **Search Results**: Cached temporarily to reduce API calls
- **Daily Verses**: Pre-cached for offline availability

## Authentication Flow

1. User registers or logs in
2. NextAuth.js creates a session
3. Session token stored in HTTP-only cookie
4. API routes validate session token
5. Protected routes check authentication status

## Subscription and Payment Flow

1. User selects subscription tier
2. Stripe Checkout session created
3. User redirected to Stripe Checkout
4. After payment, user redirected back with session ID
5. Backend verifies payment and activates subscription
6. User subscription status updated

## AI Integration Architecture

### Deep Infra AI Integration
\`\`\`
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  User Query   │────▶│  Query        │────▶│  Deep Infra   │
│               │     │  Processor    │     │  AI API       │
└───────────────┘     └───────────────┘     └───────┬───────┘
                                                    │
┌───────────────┐     ┌───────────────┐     ┌───────▼───────┐
│  Response     │◀────│  Result       │◀────│  AI Response  │
│  Formatter    │     │  Processor    │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
\`\`\`

### Bible Search Process
1. User enters natural language query
2. Query processed and sent to Deep Infra AI
3. AI returns relevant Bible passages
4. Results ranked by relevance
5. Results displayed with direct links to passages

### Life Guidance Process
1. User describes situation or question
2. Query processed and contextualized
3. Deep Infra AI matches situation to biblical wisdom
4. Results include relevant passages and explanations
5. User can save guidance for future reference

## PWA Implementation

### Service Worker Strategy
- **Precaching**: Core app shell and frequently accessed resources
- **Runtime Caching**: Bible text, images, and API responses
- **Background Sync**: For offline actions (saving verses, notes)
- **Periodic Sync**: For daily verse updates

### Offline Capabilities
- Full Bible reading
- Viewing saved verses and notes
- Limited search functionality using cached results
- Daily verse display

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component-level code splitting for large features
- Dynamic imports for non-critical functionality

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format with fallbacks
- Responsive sizes based on viewport

### Data Fetching
- SWR for efficient data fetching and caching
- Incremental Static Regeneration for semi-static content
- Pagination for large data sets

## Security Considerations

### Authentication Security
- HTTP-only cookies for session storage
- CSRF protection
- Rate limiting for authentication attempts
- Secure password hashing

### Data Protection
- Input validation and sanitization
- Content Security Policy
- XSS protection
- HTTPS enforcement

### Payment Security
- PCI compliance via Stripe
- Tokenization of payment details
- Secure webhook handling

## Accessibility Implementation

- ARIA attributes for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Responsive Design Strategy

- Mobile-first approach
- Fluid typography and spacing
- Adaptive layouts based on viewport
- Touch-friendly interaction targets
- Device-specific optimizations

## Error Handling and Resilience

### Client-side Error Handling
- Error boundaries for component failures
- Graceful degradation of features
- User-friendly error messages
- Automatic retry for transient failures

### Server-side Error Handling
- Structured error responses
- Logging and monitoring
- Fallback mechanisms
- Rate limiting and circuit breaking

## Deployment Strategy

- Vercel deployment for Next.js
- Environment-based configuration
- Continuous integration and deployment
- Preview deployments for testing

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Utility function testing with Jest
- Type checking with TypeScript

### Integration Testing
- API route testing
- Authentication flow testing
- Payment process testing

### End-to-End Testing
- Critical user journeys
- Cross-browser compatibility
- Mobile device testing

## Monitoring and Analytics

- Performance monitoring
- Error tracking
- User behavior analytics
- Subscription metrics

This architecture design provides a comprehensive blueprint for implementing the BibleAF application, ensuring all requirements are met while following best practices for modern web application development.
