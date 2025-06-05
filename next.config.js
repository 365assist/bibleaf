/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    domains: ["placeholder.svg"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Enhanced image optimization
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  // Improved webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
      }
    }
    return config
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Improved compression for faster page loads
  compress: true,
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  // Improved SWC minification
  swcMinify: true,
}

module.exports = nextConfig
