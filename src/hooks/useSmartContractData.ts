import { readContract } from '@wagmi/core';
import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { SybilSepoliaABI, VerifierSepoliaABI, contracts } from '@/contracts';
import { formatEthAddress } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';

interface Vouch {
	fromIdx: string;
	toIdx: string;
}

interface Transaction {
	txHash: string;
	type: string;
	from: string;
	to: string;
	amount: string;
	timestamp: number;
}

export const useSmartContractData = (accountIdx?: string) => {
	const { address } = useWallet();
	const [vouchesData, setVouchesData] = useState<Vouch[]>([]);
	const [transactionQueueData, setTransactionQueueData] = useState<any[]>([]);
	const [lastScoreSnapshot, setLastScoreSnapshot] = useState<string | null>(
		null,
	);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const { data: queueLength, isLoading: isLoadingQueueLength } = useQuery({
		queryKey: ['queueLength', address],
		queryFn: async () => {
			if (!address) return null;
			return readContract(config, {
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'getQueueLength',
			});
		},
		enabled: !!address,
		staleTime: 30000,
	});

	const { data: lastForgedBatch, isLoading: isLoadingLastBatch } = useQuery({
		queryKey: ['lastForgedBatch', address],
		queryFn: async () => {
			if (!address) return null;
			return readContract(config, {
				address: formatEthAddress(contracts.sybilSepolia.address),
				abi: SybilSepoliaABI,
				functionName: 'getLastForgedBatch',
			});
		},
		enabled: !!address,
		staleTime: 30000,
	});

	useEffect(() => {
		const fetchTransactionQueue = async () => {
			if (!queueLength || Number(queueLength) === 0) return;

			try {
				const indices = Array.from(
					{ length: Number(queueLength) },
					(_, i) => i,
				);

				const queuePromises = indices.map((index) =>
					readContract(config, {
						address: formatEthAddress(contracts.sybilSepolia.address),
						abi: SybilSepoliaABI,
						functionName: 'getL1TransactionQueue',
						args: [index],
					}),
				);

				const queueResults = await Promise.all(queuePromises);
				setTransactionQueueData(queueResults);
			} catch (error) {
				console.error('Failed to fetch transaction queue:', error);
			}
		};

		fetchTransactionQueue();
	}, [queueLength]);

	const { data: vouchEvents, isLoading: isLoadingVouchEvents } = useQuery({
		queryKey: ['vouchEvents', address, lastForgedBatch],
		queryFn: async () => {
			try {
				if (!address || !lastForgedBatch) return [];
				return [];
			} catch (error) {
				console.error('Error fetching vouch events:', error);
				return [];
			}
		},
		enabled: !!address && !!lastForgedBatch,
		staleTime: 30000,
	});

	const { data: txHistory, isLoading: isLoadingTxHistory } = useQuery({
		queryKey: ['transactionHistory', address, lastForgedBatch],
		queryFn: async () => {
			try {
				if (!address || !lastForgedBatch) return [];
				return [];
			} catch (error) {
				console.error('Error fetching transaction history:', error);
				return [];
			}
		},
		enabled: !!address && !!lastForgedBatch,
		staleTime: 30000,
	});

	useEffect(() => {
		const fetchScoreSnapshot = async () => {
			if (!accountIdx || !lastForgedBatch) return;

			try {
				const scoreRoot = await readContract(config, {
					address: formatEthAddress(contracts.sybilSepolia.address),
					abi: SybilSepoliaABI,
					functionName: 'scoreRootMap',
					args: [Number(lastForgedBatch)],
				});

				setLastScoreSnapshot(scoreRoot ? String(scoreRoot) : null);
			} catch (error) {
				console.error('Failed to fetch score snapshot:', error);
			}
		};

		fetchScoreSnapshot();
	}, [accountIdx, lastForgedBatch]);

	useEffect(() => {
		if (vouchEvents && vouchEvents.length > 0) {
			const processedVouches = vouchEvents.map((event: any) => ({
				fromIdx: event.fromIdx,
				toIdx: event.toIdx,
			}));
			setVouchesData(processedVouches);
		}
	}, [vouchEvents]);

	useEffect(() => {
		if (txHistory && txHistory.length > 0) {
			const processedTransactions = txHistory.map((event: any) => ({
				txHash: event.transactionHash,
				type: event.eventName,
				from: event.args?.fromIdx || '',
				to: event.args?.toIdx || '',
				amount: event.args?.amount ? String(event.args.amount) : '0',
				timestamp: event.blockTimestamp || Date.now(),
			}));
			setTransactions(processedTransactions);
		}
	}, [txHistory]);

	return {
		vouchesData,
		isLoadingVouchEvents,
		queueLength,
		transactionQueueData,
		isLoadingQueueLength,
		lastScoreSnapshot,
		transactions,
		isLoadingTxHistory,
		lastForgedBatch,
		isLoadingLastBatch,
	};
};
