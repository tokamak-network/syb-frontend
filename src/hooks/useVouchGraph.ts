import { useQuery } from '@tanstack/react-query';
import { getPublicClient } from '@wagmi/core';
import { parseAbiItem } from 'viem';

import { config } from '@/config';
import { contracts } from '@/contracts';

export interface VouchEdge {
	from: string;
	to: string;
}

const formatAs0xAddress = (address: string): `0x${string}` => {
	return address.startsWith('0x')
		? (address as `0x${string}`)
		: (`0x${address}` as `0x${string}`);
};

// Sybil L1UserTxEvent that encodes vouch/unvouch in l1UserTx payload
const L1_USER_TX_EVENT =
	'event L1UserTxEvent(uint32 indexed queueIndex, uint8 indexed position, bytes l1UserTx)';

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
		BigInt(process.env.NEXT_PUBLIC_VOUCH_FROM_BLOCK || '5000000');

	return useQuery<{ edges: VouchEdge[] }>({
		queryKey: ['vouchGraph', fromBlock.toString()],
		queryFn: async () => {
			const client = getPublicClient(config);
			if (!client) throw new Error('Failed to create public client');

			const contractAddress = formatAs0xAddress(contracts.sybilSepolia.address);

			const logs = await client.getLogs({
				address: contractAddress,
				fromBlock,
				toBlock: 'latest',
				event: parseAbiItem(L1_USER_TX_EVENT),
			});

			// Maintain final edge set after accounting for unvouch events
			const edgeSet = new Set<string>();

			for (const log of logs) {
				const l1UserTx = log.args.l1UserTx as `0x${string}` | undefined;
				if (!l1UserTx) continue;
				const parsed = parseL1UserTx(l1UserTx);
				if (!parsed) continue;
				const key = `${parsed.from}->${parsed.to}`;
				if (parsed.type === 3) {
					edgeSet.add(key);
				} else if (parsed.type === 4) {
					edgeSet.delete(key);
				}
			}

			const edges: VouchEdge[] = Array.from(edgeSet).map((k) => {
				const [from, to] = k.split('->');
				return { from, to };
			});

			return { edges };
		},
		staleTime: 60_000,
	});
};
