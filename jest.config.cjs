module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.(t|j)sx?$': 'babel-jest',
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transformIgnorePatterns: [
		// This is critical - make all node_modules transform except specific ones that aren't ESM
		'/node_modules/(?!(wagmi|@wagmi|viem|@tanstack/react-query)/)',
	],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
