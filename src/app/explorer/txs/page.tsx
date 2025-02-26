'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader, SearchBarComponent } from '@/components';
import TxTypes from '@/components/tables/TxType';
import { fetchTransactions } from '@/utils';
import { ActionType } from '@/types';

const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

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
			<table className="mt-4 min-w-full table-auto divide-y divide-gray-300 border border-gray-200">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase">
							Transaction Hash
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase">
							Type
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase">
							From
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase">
							To
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{currentTransactions.map((transaction) => (
						<tr
							key={transaction.id}
							className="cursor-pointer hover:bg-gray-100"
							onClick={() => router.push(`/explorer/txs/${transaction.id}`)}
						>
							<td className="px-6 py-2">{transaction.L1Info.ethereumTxHash}</td>
							<td className="px-6 py-2">
								<TxTypes txType={transaction.type as ActionType.DEPOSIT} />
							</td>
							<td className="px-6 py-2">
								{transaction.fromTonEthereumAddress}
							</td>
							<td className="px-6 py-2">{transaction.toTonEthereumAddress}</td>
							{/* <td className="px-6 py-2">
								<TxStatus status={transaction.type} />
							</td> */}
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-4 flex items-center justify-between">
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
					disabled={currentPage === 1}
					onClick={handlePreviousPage}
				>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
					disabled={currentPage === totalPages}
					onClick={handleNextPage}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default TransactionsPage;
