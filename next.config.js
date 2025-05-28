/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gateway.pinata.cloud'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost';
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || '8080';

    return [
      {
        source: '/sequencer/:path*',
        destination: `${apiHost}:${apiPort}/api/v1/:path*`,
      },
    ];
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;