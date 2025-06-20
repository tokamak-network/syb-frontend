import { useWriteContract } from 'wagmi';

import { SybilSepoliaABI, contracts } from '@/contracts';
import { formatFullEthAddress, validateAddress } from '@/utils';

export const useScoreUpdate = () => {
	const { writeContractAsync } = useWriteContract();

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

	return {
		handleUpdateScore,
	};
};
