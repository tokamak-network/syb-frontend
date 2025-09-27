import { useWriteContract, useReadContract } from 'wagmi';
import { useState } from 'react';

import { SybilSepoliaABI, contracts } from '@/contracts';
import { formatFullEthAddress, validateAddress } from '@/utils';
import { fetchScoreMerkleProof } from '@/utils/fetch';

export const useScoreUpdate = (userAddress?: string) => {
	const { writeContractAsync } = useWriteContract();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Read account info from smart contract
	const { data: accountInfo } = useReadContract({
		address: userAddress
			? formatFullEthAddress(contracts.sybilSepolia.address)
			: undefined,
		abi: SybilSepoliaABI,
		functionName: 'accountInfo',
		args: userAddress ? [userAddress as `0x${string}`] : undefined,
	});

	/**
	 * Updates the score for an account by calling the updateScore function
	 * This function interacts with the smart contract at 0xc7182D2D38ACE7Dd9a0c20C0C3b2C108d90979Ce
	 *
	 * @param userAddress - The address of the user whose score to update
	 * @param score - The new score value (uint32)
	 */
	const handleUpdateScore = async (userAddress: string, score: number) => {
		try {
			const validatedAddress = validateAddress(userAddress);

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'updateScore',
				args: [validatedAddress, score],
			});

			return hash;
		} catch (error: any) {
			console.error('Error updating score:', error);
			throw error;
		}
	};

	/**
	 * Proves a user's score using Merkle proof verification
	 * This function calls the proveScoreMerkleProof function on the smart contract
	 *
	 * @param batchNumber - The batch number containing the score root
	 */
	const proveScore = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!userAddress || !accountInfo) {
				throw new Error('User address or account info not available');
			}

			// Step 1: Get user's account index from the hook data
			const accountIndex = parseInt(accountInfo[1].toString()); // accountInfo[1] is the idx

			// Step 2: Get Merkle proof from backend
			const proof = await fetchScoreMerkleProof(accountIndex);

			// Step 3: Call smart contract to prove score
			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'proveScoreMerkleProof',
				args: [
					parseInt(proof.num_score_root), // numScoreRoot
					parseInt(proof.idx), // idx
					parseInt(proof.score), // score
					proof.siblings.map((s) => BigInt(s)), // Convert string array to BigInt array
				],
			});

			return hash;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Unknown error occurred';

			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleUpdateScore,
		proveScore,
		isLoading,
		error,
	};
};
