module.exports = {
	presets: [
		'next/babel',
		['@babel/preset-env', { targets: { node: 'current' } }],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: ['@babel/plugin-proposal-do-expressions'],
	overrides: [
		{
			test: /node_modules\/(wagmi|viem)/,
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							node: 'current',
						},
					},
				],
			],
		},
	],
};
