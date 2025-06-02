// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["vercel-blob.com", "blob.v0.dev"],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.vercel-insights.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://vercel-blob.com https://blob.v0.dev https://*.stripe.com;
              font-src 'self';
              connect-src 'self' https://*.stripe.com https://api.elevenlabs.io https://api.openai.com https://*.vercel-insights.com https://vercel-blob.com https://blob.v0.dev;
              frame-src 'self' https://js.stripe.com https://*.stripe.com;
              frame-ancestors 'self';
              form-action 'self';
              base-uri 'self';
              object-src 'none';
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // In production, you might want to restrict this
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

module.exports = withPWA(nextConfig)
