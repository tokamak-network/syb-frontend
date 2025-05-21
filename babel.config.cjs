module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{ targets: { node: 'current' }, modules: 'commonjs' },
		],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: [],
	overrides: [
		{
			test: /node_modules\/(wagmi|viem|@wagmi|@tanstack\/react-query)/,
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							node: 'current',
						},
						modules: 'commonjs',
					},
				],
			],
		},
	],
};
