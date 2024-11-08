'use client';

import React, { useState } from 'react';

import { formatFullTime } from '@/utils'; // Ensure this path is correct
import { transactionData } from '@/data/transactionData';
import { TableDropdown } from '@/components';

import TxTypes from './TxType';
import TxStatus from './TxStatus';

interface TransactionTableProps {
	selectedDate: Date;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
	selectedDate,
}) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const isSameDay = (date1: Date, date2: Date) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const filteredTransactions = transactionData.filter((transaction) =>
		selectedDate ? isSameDay(transaction.time, selectedDate) : true,
	);

	// Calculate the transactions to display on the current page
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentTransactions = filteredTransactions.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);

	// Calculate total pages
	const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	return (
		<div className="overflow-x-auto rounded-lg shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<label
						className="mr-2 bg-item-per-page-label p-3 text-center text-gray-100"
						htmlFor="itemsPerPage"
					>
						Items per page:
					</label>
					<TableDropdown
						defaultValue={10}
						items={[5, 10, 20, 50, 100]}
						onChange={handleItemsPerPageChange}
					/>
				</div>
				{filteredTransactions.length > itemsPerPage && (
					<div className="flex">
						<button
							className="mr-2 rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
							disabled={currentPage === 1}
							onClick={handlePreviousPage}
						>
							Previous
						</button>
						<span className="text-gray-700">
							Page {currentPage} of {totalPages}
						</span>
						<button
							className="ml-2 rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
							disabled={currentPage === totalPages}
							onClick={handleNextPage}
						>
							Next
						</button>
					</div>
				)}
			</div>
			<table className="min-w-full table-auto divide-y divide-gray-300 rounded-lg">
				<thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Transaction Hash
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Time
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Type
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							From
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							To
						</th>
						<th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
							Amount
						</th>
						<th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
							Txn Fee
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Status
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{currentTransactions.length > 0 ? (
						currentTransactions.map((transaction, index) => (
							<tr
								key={index}
								className={`${
									index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
								} text-gray-700 transition-colors duration-300 hover:bg-gray-100`}
							>
								<td className="whitespace-nowrap px-6 py-4 text-left font-normal">
									{`0xHash${index}`}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-left font-normal">
									{formatFullTime(transaction.time)}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-left">
									<TxTypes txType={transaction.type} />
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-left font-normal">
									{transaction.from}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-left font-normal">
									{transaction.to}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-right font-normal">
									{transaction.amount} ETH
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-right font-normal">
									{transaction.amount * 0.01} ETH
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-left">
									<TxStatus status={transaction.status} />
								</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-6 py-4 text-center text-gray-500" colSpan={8}>
								No transactions found for the selected date.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TransactionTable;
