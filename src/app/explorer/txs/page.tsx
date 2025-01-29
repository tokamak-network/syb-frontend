'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactionData } from '@/const/transactions';
import { SearchBarComponent } from '@/components';
import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';

const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

	const filteredTransactions = transactionData.filter((transaction) => {
		const query = searchQuery.toLowerCase();
		return (
			transaction.txHash.toLowerCase().includes(query) ||
			transaction.txUser.from.toLowerCase().includes(query) ||
			transaction.txUser.to.toLowerCase().includes(query)
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
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">All Transactions</h1>
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
							key={transaction.txHash}
							className="cursor-pointer hover:bg-gray-100"
							onClick={() =>
								router.push(`/explorer/transactions/${transaction.txHash}`)
							}
						>
							<td className="px-6 py-2">{transaction.txHash}</td>
							<td className="px-6 py-2">
								<TxTypes txType={transaction.type.txType} />
							</td>
							<td className="px-6 py-2">{transaction.txUser.from}</td>
							<td className="px-6 py-2">{transaction.txUser.to}</td>
							<td className="px-6 py-2">
								<TxStatus status={transaction.type.txStatus} />
							</td>
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
