const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A package-lock.json in the home directory makes Next treat ~ as the
  // workspace. Turbopack then watches that whole tree and starts a Node
  // process per CSS file, which freezes an 8GB machine. Pin the root here.
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // This Mac has 8 cores. Default worker count is cores-1, which plus
    // Turbopack/Webpack children exhausts RAM. Keep dev/build to 2 workers.
    cpus: 2,
    webpackMemoryOptimizations: true,
    // 1GB cap if someone runs `npm run dev:turbo`.
    turbopackMemoryLimit: 1024 * 1024 * 1024,
  },
  devIndicators: false,
  // So preview tunnels and this LAN can load /_next assets
  allowedDevOrigins: ['*.trycloudflare.com', '192.168.1.45', '192.168.1.75'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    const staticCache =
      process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/_next/static/(.*)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]
        : []
    return [
      ...staticCache,
      {
        source: '/manual/lyte.pdf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/lyte user manual',
        // Redirect to the LYTE user manual download URL
        destination: '/manual/lyte.pdf',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

