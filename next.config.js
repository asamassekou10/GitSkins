/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
  },
  // Explicitly use src directory to avoid conflicts with old app/ directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Enable static page generation where possible
  output: 'standalone',
}

module.exports = nextConfig
