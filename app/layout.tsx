import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { OfflineIndicator } from "@/components/offline-indicator"
import { StickyNavigation } from "@/components/sticky-navigation"
import { StructuredData } from "@/components/structured-data"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "BibleAF – AI-Powered Bible Study for Modern Believers",
  description:
    "Experience Scripture with AI-powered insights, daily devotionals, and spiritual guidance. Join thousands discovering deeper meaning in God's Word through intelligent Bible study tools.",
  manifest: "/manifest.json",
  themeColor: "#8b5a3c",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  applicationName: "BibleAF",
  keywords: [
    "Bible study",
    "AI Bible",
    "Scripture search",
    "daily devotional",
    "Christian app",
    "Bible verses",
    "spiritual guidance",
    "biblical wisdom",
    "Bible commentary",
    "verse of the day",
    "Christian AI",
    "Bible AI",
  ],
  authors: [{ name: "BibleAF Team" }],
  creator: "BibleAF",
  publisher: "BibleAF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BibleAF",
    startupImage: "/icons/icon-512x512.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "BibleAF",
    title: "BibleAF – AI-Powered Bible Study for Modern Believers",
    description:
      "Experience Scripture with AI-powered insights, daily devotionals, and spiritual guidance. Join thousands discovering deeper meaning in God's Word.",
    url: "https://bibleaf.ai",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "BibleAF - AI-Powered Bible Study Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BibleAF",
    creator: "@BibleAF",
    title: "BibleAF – AI-Powered Bible Study for Modern Believers",
    description: "Experience Scripture with AI-powered insights, daily verses, and spiritual guidance.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
      { url: "/icons/icon-384x384.png", sizes: "384x384" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" },
    ],
  },
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bibleaf.ai",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />

        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Structured Data */}
        <StructuredData />

        {/* Service Worker Registration - Deferred */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registration successful');
                    },
                    function(err) {
                      console.log('SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} refined-bg`}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-warm-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-warm-500"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="refined-overlay min-h-screen">
            <StickyNavigation />
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
            <OfflineIndicator />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
