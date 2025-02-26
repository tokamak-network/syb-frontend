import { SepoliaABI } from './abis/SepoliaABI';

export const SEPOLIA_CONTRACT_ADDRESS =
	process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || '';

export const contracts = {
	sepolia: {
		address: SEPOLIA_CONTRACT_ADDRESS,
		abi: SepoliaABI,
	},
} as const;

export * from './abis/SepoliaABI';
