'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button, TransactionDropDown, PageLoader } from '@/components';
import {
	fetchAccounts,
	fetchTransactions,
	formatAddress,
	formatAmount,
	formatFullTime,
	formatTime,
	formatTransactionHash,
} from '@/utils';
import { Account } from '@/types';

const ExplorerPage: React.FC = () => {
	const [isNavigating, setIsNavigating] = useState<boolean>(false);
	const [txOption, setTxOption] = useState<string>('all');

	const router = useRouter();

	const {
		data: transactionHistory,
		isLoading: isLoadingTx,
		error: txError,
	} = useQuery({
		queryKey: ['transactions'],
		queryFn: () => fetchTransactions(),
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

	if (isLoadingTx || isLoadingAccounts || isNavigating) return <PageLoader />;

	const accounts = accountsData?.accounts || [];

	const filteredTransactions = transactionHistory?.transactions.filter((tx) => {
		if (txOption === 'all') return true;
		if (txOption === 'pending') return tx.is_tx_forged === false;
		if (txOption === 'forged') return tx.is_tx_forged === true;

		return false;
	});

	const handleNavigation = (path: string) => {
		setIsNavigating(true);
		router.push(path);
	};

	return (
		<div className="max-w-full overflow-hidden">
			<div className="flex gap-8 md:flex-col md:gap-10 lg:flex-row">
				<div className="w-full">
					<TransactionDropDown value={txOption} onChange={setTxOption} />
					<div className="mt-4 space-y-1">
						{txError ? (
							<div className="text-center text-red-500">
								Transaction endpoint is not available right now.
							</div>
						) : (
							<div className="overflow-x-auto">
								<div className="max-h-96 overflow-y-auto">
									<table className="w-full rounded-lg border border-tableBorder text-left text-sm text-tableTextPrimary shadow-sm">
										<thead className="sticky top-0 z-10 bg-tableHeader text-xs uppercase text-tableTextSecondary">
											<tr>
												<th className="px-6 py-3">Tx Hash</th>
												<th className="px-6 py-3">Type</th>
												<th className="px-6 py-3">From</th>
												<th className="px-6 py-3">To</th>
												<th className="px-6 py-3">Time</th>
											</tr>
										</thead>
										<tbody className="bg-tableBackground">
											{filteredTransactions &&
												filteredTransactions.map((tx, index) => (
													<tr
														key={tx.item_id}
														className={`${
															index % 2 === 0
																? 'bg-tableBackground'
																: 'bg-tableRowBackground'
														} cursor-pointer hover:bg-tableHover`}
														onClick={() =>
															router.push(`/explorer/txs/${String(tx.tx_hash)}`)
														}
													>
														<td className="px-6 py-4 font-medium">
															{formatTransactionHash(String(tx.tx_hash))}
														</td>
														<td className="px-6 py-4">{tx.type}</td>
														<td className="px-6 py-4">
															{formatAddress(tx.from_eth_addr)}
														</td>
														<td className="px-6 py-4">
															{[
																'deposit',
																'createaccountdeposit',
																'withdraw',
															].includes(tx.type.toLowerCase())
																? '-'
																: formatAddress(tx.to_eth_addr || '')}
														</td>
														<td className="px-6 py-4">
															{formatFullTime(new Date(tx.timestamp * 1000))}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{transactionHistory && transactionHistory?.pendingItems > 0 && (
							<div className="mt-4 text-sm text-gray-500">
								{transactionHistory.pendingItems} pending transactions
							</div>
						)}
						<Button
							className="w-full"
							onClick={() => handleNavigation('/explorer/txs')}
						>
							Show All Transactions
						</Button>
					</div>
				</div>

				<div className="w-full">
					<h2 className="py-1 text-xl font-bold">Active Accounts</h2>
					<div className="mt-4">
						{accountsError ? (
							<div className="text-center text-red-500">
								Account endpoint is not available right now.
							</div>
						) : (
							<div className="overflow-x-auto">
								<div className="max-h-96 overflow-y-auto">
									<table className="w-full rounded-lg border border-tableBorder text-left text-sm text-tableTextPrimary shadow-sm">
										<thead className="sticky top-0 z-10 bg-tableHeader text-xs uppercase text-tableTextSecondary">
											<tr>
												<th className="px-6 py-3">Address</th>
												<th className="px-6 py-3">Balance</th>
											</tr>
										</thead>
										<tbody className="bg-tableBackground">
											{accounts.map((account: Account, index: number) => (
												<tr
													key={account.idx}
													className={`${
														index % 2 === 0
															? 'bg-tableBackground'
															: 'bg-tableRowBackground'
													} hover:bg-tableHover`}
												>
													<td className="px-6 py-4 font-medium">
														{formatAddress(account.eth_addr)}
													</td>
													<td className="px-6 py-4">
														{formatAmount(account.balance)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
					<Button
						className="mt-4 rounded-full"
						onClick={() => handleNavigation('/explorer/accounts')}
					>
						Show All Accounts
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ExplorerPage;
