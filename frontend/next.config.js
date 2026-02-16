/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production: daha küçük output
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5002',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
