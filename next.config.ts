// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ardi.kg',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api.ardi.kg',
        pathname: '/**',
      },
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
  output: 'standalone',
}

module.exports = nextConfig