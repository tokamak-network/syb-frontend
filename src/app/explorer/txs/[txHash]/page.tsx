'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { transactionData } from '@/const/transactions';
import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';

const TransactionDetailsPage: React.FC = () => {
	const { txHash } = useParams();
	const transaction = transactionData.find((tx) => tx.txHash === txHash);

	if (!transaction) {
		return <div className="p-8">Transaction not found.</div>;
	}

	return (
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">Transaction Details</h1>
			<div className="space-y-4">
				<div>
					<strong>Transaction Hash:</strong> {transaction.txHash}
				</div>
				<div>
					<strong>Type:</strong> <TxTypes txType={transaction.type.txType} />
				</div>
				<div>
					<strong>Status:</strong>{' '}
					<TxStatus status={transaction.type.txStatus} />
				</div>
				<div>
					<strong>From:</strong> {transaction.txUser.from}
				</div>
				<div>
					<strong>To:</strong> {transaction.txUser.to}
				</div>
				<div>
					<strong>Block Number:</strong> {transaction.blockNumber}
				</div>
				<div>
					<strong>Value:</strong> {transaction.value} ETH
				</div>
				<div>
					<strong>Fee:</strong> {transaction.fee} ETH
				</div>
				<div>
					<strong>Timestamp:</strong> {transaction.timestamp.toString()}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetailsPage;
