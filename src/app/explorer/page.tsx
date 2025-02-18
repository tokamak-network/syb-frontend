'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, TransactionDropDown, Modal, PageLoader } from '@/components';
import transactionData from '@/const/transactions';
import {
	AccountType,
	ActionStatus,
	ActionType,
	ExplorerType,
	TransactionResponse,
} from '@/types';
import {
	fetchAccounts,
	fetchTransactions,
	formatAddress,
	formatAmount,
	formatTime,
	statusStyles,
	typeStyles,
} from '@/utils';
import { apiRequest } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

const ExplorerPage: React.FC = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [showMoreUsers, setShowMoreUsers] = useState(false);

	const [txOption, setTxOption] = useState('all');

	const router = useRouter();

	const {
		data: transactionHistory,
		isLoading: isLoadingTx,
		error: txError,
	} = useQuery({
		queryKey: ['transactions'],
		queryFn: fetchTransactions,
		staleTime: 30000,
		refetchInterval: 30000,
	});

	const {
		data: accountsData,
		isLoading: isLoadingAccounts,
		error: accountsError,
	} = useQuery({
		queryKey: ['accounts'],
		queryFn: fetchAccounts,
	});

	if (isLoadingTx || isLoadingAccounts) return <PageLoader />;

	if (txError || accountsError) {
		return (
			<div className="p-8 text-center text-red-500">
				{txError ? 'Error loading transactions. ' : ''}
				{accountsError ? 'Error loading accounts. ' : ''}
				Please try again later.
			</div>
		);
	}

	const accounts = accountsData?.accounts || [];

	const filteredTransactions = transactionHistory?.transactions.filter((tx) => {
		if (txOption === 'all') return true;
		if (txOption === 'pending') return tx.batchNum === 0;
		if (txOption === 'forged') return tx.batchNum > 0;
		return false;
	});

	return (
		<div className="grid grid-cols-2 gap-8 p-8">
			<div className="space-y-8">
				<TransactionDropDown value={txOption} onChange={setTxOption} />
				<div className="space-y-1">
					<table className="w-full text-left text-sm text-tableTextPrimary">
						<thead className="bg-tableHeader text-xs uppercase text-tableTextSecondary">
							<tr>
								<th className="px-6 py-3">Tx Hash</th>
								<th className="px-6 py-3">Type</th>
								<th className="px-6 py-3">From</th>
								<th className="px-6 py-3">To</th>
								<th className="px-6 py-3">Amount</th>
								<th className="px-6 py-3">Time</th>
							</tr>
						</thead>
						<tbody className="bg-tableRowBackground">
							{filteredTransactions &&
								filteredTransactions.map((tx, index) => (
									<tr
										key={tx.id}
										className={`${
											index % 2 === 0
												? 'bg-tableRowBackground'
												: 'bg-tableBackground'
										} hover:bg-tableHover`}
									>
										<td className="px-6 py-4 font-medium">
											{tx.L1Info.ethereumTxHash
												? formatAddress(tx.L1Info.ethereumTxHash)
												: formatAddress(tx.id)}
										</td>
										<td className="px-6 py-4">{tx.type}</td>
										<td className="px-6 py-4">
											{formatAddress(tx.fromTonEthereumAddress)}
										</td>
										<td className="px-6 py-4">
											{formatAddress(tx.toTonEthereumAddress || '')}
										</td>
										<td className="px-6 py-4">{formatAmount(tx.amount)}</td>
										<td className="px-6 py-4">
											{formatTime(new Date(tx.timestamp))}
										</td>
									</tr>
								))}
						</tbody>
					</table>
					{transactionHistory && transactionHistory?.pendingItems > 0 && (
						<div className="mt-4 text-sm text-gray-500">
							{transactionHistory.pendingItems} pending transactions
						</div>
					)}
					<Button
						className="rounded-full"
						onClick={() => {
							router.push('/explorer/txs');
						}}
					>
						Show All Transactions
					</Button>
				</div>
			</div>

			<div className="space-y-8">
				<h2 className="py-1 text-xl font-bold">Active Accounts</h2>
				<div>
					<table className="w-full text-left text-sm text-tableTextPrimary">
						<thead className="bg-tableHeader text-xs uppercase text-tableTextSecondary">
							<tr>
								<th className="px-6 py-3">Address</th>
								<th className="px-6 py-3">Balance</th>
							</tr>
						</thead>
						<tbody className="bg-tableRowBackground">
							{accounts.map((account: AccountType, index: number) => (
								<tr
									key={account.accountIndex}
									className={`${
										index % 2 === 0
											? 'bg-tableRowBackground'
											: 'bg-tableBackground'
									} hover:bg-tableHover`}
								>
									<td className="px-6 py-4 font-medium">
										{formatAddress(account.tonEthereumAddress)}
									</td>
									<td className="px-6 py-4">{formatAmount(account.balance)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ExplorerPage;
