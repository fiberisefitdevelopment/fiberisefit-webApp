/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // So preview tunnels (Cloudflare) can load /_next assets from the public URL
  allowedDevOrigins: ['*.trycloudflare.com'],
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
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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

