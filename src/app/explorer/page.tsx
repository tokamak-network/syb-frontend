'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button, TransactionDropDown, PageLoader } from '@/components';
import { TransactionDetailsPopover } from '@/components/common/TransactionDetailsPopover';
import { Avatar } from '@/components/common';
import {
	fetchAccounts,
	fetchTransactionsPaginated,
	formatTimestamp,
	formatTransactionHash,
} from '@/utils';
import { Transaction, Order } from '@/types';
import TxTypes from '@/components/tables/TxType';

const ExplorerPage: React.FC = () => {
	const [isNavigating] = useState<boolean>(false);
	const [txOption, setTxOption] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [hasMoreTransactions, setHasMoreTransactions] = useState<boolean>(true);

	const {
		data: transactionHistory,
		isLoading: isLoadingTx,
		error: txError,
	} = useQuery({
		queryKey: ['transactions', currentPage],
		queryFn: () => fetchTransactionsPaginated(currentPage, 20, Order.DESC),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: currentPage === 1, // Only auto-fetch for first page
	});

	const { isLoading: isLoadingAccounts } = useQuery({
		queryKey: ['accounts'],
		queryFn: fetchAccounts,
	});

	// Effect to handle initial data loading
	useEffect(() => {
		if (transactionHistory && currentPage === 1) {
			setAllTransactions(transactionHistory.transactions);
			setHasMoreTransactions(transactionHistory.transactions.length === 20);
		}
	}, [transactionHistory, currentPage]);

	// Load more transactions function
	const loadMoreTransactions = useCallback(async () => {
		if (isLoadingMore || !hasMoreTransactions) return;

		setIsLoadingMore(true);
		const nextPage = currentPage + 1;

		try {
			const newData = await fetchTransactionsPaginated(
				nextPage,
				20,
				Order.DESC,
			);

			setAllTransactions((prev) => [...prev, ...newData.transactions]);
			setCurrentPage(nextPage);
			setHasMoreTransactions(newData.transactions.length === 20);
		} catch {
			// Error handling for loading more transactions
		} finally {
			setIsLoadingMore(false);
		}
	}, [currentPage, isLoadingMore, hasMoreTransactions]);

	if (isLoadingTx || isLoadingAccounts || isNavigating) return <PageLoader />;

	const filteredTransactions = allTransactions.filter((tx) => {
		if (txOption === 'all') return true;
		if (txOption === 'pending') return tx.is_tx_forged === false;
		if (txOption === 'forged') return tx.is_tx_forged === true;

		return false;
	});

	return (
		<div className="max-w-full overflow-hidden">
			<div className="flex gap-8 md:flex-col md:gap-10 lg:flex-row">
				<div className="w-full">
					<TransactionDropDown value={txOption} onChange={setTxOption} />
					<div className="mt-1 space-y-3">
						{txError ? (
							<div className="text-center text-red-500">
								Transaction endpoint is not available right now.
							</div>
						) : (
							<div className="overflow-x-auto">
								<div className="overflow-y-auto">
									<table className="w-full rounded-lg border border-tableBorder text-left text-sm text-tableTextPrimary shadow-sm">
										<thead className="sticky top-0 z-10 bg-tableHeader text-xs uppercase text-tableTextSecondary">
											<tr>
												<th className="px-6 py-3">Tx Hash</th>
												<th className="px-6 py-3">Event</th>
												<th className="px-6 py-3">Details</th>
												<th className="px-6 py-3">Block</th>
												<th className="px-6 py-3">Age</th>
												<th className="px-6 py-3">Actions</th>
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
														} hover:bg-tableHover`}
													>
														<td className="px-6 py-4 font-medium">
															{tx.tx_hash
																? formatTransactionHash(String(tx.tx_hash))
																: '-'}
														</td>
														<td className="px-6 py-4">
															<TxTypes txType={tx.type} />
														</td>
														<td className="px-6 py-4">
															<div className="flex items-center space-x-2">
																<div className="flex items-center space-x-1">
																	<div className="group relative">
																		<Avatar
																			address={tx.from_eth_addr}
																			className="group-hover:ring-dashed transition-all duration-200 group-hover:ring-2 group-hover:ring-gray-400 group-hover:ring-offset-1"
																			size="sm"
																		/>
																		<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
																			From: {tx.from_eth_addr}
																		</div>
																	</div>
																	<span className="text-xs text-gray-500">
																		→
																	</span>
																	<div className="group relative">
																		<Avatar
																			address={tx.to_eth_addr}
																			className="group-hover:ring-dashed transition-all duration-200 group-hover:ring-2 group-hover:ring-gray-400 group-hover:ring-offset-1"
																			size="sm"
																		/>
																		<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
																			To: {tx.to_eth_addr}
																		</div>
																	</div>
																</div>
															</div>
														</td>
														<td className="px-6 py-4">{tx.block_number}</td>
														<td className="px-6 py-4">
															{formatTimestamp(new Date(tx.timestamp * 1000))}
														</td>
														<td className="px-6 py-4">
															<TransactionDetailsPopover transaction={tx} />
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
						{hasMoreTransactions && (
							<Button
								className="mt-4 w-full"
								disabled={isLoadingMore}
								onClick={loadMoreTransactions}
							>
								{isLoadingMore ? 'Loading...' : 'Load More'}
							</Button>
						)}
					</div>
				</div>

				{/* <div className="w-full">
					<h2 className="text-xl font-bold">Active Accounts</h2>
					<div className="mt-3">
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
				</div> */}
			</div>
		</div>
	);
};

export default ExplorerPage;
