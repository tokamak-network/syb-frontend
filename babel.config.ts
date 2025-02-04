module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: [],
	// Include specific node_modules packages for transformation
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
