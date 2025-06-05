import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Crimson_Text } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StructuredDataService } from "@/lib/structured-data"
import Script from "next/script"

// Optimized font loading with preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-sans",
})

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-serif",
})

// Enhanced metadata with better SEO
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bibleaf.ai"),
  title: "BibleAF - AI-Powered Bible Study",
  description: "Explore the Bible with AI-powered insights, search, and guidance",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BibleAF",
  },
  keywords: [
    "Bible study",
    "AI Bible",
    "spiritual guidance",
    "daily devotionals",
    "Christian app",
    "biblical insights",
    "scripture search",
    "faith journey",
    "pastoral care",
    "Bible verses",
    "cross-references",
    "biblical commentary",
    "Christian devotional",
    "spiritual growth",
    "Bible reading",
    "theology",
  ],
  authors: [{ name: "BibleAF Team", url: "https://bibleaf.ai/about" }],
  creator: "BibleAF",
  publisher: "BibleAF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Religion",
  classification: "Christian Bible Study Application",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BibleAF",
    title: "BibleAF - AI-Powered Bible Study & Spiritual Guidance",
    description:
      "Experience Scripture with AI-powered insights, daily devotionals, and pastoral support for deeper spiritual growth.",
    images: [
      {
        url: "/images/divine-light-background.png",
        width: 1200,
        height: 630,
        alt: "BibleAF - AI-Powered Bible Study Platform",
        type: "image/png",
      },
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "BibleAF Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bibleaf",
    creator: "@bibleaf",
    title: "BibleAF - AI-Powered Bible Study",
    description: "Experience Scripture with AI-powered insights and spiritual guidance",
    images: [
      {
        url: "/images/divine-light-background.png",
        alt: "BibleAF - AI-Powered Bible Study",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      en: "/en",
    },
  },
  applicationName: "BibleAF",
  referrer: "origin-when-cross-origin",
  bookmarks: "/dashboard",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "BibleAF",
    "application-name": "BibleAF",
    "msapplication-TileColor": "#f59e0b",
    "msapplication-tap-highlight": "no",
    "theme-color": "#f59e0b",
  },
    generator: 'v0.dev'
}

// Enhanced viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#d97706" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for the website
  const websiteStructuredData = StructuredDataService.generateWebsiteStructuredData()
  const organizationStructuredData = StructuredDataService.generateOrganizationStructuredData()
  const appStructuredData = StructuredDataService.generateSoftwareApplicationStructuredData()

  const structuredDataArray = [websiteStructuredData, organizationStructuredData, appStructuredData]

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${crimsonText.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//api.openai.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />

        {/* Enhanced PWA configuration */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* Additional Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BibleAF" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Microsoft-specific meta tags */}
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-TileImage" content="/icons/icon-192x192.png" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-navbutton-color" content="#f59e0b" />
        <meta name="msapplication-starturl" content="/" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />

        {/* Performance hints */}
        <link rel="preload" href="/images/divine-light-background.png" as="image" />
        <link rel="prefetch" href="/api/bible/stats" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataArray),
          }}
        />

        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw-enhanced.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="bibleaf-theme"
        >
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          >
            Skip to main content
          </a>

          {/* Offline indicator */}
          <div
            id="offline-indicator"
            className="hidden fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-medium z-50"
          >
            You're currently offline. Some features may be limited.
          </div>

          <main id="main-content">{children}</main>

          {/* Online/offline detection script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function updateOnlineStatus() {
                  const indicator = document.getElementById('offline-indicator');
                  if (navigator.onLine) {
                    indicator?.classList.add('hidden');
                  } else {
                    indicator?.classList.remove('hidden');
                  }
                }
                
                window.addEventListener('online', updateOnlineStatus);
                window.addEventListener('offline', updateOnlineStatus);
                updateOnlineStatus();
              `,
            }}
          />
        </ThemeProvider>
        {/* Service Worker Registration Script */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
