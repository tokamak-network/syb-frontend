'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader, SearchBarComponent, Dropdown } from '@/components';
import TxTypes from '@/components/tables/TxType';
import { fetchTransactions } from '@/utils';
import { ActionType } from '@/types';
import { formatTransactionHash, formatTimestamp } from '@/utils/format';

const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

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

	if (isLoadingTx) return <PageLoader />;

	const transactions = transactionHistory?.transactions || [];

	const filteredTransactions = transactions.filter((transaction) => {
		const query = searchQuery.toLowerCase();

		return (
			transaction.id.toLowerCase().includes(query) ||
			transaction.fromTonEthereumAddress.toLowerCase().includes(query) ||
			transaction.fromAccountIndex.toLowerCase().includes(query)
		);
	});

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentTransactions = filteredTransactions.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);

	const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const pageSizeOptions = [5, 10, 20, 50];

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	return (
		<div className="space-y-2 p-8">
			<Button
				className="inline-flex w-auto items-center hover:underline"
				leftIcon={IoArrowBackSharp}
				onClick={() => {
					router.push('/explorer');
				}}
			>
				Back to Explorer Page
			</Button>
			<SearchBarComponent
				placeholder="Search by Transaction Hash, From, or To"
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<table className="mt-4 min-w-full table-auto divide-y divide-tableBorder border border-tableBorder">
				<thead className="bg-tableHeader">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							Transaction Hash
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							Type
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							Timestamp
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							From
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							To
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							Account Index
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-tableBorder bg-tableBackground">
					{currentTransactions.map((transaction) => (
						<tr
							key={transaction.id}
							className="cursor-pointer text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover"
							onClick={() => router.push(`/explorer/txs/${transaction.id}`)}
						>
							<td className="px-6 py-2">
								{formatTransactionHash(transaction.L1Info.ethereumTxHash)}
							</td>
							<td className="px-6 py-2">
								<TxTypes txType={transaction.type as ActionType.DEPOSIT} />
							</td>
							<td className="px-6 py-2">
								{transaction.timestamp
									? formatTimestamp(transaction.timestamp)
									: 'N/A'}
							</td>
							<td className="px-6 py-2">
								{transaction.fromTonEthereumAddress}
							</td>
							<td className="px-6 py-2">{transaction.toTonEthereumAddress}</td>
							<td className="px-6 py-2">{transaction.fromAccountIndex}</td>
							<td className="px-6 py-2">{transaction.type}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-4 flex items-center justify-between">
				<Button
					className="rounded border border-paginationButtonBorder bg-paginationButton px-4 py-2 text-paginationButtonText disabled:opacity-50"
					disabled={currentPage === 1}
					onClick={handlePreviousPage}
				>
					Previous
				</Button>
				<div className="flex items-center gap-4">
					<span className="text-paginationText">
						Page {currentPage} of {totalPages}
					</span>
					<div className="flex items-center gap-2">
						<span className="text-paginationText">Show:</span>
						<Dropdown
							items={pageSizeOptions}
							renderItem={(item) => <span>{item}</span>}
							onItemSelect={handleItemsPerPageChange}
							triggerContent={
								<div className="flex min-w-[60px] items-center justify-between gap-2 px-2 py-1">
									<span>{itemsPerPage}</span>
									<span>▼</span>
								</div>
							}
						/>
					</div>
				</div>
				<Button
					className="rounded border border-paginationButtonBorder bg-paginationButton px-4 py-2 text-paginationButtonText disabled:opacity-50"
					disabled={currentPage === totalPages || totalPages === 0}
					onClick={handleNextPage}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default TransactionsPage;
