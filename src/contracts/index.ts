import { ABIS } from './abis';

export const SYBIL_SEPOLIA_CONTRACT_ADDRESS =
	process.env.NEXT_PUBLIC_SYBIL_SEPOLIA_CONTRACT_ADDRESS || '';

export const VERIFIER_SEPOLIA_CONTRACT_ADDRESS =
	process.env.NEXT_PUBLIC_VERIFIER_SEPOLIA_CONTRACT_ADDRESS || '';

export const contracts = {
	sybilSepolia: {
		address: SYBIL_SEPOLIA_CONTRACT_ADDRESS,
		abi: ABIS.SybilSepoliaABI,
	},
	verifierSepolia: {
		address: VERIFIER_SEPOLIA_CONTRACT_ADDRESS,
		abi: ABIS.VerifierSepoliaABI,
	},
} as const;

export * from './abis/SybilSepoliaABI';
export * from './abis/VerifierSepoliaABI';
