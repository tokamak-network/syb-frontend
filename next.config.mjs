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
        source: '/api/:path*',
        destination: 'http://sybmvp-seque-5dzhksrodmke-466448758.us-east-2.elb.amazonaws.com:5000/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
