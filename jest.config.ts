import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    // Transpile these modules that use ESM syntax
    'node_modules/(?!(@wagmi|@tanstack/react-query|viem)/)',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
    '^.+\\.mjs$': 'jest-esm-transformer',
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      isolatedModules: true, // Optimize TypeScript parsing
    },
  },
};

export default createJestConfig(config);
