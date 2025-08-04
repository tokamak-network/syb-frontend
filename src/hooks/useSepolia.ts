import { useWriteContract } from 'wagmi';

import { SybilSepoliaABI, contracts } from '@/contracts';
import {
	formatFullEthAddress,
	convertToUint40Format,
	validateAddress,
} from '@/utils';

export const useSepoliaTransactions = () => {
	const { writeContractAsync } = useWriteContract();

	const handleDeposit = async (amount: string) => {
		try {
			// Parse the amount as ETH value
			const loadAmountF = convertToUint40Format(amount);
			const a = loadAmountF & BigInt(0x7ffffffff);
			const b = loadAmountF >> BigInt(35);
			const amountValue = BigInt(10) ** b * a;

			// Check that amount doesn't exceed the limit according to the contract
			const LIMIT_AMOUNT = BigInt(2) ** BigInt(128);

			if (amountValue >= LIMIT_AMOUNT) {
				throw new Error('Amount exceeds the maximum limit');
			}

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'deposit',
				value: amountValue,
			});

			return hash;
		} catch (error: any) {
			// Handle contract-specific errors
			if (error.message && error.message.includes('InsufficientETH')) {
				throw new Error('Amount is below the minimum balance requirement');
			}
			if (error.message && error.message.includes('LimitAmountExceeded')) {
				throw new Error('Amount exceeds the maximum limit');
			}

			console.error('Error depositing:', error);
			throw error;
		}
	};

	const handleVouch = async (toEthAddr: string) => {
		try {
			const validatedAddress = validateAddress(toEthAddr);

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'vouch',
				args: [validatedAddress],
			});

			return hash;
		} catch (error: any) {
			// Handle contract-specific errors
			if (error.message && error.message.includes('SenderHasZeroBalance')) {
				throw new Error('Your account has zero balance, deposit first');
			}
			if (error.message && error.message.includes('ReceiverHasZeroBalance')) {
				throw new Error('Recipient has zero balance');
			}

			console.error('Error vouching:', error);
			throw error;
		}
	};

	const handleUnvouch = async (toEthAddr: string) => {
		try {
			const validatedAddress = validateAddress(toEthAddr);

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'unvouch',
				args: [validatedAddress],
			});

			return hash;
		} catch (error: any) {
			// Handle contract-specific errors
			if (error.message && error.message.includes('NotVouched')) {
				throw new Error('You have not vouched for this address');
			}

			console.error('Error unvouching:', error);
			throw error;
		}
	};

	const handleWithdraw = async (amount: string) => {
		try {
			const loadAmountF = convertToUint40Format(amount);
			const a = loadAmountF & BigInt(0x7ffffffff);
			const b = loadAmountF >> BigInt(35);
			const amountValue = BigInt(10) ** b * a;

			// Check that amount doesn't exceed the limit according to the contract
			const LIMIT_AMOUNT = BigInt(2) ** BigInt(128);

			if (amountValue >= LIMIT_AMOUNT) {
				throw new Error('Amount exceeds the maximum limit');
			}

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'withdraw',
				args: [amountValue],
			});

			return hash;
		} catch (error: any) {
			// Handle contract-specific errors
			if (error.message && error.message.includes('InsufficientBalance')) {
				throw new Error('Insufficient balance for withdrawal');
			}
			if (error.message && error.message.includes('LimitAmountExceeded')) {
				throw new Error('Amount exceeds the maximum limit');
			}
			if (error.message && error.message.includes('EthTransferFailed')) {
				throw new Error('ETH transfer failed. Please try again.');
			}

			console.error('Error withdrawing:', error);
			throw error;
		}
	};

	const handleExplodeMultiple = async (toEthAddrs: string[]) => {
		try {
			// Validate all addresses to ensure they're in correct format
			const validatedAddresses = toEthAddrs.map((addr) =>
				validateAddress(addr),
			);

			const hash = await writeContractAsync({
				address: formatFullEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'explodeMultiple',
				args: [validatedAddresses],
			});

			return hash;
		} catch (error: any) {
			if (error.message && error.message.includes('NotVouched')) {
				throw new Error('One or more addresses have not vouched for you');
			}

			console.error('Error exploding multiple:', error);
			throw error;
		}
	};

	return {
		handleDeposit,
		handleVouch,
		handleUnvouch,
		handleWithdraw,
		handleExplodeMultiple,
	};
};
