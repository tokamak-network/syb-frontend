import { useWriteContract } from 'wagmi';

import { SepoliaABI, contracts } from '@/contracts';
import { formatEthAddress, convertToUint40Format } from '@/utils';

export const useSepoliaTransactions = () => {
	const { writeContractAsync } = useWriteContract();

	const handleCreateAccount = async (amount: string) => {
		try {
			const loadAmountF = convertToUint40Format(amount);
			const a = loadAmountF & BigInt(0x7ffffffff);
			const b = loadAmountF >> BigInt(35);
			const amountValue = BigInt(10) ** b * a;

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sepolia.address),
				abi: SepoliaABI,
				functionName: 'createAccountDeposit',
				args: [Number(loadAmountF)],
				value: amountValue,
			});

			return hash;
		} catch (error) {
			console.error('Error creating account:', error);
			throw error;
		}
	};

	const handleDeposit = async (fromIdx: number, amount: string) => {
		try {
			if (fromIdx <= 255) {
				throw new Error('Invalid fromIdx: must be greater than 255');
			}

			const loadAmountF = convertToUint40Format(amount);
			const a = loadAmountF & BigInt(0x7ffffffff);
			const b = loadAmountF >> BigInt(35);
			const amountValue = BigInt(10) ** b * a;

			const fromIdxUint48 = BigInt(fromIdx);

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sepolia.address),
				abi: SepoliaABI,
				functionName: 'deposit',
				args: [Number(fromIdxUint48), Number(loadAmountF)],
				value: amountValue,
			});

			return hash;
		} catch (error) {
			console.error('Error depositing:', error);
			throw error;
		}
	};

	// const handleVouch = async (fromIdx: number, toIdx: number) => {
	// 	try {
	// 		if (fromIdx <= 255) {
	// 			throw new Error('Invalid fromIdx: must be greater than 255');
	// 		}
	// 		if (toIdx <= 255) {
	// 			throw new Error('Invalid toIdx: must be greater than 255');
	// 		}

	// 		const fromIdxBigInt = BigInt(fromIdx);
	// 		const toIdxBigInt = BigInt(toIdx);

	// 		const hash = await writeContractAsync({
	// 			address: formatEthAddress(contracts.sepolia.address),
	// 			abi: SepoliaABI,
	// 			functionName: 'vouch',
	// 			args: [fromIdxBigInt, toIdxBigInt],
	// 		});
	// 		return hash;
	// 	} catch (error) {
	// 		console.error('Error vouching:', error);
	// 		throw error;
	// 	}
	// };

	// const handleUnvouch = async (to: string) => {
	//   try {
	//     // Convert to uint48 as required by the contract
	//     const fromIdx = BigInt(0); // This should be the user's index
	//     const toIdx = BigInt(to); // Convert address to index

	//     const hash = await writeContractAsync({
	//       address: CONTRACT_ADDRESS,
	//       abi: SepoliaABI,
	//       functionName: 'unvouch',
	//       args: [fromIdx, toIdx]
	//     });
	//     return hash;
	//   } catch (error) {
	//     console.error('Error unvouching:', error);
	//     throw error;
	//   }
	// };

	// const handleExit = async () => {
	//   try {
	//     // Convert to uint48 and uint40 as required by the contract
	//     const fromIdx = BigInt(0); // This should be the user's index
	//     const amountF = BigInt(0); // Amount to exit

	//     const hash = await writeContractAsync({
	//       address: CONTRACT_ADDRESS,
	//       abi: SepoliaABI,
	//       functionName: 'exit',
	//       args: [fromIdx, amountF]
	//     });
	//     return hash;
	//   } catch (error) {
	//     console.error('Error exiting:', error);
	//     throw error;
	//   }
	// };

	// const handleExplode = async (to: string) => {
	//   try {
	//     // Convert to uint48 and array of uint48 as required by the contract
	//     const fromIdx = BigInt(0); // This should be the user's index
	//     const toIdxs = [BigInt(to)]; // Array of recipient indices

	//     const hash = await writeContractAsync({
	//       address: CONTRACT_ADDRESS,
	//       abi: SepoliaABI,
	//       functionName: 'explodeMultiple',
	//       args: [fromIdx, toIdxs]
	//     });
	//     return hash;
	//   } catch (error) {
	//     console.error('Error exploding:', error);
	//     throw error;
	//   }
	// };

	return {
		handleCreateAccount,
		handleDeposit,
		// handleVouch,
		// handleUnvouch,
		// handleExit,
		// handleExplode,
	};
};
