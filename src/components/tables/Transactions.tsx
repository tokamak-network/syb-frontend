'use client';

import { useState } from 'react';
import TxTypes from '@/components/tables/TxType';
import { ActionType, Transaction } from '@/types';
import {
	formatTransactionHash,
	formatTimestamp,
	formatTonAddress,
} from '@/utils/format';
import { Button, Dropdown } from '@/components';
import { useRouter } from 'next/navigation';

interface Props {
	filteredTransactions: Transaction[];
}

export const TransactionsTable: React.FC<Props> = ({
	filteredTransactions,
}) => {
	const router = useRouter();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

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
		<>
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
					{currentTransactions.length > 0 ? (
						currentTransactions.map((transaction) => (
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
									<div className="group relative">
										{formatTonAddress(transaction.fromTonEthereumAddress, true)}
										<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
											{transaction.fromTonEthereumAddress
												? formatTonAddress(transaction.fromTonEthereumAddress)
												: 'N/A'}
										</div>
									</div>
								</td>
								<td className="px-6 py-2">
									<div className="group relative">
										{formatTonAddress(
											transaction.toTonEthereumAddress ?? '',
											true,
										)}
										<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
											{transaction.toTonEthereumAddress
												? formatTonAddress(transaction.toTonEthereumAddress)
												: 'N/A'}
										</div>
									</div>
								</td>
								<td className="px-6 py-2">{transaction.fromAccountIndex}</td>
								<td className="px-6 py-2">{transaction.type}</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-6 py-2 text-center" colSpan={7}>
								No transactions found
							</td>
						</tr>
					)}
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
		</>
	);
};
