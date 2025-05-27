import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BibleAF - AI-Powered Spiritual Companion",
  description: "Your personal AI-powered Bible companion for spiritual guidance and study",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
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
    title: "BibleAF - AI-Powered Spiritual Companion",
    description: "Your personal AI-powered Bible companion for spiritual guidance and study",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-192x192.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "167x167", type: "image/png" },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="application-name" content="BibleAF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BibleAF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <div id="offline-indicator"></div>
        </ThemeProvider>
      </body>
    </html>
  )
}
