import { useWriteContract, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { SepoliaABI, contracts } from '@/contracts';
import { formatEthAddress, convertToUint40Format, float2Fix } from '@/utils';

export const useSepoliaTransactions = () => {
	const { writeContractAsync } = useWriteContract();

	const handleCreateAccount = async (amount: string) => {
		try {
			const loadAmountF = convertToUint40Format(amount);
			const tstVal = BigInt(parseFloat(amount) * 1e18);
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

	const handleDeposit = async (to: string, amount: string) => {
		try {
			const fromIdx = 0;
			const loadAmountF = Number(convertToUint40Format(amount));
			const value = parseEther(amount);

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sepolia.address),
				abi: SepoliaABI,
				functionName: 'deposit',
				args: [fromIdx, loadAmountF],
				value: value,
			});
			return hash;
		} catch (error) {
			console.error('Error depositing:', error);
			throw error;
		}
	};

	// const handleVouch = async (to: string) => {
	//   try {
	//     const fromIdx = BigInt(0);
	//     const toIdx = BigInt(to);

	//     const hash = await writeContractAsync({
	//       address: CONTRACT_ADDRESS,
	//       abi: SepoliaABI,
	//       functionName: 'vouch',
	//       args: [fromIdx, toIdx]
	//     });
	//     return hash;
	//   } catch (error) {
	//     console.error('Error vouching:', error);
	//     throw error;
	//   }
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
