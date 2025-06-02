import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BibleAF - AI-Powered Bible Study",
  description: "Experience the Bible like never before with AI-powered insights, daily verses, and life guidance.",
  manifest: "/manifest.json",
  themeColor: "#000000",
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
    title: "BibleAF - AI-Powered Bible Study",
    description: "Experience the Bible like never before with AI-powered insights, daily verses, and life guidance.",
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
  generator: "v0.dev",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="divine-light-overlay min-h-screen">
            {children}
            <OfflineIndicator />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
