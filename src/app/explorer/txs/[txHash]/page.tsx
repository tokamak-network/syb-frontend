'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';

import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';
import { Button, PageLoader } from '@/components';
import {
	convertWeiToGweiAndEther,
	fetchTransactionByHash,
	formatTimestamp,
} from '@/utils';
import { ActionStatus, ActionType } from '@/types';
import { formatTonAddress } from '@/utils';
import { useWallet } from '@/hooks/useWallet';
import { FiExternalLink } from 'react-icons/fi';

const TransactionDetailsPage: React.FC = () => {
	const { txHash } = useParams();
	const router = useRouter();
	const { chain } = useWallet();

	const {
		data: transaction,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['transaction', txHash],
		queryFn: () => fetchTransactionByHash(txHash as string),
		enabled: !!txHash,
		staleTime: 30000,
		refetchInterval: 30000,
	});

	if (isLoading) return <PageLoader />;

	if (error) {
		return (
			<div className="p-8 text-center text-red-500">
				Error loading transaction details. Please try again later.
			</div>
		);
	}

	if (!transaction) {
		return <div className="p-8">Transaction not found.</div>;
	}

	const { gwei, ether } = convertWeiToGweiAndEther(+transaction.L1Info.l1Fee);

	const txHashToDisplay = transaction.L1Info.ethereumTxHash
		? transaction.L1Info.ethereumTxHash
		: transaction.id;

	const getExplorerUrl = () => {
		if (!chain || !chain.blockExplorers) return null;

		const explorerUrl = chain.blockExplorers.default.url;
		return `${explorerUrl}/tx/${txHashToDisplay}`;
	};

	const explorerUrl = getExplorerUrl();

	return (
		<div className="p-8">
			<div className="mb-4">
				<Button
					className="inline-flex w-auto items-center hover:underline"
					leftIcon={IoArrowBackSharp}
					onClick={() => {
						router.push('/explorer/txs');
					}}
				>
					Back to Transaction List
				</Button>
			</div>
			<h1 className="mb-4 text-2xl font-bold">Transaction Details</h1>
			<div className="space-y-4">
				<div>
					<strong>Transaction Hash:</strong>{' '}
					{explorerUrl ? (
						<a
							href={explorerUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center text-blue-500 hover:text-blue-700 hover:underline"
						>
							{txHashToDisplay}
							<FiExternalLink className="ml-1" />
						</a>
					) : (
						txHashToDisplay
					)}
				</div>
				<div className="flex items-center space-x-2">
					<strong>Type:</strong>
					<TxTypes txType={transaction.type as ActionType} />
				</div>
				<div className="flex items-center space-x-2">
					<strong>Status:</strong>{' '}
					<TxStatus
						status={
							(transaction.batchNum === 0
								? 'Pending'
								: 'Forged') as ActionStatus
						}
					/>
				</div>
				<div>
					<strong>From:</strong>{' '}
					{formatTonAddress(transaction.fromTonEthereumAddress)}
				</div>
				<div>
					<strong>To:</strong>{' '}
					{formatTonAddress(transaction.toTonEthereumAddress ?? '')}
				</div>
				<div>
					<strong>Block Number:</strong> {transaction.L1Info.ethereumBlockNum}
				</div>
				<div>
					<strong>Value:</strong> {transaction.amount} ETH
				</div>
				<div>
					<strong>Fee:</strong> {gwei} Gwei ({ether} Ether)
				</div>
				<div>
					<strong>Timestamp:</strong> {formatTimestamp(transaction.timestamp)}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetailsPage;
