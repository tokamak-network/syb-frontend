'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';

import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';
import { Button, PageLoader } from '@/components';
import { fetchTransactionByHash, formatTimestamp } from '@/utils';
import { ActionStatus, ActionType } from '@/types';

const TransactionDetailsPage: React.FC = () => {
	const { txHash } = useParams();
	const router = useRouter();

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
					{transaction.L1Info.ethereumTxHash
						? transaction.L1Info.ethereumTxHash
						: transaction.id}
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
					<strong>From:</strong> {transaction.fromTonEthereumAddress}
				</div>
				<div>
					<strong>To:</strong> {transaction.toTonEthereumAddress as string}
				</div>
				<div>
					<strong>Block Number:</strong> {transaction.L1Info.ethereumBlockNum}
				</div>
				<div>
					<strong>Value:</strong> {transaction.amount} ETH
				</div>
				<div>
					<strong>Fee:</strong> {transaction.L1Info.l1Fee} wETH
				</div>
				<div>
					<strong>Timestamp:</strong> {formatTimestamp(transaction.timestamp)}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetailsPage;
