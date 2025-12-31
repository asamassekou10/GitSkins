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
    ],
  },
  // Explicitly use src directory to avoid conflicts with old app/ directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

module.exports = nextConfig
