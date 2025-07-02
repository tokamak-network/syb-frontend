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
			},
		];
	},
	async rewrites() {
		const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
		console.log('apiHost', apiHost);

		return [
			{
				source: '/sequencer/:path*',
				destination: `${apiHost}/api/v1/:path*`,
			},
		];
	},
	experimental: {
		forceSwcTransforms: true,
	},
};

module.exports = nextConfig;
