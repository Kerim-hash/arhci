// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['84.46.243.175'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '84.46.243.175',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  // Важно для App Router
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig