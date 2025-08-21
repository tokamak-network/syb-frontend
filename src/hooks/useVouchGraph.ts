import { useQuery } from '@tanstack/react-query';
import { getPublicClient } from '@wagmi/core';
import { parseAbiItem, decodeFunctionData } from 'viem';
import { sepolia } from 'wagmi/chains';

import { config } from '@/config';
import { contracts, SybilSepoliaABI } from '@/contracts';

export interface VouchEdge {
	voucher: any;
	vouchee: any;
	from: string;
	to: string;
}

// Sybil TxEvent that encodes vouch/unvouch transactions
const TX_EVENT =
	'event TxEvent(uint256 indexed lastAddedTxn, uint8 indexed identifier, uint24 from, uint24 to, uint256 amount)';

/**
 * Parse an l1UserTx hex payload and return { type, from, to } if it's vouch/unvouch
 * Identifier: 1 byte (0x..) followed by from (20 bytes) and to (20 bytes)
 * Vouch = 3, Unvouch = 4
 */
const parseL1UserTx = (
	l1UserTx: `0x${string}`,
): { type: number; from: string; to: string } | null => {
	if (!l1UserTx || l1UserTx.length < 2 + 2 + 40 + 40) return null;
	const identifier = parseInt(l1UserTx.slice(2, 4), 16);

	if (identifier !== 3 && identifier !== 4) return null;
	const fromHex = l1UserTx.slice(4, 44);
	const toHex = l1UserTx.slice(44, 84);
	const from = `0x${fromHex}`.toLowerCase();
	const to = `0x${toHex}`.toLowerCase();

	return { type: identifier, from, to };
};

export interface UseVouchGraphOptions {
	fromBlock?: bigint; // inclusive
}

export const useVouchGraph = (options?: UseVouchGraphOptions) => {
	const fromBlock =
		options?.fromBlock ??
		BigInt(process.env.NEXT_PUBLIC_VOUCH_FROM_BLOCK || '8980000');

	return useQuery<{ edges: VouchEdge[] }>({
		queryKey: ['vouchGraph', fromBlock.toString()],
		queryFn: async () => {
			const client = getPublicClient(config, { chainId: sepolia.id });
			console.log('Client:', client);

			if (!client) throw new Error('Failed to create public client');

			const contractAddress = contracts.sybilSepolia.address as `0x${string}`;

			if (
				!contracts.sybilSepolia.address ||
				contracts.sybilSepolia.address === ''
			) {
				console.warn(
					'useVouchGraph - Contract address not configured, returning empty edges',
				);
				return { edges: [] };
			}

			let logs: any[] = [];
			try {
				// Get the latest block number
				const latestBlock = await client.getBlockNumber();
				console.log('Latest block:', latestBlock);

				// If fromBlock is too old compared to latest block, use a more recent starting point
				const MAX_REASONABLE_RANGE = 50000n; // Maximum reasonable range to query
				const adjustedFromBlock =
					latestBlock - fromBlock > MAX_REASONABLE_RANGE
						? latestBlock - MAX_REASONABLE_RANGE
						: fromBlock;

				// If the range is too large, chunk the requests
				const CHUNK_SIZE = 5000n; // Use smaller chunks to avoid RPC limits
				let currentFromBlock = adjustedFromBlock;

				while (currentFromBlock <= latestBlock) {
					const currentToBlock =
						currentFromBlock + CHUNK_SIZE - 1n > latestBlock
							? latestBlock
							: currentFromBlock + CHUNK_SIZE - 1n;

					try {
						// First, let's get ALL logs from the contract to see what events exist
						const allLogs = await client.getLogs({
							address: contractAddress,
							fromBlock: currentFromBlock,
							toBlock: currentToBlock,
						});

						console.log(
							`Found ${allLogs.length} total logs for blocks ${currentFromBlock}-${currentToBlock}:`,
							allLogs,
						);

						// Try different event signatures to find the right one
						let chunkLogs: any[] = [];

						// Try TxEvent first
						try {
							const txEventLogs = await client.getLogs({
								address: contractAddress,
								fromBlock: currentFromBlock,
								toBlock: currentToBlock,
								event: parseAbiItem(TX_EVENT),
							});
							console.log(
								`Found ${txEventLogs.length} TxEvent logs:`,
								txEventLogs,
							);
							chunkLogs.push(...txEventLogs);
						} catch (e) {
							console.log('TxEvent not found, trying other events...');
						}

						// Try direct Vouch event
						try {
							const vouchLogs = await client.getLogs({
								address: contractAddress,
								fromBlock: currentFromBlock,
								toBlock: currentToBlock,
								event: parseAbiItem(
									'event Vouch(address indexed from, address indexed to)',
								),
							});
							console.log(
								`Found ${vouchLogs.length} Vouch event logs:`,
								vouchLogs,
							);
							// Convert direct vouch events to our edge format
							for (const log of vouchLogs) {
								if (log.args?.from && log.args?.to) {
									chunkLogs.push({
										args: {
											l1UserTx: `0x03${log.args.from.slice(2)}${log.args.to.slice(2)}`,
										},
									});
								}
							}
						} catch (e) {
							console.log('Direct Vouch event not found');
						}

						logs.push(...chunkLogs);
					} catch (chunkError) {
						console.warn(
							`Failed to fetch logs for blocks ${currentFromBlock}-${currentToBlock}:`,
							chunkError,
						);
						// Continue with next chunk instead of failing completely
					}

					currentFromBlock = currentToBlock + 1n;

					// Add a small delay to avoid rate limiting
					if (currentFromBlock <= latestBlock) {
						await new Promise((resolve) => setTimeout(resolve, 200));
					}
				}
			} catch (error) {
				console.error('useVouchGraph - Error fetching logs:', error);
				return { edges: [] };
			}

			// Maintain final edge set after accounting for unvouch events
			const edgeSet = new Set<string>();

			console.log(`Processing ${logs.length} logs for vouch events`);

			for (const log of logs) {
				console.log('Processing log:', log);

				// Handle TxEvent format
				if (log.args && 'identifier' in log.args) {
					const identifier = log.args.identifier as number;
					const fromIdx = log.args.from as number;
					const toIdx = log.args.to as number;

					console.log(
						'TxEvent found - identifier:',
						identifier,
						'from idx:',
						fromIdx,
						'to idx:',
						toIdx,
					);

					console.log('Checking identifier:', identifier);

					// Let's process ALL TxEvents for debugging to see what we get
					console.log('Processing TxEvent (debug mode - all identifiers)...');

					// For debugging, let's process any identifier
					if (true) {
						// Process all for now
						try {
							// Get the transaction that created this log
							const transaction = await client.getTransaction({
								hash: log.transactionHash,
							});

							console.log('Transaction data:', transaction);

							// Try to decode the transaction input to get the actual addresses
							if (transaction.input && transaction.input !== '0x') {
								try {
									const decoded = decodeFunctionData({
										abi: SybilSepoliaABI,
										data: transaction.input,
									});

									console.log('Decoded function data:', decoded);

									// Extract addresses from the function arguments
									if (
										(decoded.functionName === 'vouch' ||
											decoded.functionName === 'unvouch') &&
										decoded.args &&
										decoded.args.length > 0
									) {
										const targetAddress = decoded.args[0] as string;
										const senderAddress = transaction.from;

										console.log(
											`${decoded.functionName}: from`,
											senderAddress,
											'to',
											targetAddress,
										);

										const key = `${senderAddress.toLowerCase()}->${targetAddress.toLowerCase()}`;

										// For debugging, let's add ALL edges regardless of identifier
										console.log(
											`Adding edge for identifier ${identifier}:`,
											key,
										);
										edgeSet.add(key);

										// Keep the original logic commented for reference
										// if (identifier === 3 || identifier === 33) {
										//   console.log('Adding vouch edge:', key);
										//   edgeSet.add(key);
										// } else if (identifier === 4 || identifier === 34) {
										//   console.log('Removing vouch edge:', key);
										//   edgeSet.delete(key);
										// }
									}
								} catch (decodeError) {
									console.log(
										'Failed to decode transaction input:',
										decodeError,
									);
									// Fallback to using indices - for debugging, add all
									const key = `idx${fromIdx}->idx${toIdx}`;
									console.log(
										`Adding fallback edge for identifier ${identifier}:`,
										key,
									);
									edgeSet.add(key);
								}
							}
						} catch (txError) {
							console.log('Failed to get transaction:', txError);
							// Fallback to using indices - for debugging, add all
							const key = `idx${fromIdx}->idx${toIdx}`;
							console.log(
								`Adding transaction fallback edge for identifier ${identifier}:`,
								key,
							);
							edgeSet.add(key);
						}
					}
					continue;
				}

				// Handle legacy l1UserTx format (fallback)
				const l1UserTx = log.args?.l1UserTx as `0x${string}` | undefined;

				if (!l1UserTx) {
					console.log('No l1UserTx or TxEvent found in log args');
					continue;
				}

				console.log('Found l1UserTx:', l1UserTx);
				const parsed = parseL1UserTx(l1UserTx);
				console.log('Parsed l1UserTx:', parsed);

				if (!parsed) {
					console.log('Failed to parse l1UserTx');
					continue;
				}

				const key = `${parsed.from}->${parsed.to}`;

				if (parsed.type === 3) {
					console.log('Adding vouch edge:', key);
					edgeSet.add(key);
				} else if (parsed.type === 4) {
					console.log('Removing vouch edge:', key);
					edgeSet.delete(key);
				}
			}

			const edges: VouchEdge[] = Array.from(edgeSet).map((k) => {
				const [from, to] = k.split('->');

				return { from, to };
			});

			console.log('Final processed edges:', edges);
			return { edges };
		},
		staleTime: 60_000,
	});
};
