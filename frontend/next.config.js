/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production: daha küçük output
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5002',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'nezainsaat.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nezainsaat.com',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
