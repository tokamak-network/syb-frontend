'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { FiExternalLink } from 'react-icons/fi';

import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';
import { Button, PageLoader } from '@/components';
import {
	convertWeiToGweiAndEther,
	fetchTransactionByHash,
	formatTimestamp,
	formatWeiValue,
	formatTransactionHash,
	formatFullEthAddress,
} from '@/utils';
import { ActionStatus, ActionType } from '@/types';
import { useWallet } from '@/hooks/useWallet';

const TransactionDetailsPage: React.FC = () => {
	const { txHash } = useParams();
	const router = useRouter();
	const { chain } = useWallet();

	const {
		data: transaction,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['transaction', txHash as string],
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

	const { gwei, ether } = convertWeiToGweiAndEther(+transaction.gas_fee);

	const txHashToDisplay = formatTransactionHash(
		transaction.tx_hash ?? '',
		10,
		true,
	);

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
							className="inline-flex items-center text-blue-500 hover:text-blue-700 hover:underline"
							href={explorerUrl}
							rel="noopener noreferrer"
							target="_blank"
						>
							{formatTransactionHash(txHashToDisplay)}
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
							transaction.is_tx_forged
								? ActionStatus.FORGED
								: ActionStatus.PENDING
						}
					/>
				</div>
				<div>
					<strong>From:</strong>{' '}
					{formatFullEthAddress(transaction.from_eth_addr)}
				</div>
				<div>
					<strong>To:</strong>{' '}
					{formatFullEthAddress(transaction.to_eth_addr ?? '')}
				</div>
				<div>
					<strong>Block Number:</strong> {transaction.block_number}
				</div>
				<div>
					<strong>Value:</strong> {formatWeiValue(transaction.amount)}
				</div>
				<div>
					<strong>Fee:</strong> {formatWeiValue(transaction.gas_fee)}
				</div>
				<div>
					<strong>Timestamp:</strong>{' '}
					{formatTimestamp(new Date(transaction.timestamp * 1000))}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetailsPage;
