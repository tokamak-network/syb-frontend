import { readContract } from '@wagmi/core';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SybilSepoliaABI, contracts } from '@/contracts';
import { formatEthAddress } from '@/utils';
import { config } from '@/config';
import { useWallet } from './useWallet';

interface VouchData {
	hasVouched: boolean;
	isLoading: boolean;
	error: Error | null;
}

// Helper to ensure address is in correct 0x format
const formatAs0xAddress = (address: string): `0x${string}` => {
	return address.startsWith('0x')
		? (address as `0x${string}`)
		: (`0x${address}` as `0x${string}`);
};

export const useVouchData = () => {
	const { address } = useWallet();
	const [error, setError] = useState<Error | null>(null);

	/**
	 * Check if fromAddress has vouched for toAddress
	 */
	const useHasVouched = (fromAddress: string, toAddress: string): VouchData => {
		const { data, isLoading, error } = useQuery({
			queryKey: ['hasVouched', fromAddress, toAddress],
			queryFn: async () => {
				if (!fromAddress || !toAddress) return false;

				try {
					const contractAddress = formatAs0xAddress(
						contracts.sybilSepolia.address,
					);
					const formattedFromAddress = formatAs0xAddress(fromAddress);
					const formattedToAddress = formatAs0xAddress(toAddress);

					const result = await readContract(config, {
						address: contractAddress,
						abi: SybilSepoliaABI,
						functionName: 'vouches',
						args: [formattedFromAddress, formattedToAddress],
					});

					return !!result;
				} catch (err) {
					console.error('Error checking vouch status:', err);
					setError(err instanceof Error ? err : new Error(String(err)));
					return false;
				}
			},
			enabled: !!fromAddress && !!toAddress,
			staleTime: 30000,
		});

		return {
			hasVouched: !!data,
			isLoading,
			error: error as Error | null,
		};
	};

	/**
	 * Get a list of addresses that have vouched for a specific address
	 * This requires iterating through possible vouchers since there's no direct way
	 * to query the contract for this information
	 */
	const useVouchersFor = (
		targetAddress: string,
		possibleVouchers: string[],
	) => {
		const { data, isLoading, error } = useQuery({
			queryKey: ['vouchersFor', targetAddress, possibleVouchers],
			queryFn: async () => {
				if (!targetAddress || !possibleVouchers.length) return [];

				try {
					const contractAddress = formatAs0xAddress(
						contracts.sybilSepolia.address,
					);
					const formattedTarget = formatAs0xAddress(targetAddress);
					const results: boolean[] = [];

					// Sequential calls for now (can be optimized with multicall)
					for (const voucher of possibleVouchers) {
						try {
							const formattedVoucher = formatAs0xAddress(voucher);

							const result = await readContract(config, {
								address: contractAddress,
								abi: SybilSepoliaABI,
								functionName: 'vouches',
								args: [formattedVoucher, formattedTarget],
							});

							results.push(!!result);
						} catch (err) {
							console.error(`Error checking vouch for ${voucher}:`, err);
							results.push(false);
						}
					}

					// Filter to only include addresses that have vouched
					const vouchers = possibleVouchers.filter(
						(_, index) => results[index],
					);

					return vouchers;
				} catch (err) {
					console.error('Error fetching vouchers:', err);
					setError(err instanceof Error ? err : new Error(String(err)));
					return [];
				}
			},
			enabled: !!targetAddress && possibleVouchers.length > 0,
			staleTime: 30000,
		});

		return {
			vouchers: data || [],
			isLoading,
			error: error as Error | null,
		};
	};

	/**
	 * Get a list of addresses that the current user has vouched for
	 */
	const useAddressesVouchedFor = (
		voucherAddress: string,
		possibleRecipients: string[],
	) => {
		const { data, isLoading, error } = useQuery({
			queryKey: ['addressesVouchedFor', voucherAddress, possibleRecipients],
			queryFn: async () => {
				if (!voucherAddress || !possibleRecipients.length) return [];

				try {
					const contractAddress = formatAs0xAddress(
						contracts.sybilSepolia.address,
					);
					const formattedVoucher = formatAs0xAddress(voucherAddress);
					const results: boolean[] = [];

					for (const recipient of possibleRecipients) {
						try {
							const formattedRecipient = formatAs0xAddress(recipient);

							const result = await readContract(config, {
								address: contractAddress,
								abi: SybilSepoliaABI,
								functionName: 'vouches',
								args: [formattedVoucher, formattedRecipient],
							});

							results.push(!!result);
						} catch (err) {
							console.error(`Error checking vouch for ${recipient}:`, err);
							results.push(false);
						}
					}

					// Filter to only include addresses that have been vouched for
					const vouchedAddresses = possibleRecipients.filter(
						(_, index) => results[index],
					);

					return vouchedAddresses;
				} catch (err) {
					console.error('Error fetching vouched addresses:', err);
					setError(err instanceof Error ? err : new Error(String(err)));
					return [];
				}
			},
			enabled: !!voucherAddress && possibleRecipients.length > 0,
			staleTime: 30000,
		});

		return {
			vouchedAddresses: data || [],
			isLoading,
			error: error as Error | null,
		};
	};

	return {
		useHasVouched,
		useVouchersFor,
		useAddressesVouchedFor,
		error,
	};
};
