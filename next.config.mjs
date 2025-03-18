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
    return [
      {
        source: '/sequencer/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
