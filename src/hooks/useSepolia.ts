import { useWriteContract } from 'wagmi';

import { SybilSepoliaABI, contracts } from '@/contracts';
import {
	formatEthAddress,
	convertToUint40Format,
	validateAddress,
} from '@/utils';

export const useSepoliaTransactions = () => {
	const { writeContractAsync } = useWriteContract();

	const handleDeposit = async (amount: string) => {
		try {
			const loadAmountF = convertToUint40Format(amount);
			const a = loadAmountF & BigInt(0x7ffffffff);
			const b = loadAmountF >> BigInt(35);
			const amountValue = BigInt(10) ** b * a;

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'deposit',
				value: amountValue,
			});

			return hash;
		} catch (error) {
			console.error('Error depositing:', error);
			throw error;
		}
	};

	const handleVouch = async (toEthAddr: string) => {
		try {
			const validatedAddress = validateAddress(toEthAddr);

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'vouch',
				args: [validatedAddress],
			});

			return hash;
		} catch (error) {
			console.error('Error vouching:', error);
			throw error;
		}
	};

	const handleUnvouch = async (toEthAddr: string) => {
		try {
			const validatedAddress = validateAddress(toEthAddr);

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'unvouch',
				args: [validatedAddress],
			});

			return hash;
		} catch (error) {
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

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'withdraw',
				args: [amountValue],
			});

			return hash;
		} catch (error) {
			console.error('Error withdrawing:', error);
			throw error;
		}
	};

	const handleExplodeMultiple = async (toEthAddrs: string[]) => {
		try {
			const validatedAddresses = toEthAddrs.map((addr) =>
				validateAddress(addr),
			);

			const hash = await writeContractAsync({
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'explodeMultiple',
				args: [validatedAddresses],
			});

			return hash;
		} catch (error) {
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
