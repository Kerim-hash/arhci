// next.config.js
/** @type {import('next').NextConfig} */

// Адрес бэкенда задаётся только через NEXT_PUBLIC_SERVER_URL (см. lib/api.ts).
// Хост картинок должен следовать за ним, иначе next/image заблокирует медиа,
// когда API переезжает на другой домен.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

if (!serverUrl) {
  throw new Error(
    'NEXT_PUBLIC_SERVER_URL не задан. Укажите адрес API в .env.local для локальной ' +
      'разработки или передайте build-arg NEXT_PUBLIC_SERVER_URL при сборке образа.'
  )
}

const apiOrigin = new URL(serverUrl)

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Хост из NEXT_PUBLIC_SERVER_URL — основной источник медиа.
      {
        protocol: apiOrigin.protocol.replace(':', ''),
        hostname: apiOrigin.hostname,
        ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
        pathname: '/**',
      },
      // Дополнительные хосты, с которых исторически приходят картинки.
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
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
