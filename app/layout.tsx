import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "BibleAF – AI-Powered Bible Study for Modern Believers",
  description:
    "BibleAF is an AI-powered Bible study tool offering smart verse search, daily devotionals, and spiritual guidance. Experience Scripture in a new way.",
  manifest: "/manifest.json",
  themeColor: "#e9b949",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  applicationName: "BibleAF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BibleAF",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "BibleAF",
    title: "BibleAF – AI-Powered Bible Study for Modern Believers",
    description:
      "BibleAF is an AI-powered Bible study tool offering smart verse search, daily devotionals, and spiritual guidance. Experience Scripture in a new way.",
    url: "https://bibleaf.ai",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "BibleAF - AI-Powered Bible Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BibleAF – AI-Powered Bible Study for Modern Believers",
    description: "Experience Scripture with AI-powered insights, daily verses, and spiritual guidance.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: ["/favicon.ico"],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-192x192.png", sizes: "152x152" },
      { url: "/icons/icon-192x192.png", sizes: "180x180" },
      { url: "/icons/icon-192x192.png", sizes: "167x167" },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta tags for security */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} divine-light-bg`}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="divine-light-overlay min-h-screen">
            <main id="main-content">{children}</main>
            <OfflineIndicator />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
