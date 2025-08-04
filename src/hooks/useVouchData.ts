import { readContract, getPublicClient } from '@wagmi/core';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';

import { SybilSepoliaABI, contracts } from '@/contracts';
import { config } from '@/config';

import { useWallet } from './useWallet';

interface VouchData {
	hasVouched: boolean;
	isLoading: boolean;
	error: Error | null;
}

interface VouchTransaction {
	address: string;
	txHash: string | null;
	timestamp: string;
}

// Helper to ensure address is in correct 0x format
const formatAs0xAddress = (address: string): `0x${string}` => {
	return address.startsWith('0x')
		? (address as `0x${string}`)
		: (`0x${address}` as `0x${string}`);
};

// Event signature for L1UserTxEvent and direct function calls
const L1_USER_TX_EVENT =
	'event L1UserTxEvent(uint32 indexed queueIndex, uint8 indexed position, bytes l1UserTx)';
const VOUCH_EVENT_SIGNATURE =
	'0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f';

export const useVouchData = () => {
	const { address, chain } = useWallet();
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
	 * Fetch transaction details from the blockchain for vouch function calls directly
	 */
	const fetchVouchTransactionDetails = async (
		fromAddress: string,
		toAddress: string,
	): Promise<{ txHash: string | null; timestamp: string }> => {
		try {
			const contractAddress = formatAs0xAddress(contracts.sybilSepolia.address);

			const client = getPublicClient(config);

			if (!client) {
				throw new Error('Failed to create client');
			}

			// First try to find direct vouch/unvouch function calls
			const vouchEvents = await client.getLogs({
				address: contractAddress,
				fromBlock: 5000000n, // Adjust based on contract deployment
				toBlock: 'latest',
				event: parseAbiItem(
					'event L1UserTxEvent(uint32 indexed queueIndex, uint8 indexed position, bytes l1UserTx)',
				),
			});

			// Process logs looking for vouch (event type 3) or unvouch (event type 4) transactions
			for (const event of vouchEvents) {
				try {
					const l1UserTx = event.args.l1UserTx as `0x${string}` | undefined;

					if (l1UserTx) {
						// For the Sybil contract:
						// Identifier is at byte positions 0-1 (after 0x)
						// From address is at byte positions 2-43
						// To address is at byte positions 44-85
						const identifier = parseInt(l1UserTx.slice(2, 4), 16);

						// Vouch is type 3, unvouch is type 4
						if (identifier === 3 || identifier === 4) {
							// Extract the addresses from the event data
							// The format is:
							// identifier (1 byte) +
							// from (20 bytes - 40 hex chars) +
							// to (20 bytes - 40 hex chars) +
							// amount (32 bytes - 64 hex chars)

							// Cut after 0x and get the address sections
							const fromHex = l1UserTx.slice(4, 44); // 40 hex chars = 20 bytes address
							const toHex = l1UserTx.slice(44, 84); // 40 hex chars = 20 bytes address

							// Reconstruct the addresses with 0x prefix
							const txFromAddress = `0x${fromHex}`;
							const txToAddress = `0x${toHex}`;

							// Normalize addresses for comparison
							if (
								txFromAddress.toLowerCase() === fromAddress.toLowerCase() &&
								txToAddress.toLowerCase() === toAddress.toLowerCase()
							) {
								// Found a match - get transaction timestamp from the block
								const block = await client.getBlock({
									blockHash: event.blockHash,
								});

								const timestamp = new Date(Number(block.timestamp) * 1000)
									.toISOString()
									.replace('T', ' ')
									.substring(0, 19);

								return {
									txHash: event.transactionHash,
									timestamp,
								};
							}
						}
					}
				} catch (err) {
					console.error('Error processing log:', err);
				}
			}

			// If no match found in logs, try to find direct vouch function calls
			const directVouchCalls = await client.getLogs({
				address: contractAddress,
				fromBlock: 5000000n,
				toBlock: 'latest',
				// Use parseAbiItem to properly structure the filter
				event: parseAbiItem(
					'event Vouch(address indexed from, address indexed to)',
				),
			});

			for (const call of directVouchCalls) {
				try {
					// Get transaction receipt to analyze the actual function call
					const receipt = await client.getTransactionReceipt({
						hash: call.transactionHash,
					});

					// Check if this is a transaction from our target address
					if (receipt.from.toLowerCase() === fromAddress.toLowerCase()) {
						// Found a match
						const block = await client.getBlock({
							blockHash: call.blockHash,
						});

						const timestamp = new Date(Number(block.timestamp) * 1000)
							.toISOString()
							.replace('T', ' ')
							.substring(0, 19);

						return {
							txHash: call.transactionHash,
							timestamp,
						};
					}
				} catch (err) {
					console.error('Error checking transaction:', err);
				}
			}

			// If no matching transaction found, return null for txHash
			return {
				txHash: null,
				timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
			};
		} catch (err) {
			console.error('Error fetching transaction details:', err);

			return {
				txHash: null,
				timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
			};
		}
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
		// First determine which addresses have vouched for the target
		const { data, isLoading, error } = useQuery({
			queryKey: ['vouchersFor', targetAddress, possibleVouchers],
			queryFn: async () => {
				if (!targetAddress || !possibleVouchers.length) return [];

				try {
					const contractAddress = formatAs0xAddress(
						contracts.sybilSepolia.address,
					);
					const formattedTarget = formatAs0xAddress(targetAddress);
					const voucherAddresses: string[] = [];

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

							if (result) {
								voucherAddresses.push(voucher);
							}
						} catch (err) {
							console.error(`Error checking vouch for ${voucher}:`, err);
						}
					}

					return voucherAddresses;
				} catch (err) {
					console.error('Error fetching vouchers:', err);
					setError(err instanceof Error ? err : new Error(String(err)));

					return [];
				}
			},
			enabled: !!targetAddress && possibleVouchers.length > 0,
			staleTime: 30000,
		});

		// Then fetch transaction details for each voucher
		const { data: vouchersWithTx, isLoading: isLoadingTx } = useQuery({
			queryKey: ['vouchersTx', targetAddress, data],
			queryFn: async () => {
				if (!data || data.length === 0) return [];

				const vouchTransactions: VouchTransaction[] = [];

				// Fetch actual transaction data for each voucher
				for (const voucherAddress of data) {
					try {
						const { txHash, timestamp } = await fetchVouchTransactionDetails(
							voucherAddress,
							targetAddress,
						);

						vouchTransactions.push({
							address: voucherAddress,
							txHash,
							timestamp,
						});
					} catch (err) {
						console.error('Error fetching tx details:', err);
						vouchTransactions.push({
							address: voucherAddress,
							txHash: null,
							timestamp: new Date()
								.toISOString()
								.replace('T', ' ')
								.substring(0, 19),
						});
					}
				}

				return vouchTransactions;
			},
			enabled: !!data && data.length > 0,
			staleTime: 30000,
		});

		return {
			vouchers: data || [],
			vouchersWithTx: vouchersWithTx || [],
			isLoading: isLoading || isLoadingTx,
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
		// First determine which addresses the voucher has vouched for
		const { data, isLoading, error } = useQuery({
			queryKey: ['addressesVouchedFor', voucherAddress, possibleRecipients],
			queryFn: async () => {
				if (!voucherAddress || !possibleRecipients.length) return [];

				try {
					const contractAddress = formatAs0xAddress(
						contracts.sybilSepolia.address,
					);
					const formattedVoucher = formatAs0xAddress(voucherAddress);
					const vouchedAddresses: string[] = [];

					for (const recipient of possibleRecipients) {
						try {
							const formattedRecipient = formatAs0xAddress(recipient);

							const result = await readContract(config, {
								address: contractAddress,
								abi: SybilSepoliaABI,
								functionName: 'vouches',
								args: [formattedVoucher, formattedRecipient],
							});

							if (result) {
								vouchedAddresses.push(recipient);
							}
						} catch (err) {
							console.error(`Error checking vouch for ${recipient}:`, err);
						}
					}

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

		// Then fetch transaction details for each vouched address
		const { data: vouchedWithTx, isLoading: isLoadingTx } = useQuery({
			queryKey: ['vouchedTx', voucherAddress, data],
			queryFn: async () => {
				if (!data || data.length === 0) return [];

				const vouchTransactions: VouchTransaction[] = [];

				// Fetch actual transaction data for each vouched address
				for (const recipientAddress of data) {
					try {
						const { txHash, timestamp } = await fetchVouchTransactionDetails(
							voucherAddress,
							recipientAddress,
						);

						vouchTransactions.push({
							address: recipientAddress,
							txHash,
							timestamp,
						});
					} catch (err) {
						console.error('Error fetching tx details:', err);
						vouchTransactions.push({
							address: recipientAddress,
							txHash: null,
							timestamp: new Date()
								.toISOString()
								.replace('T', ' ')
								.substring(0, 19),
						});
					}
				}

				return vouchTransactions;
			},
			enabled: !!data && data.length > 0,
			staleTime: 30000,
		});

		return {
			vouchedAddresses: data || [],
			vouchedWithTx: vouchedWithTx || [],
			isLoading: isLoading || isLoadingTx,
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
