'use client';

import { useState } from 'react';
import TxTypes from '@/components/tables/TxType';
import { ActionType, ActionStatus, Order, Transaction } from '@/types';
import {
	formatTransactionHash,
	formatTimestamp,
	formatTonAddress,
} from '@/utils/format';
import { Button, Dropdown } from '@/components';
import { useRouter } from 'next/navigation';

import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
	filteredTransactions: Transaction[];
	setOrder: (order: Order) => void;
	order: Order;
	// Optional props for external pagination control
	currentPage?: number;
	totalPages?: number;
	itemsPerPage?: number;
	onPageChange?: (page: number) => void;
	onLimitChange?: (limit: number) => void;
}

export const TransactionsTable: React.FC<Props> = ({
	filteredTransactions,
	setOrder,
	order,
	currentPage: externalCurrentPage,
	totalPages: externalTotalPages,
	itemsPerPage: externalItemsPerPage,
	onPageChange,
	onLimitChange,
}) => {
	const router = useRouter();

	const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
	const [internalItemsPerPage, setInternalItemsPerPage] = useState<number>(10);

	const currentPage =
		externalCurrentPage !== undefined
			? externalCurrentPage
			: internalCurrentPage;
	const itemsPerPage =
		externalItemsPerPage !== undefined
			? externalItemsPerPage
			: internalItemsPerPage;

	let displayedTransactions = filteredTransactions;
	let totalPages = externalTotalPages;

	if (externalCurrentPage === undefined) {
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		displayedTransactions = filteredTransactions.slice(
			indexOfFirstItem,
			indexOfLastItem,
		);

		totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
	} else {
		displayedTransactions = filteredTransactions;
	}

	const handleNextPage = () => {
		if (currentPage < (totalPages || 1)) {
			if (onPageChange) {
				onPageChange(currentPage + 1);
			} else {
				setInternalCurrentPage(currentPage + 1);
			}
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			if (onPageChange) {
				onPageChange(currentPage - 1);
			} else {
				setInternalCurrentPage(currentPage - 1);
			}
		}
	};

	const pageSizeOptions = [5, 10, 20, 50];

	const handleItemsPerPageChange = (value: number) => {
		if (onLimitChange) {
			onLimitChange(value);
		} else {
			setInternalItemsPerPage(value);
			setInternalCurrentPage(1); // Reset to first page when changing items per page
		}
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
						<th
							onClick={() =>
								setOrder(order === Order.ASC ? Order.DESC : Order.ASC)
							}
							className="flex cursor-pointer items-center gap-1 px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary"
						>
							Timestamp
							<IoMdArrowDropdown
								size={16}
								className={`cursor-pointer ${order === Order.ASC ? 'rotate-180' : ''}`}
							/>
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
					{displayedTransactions.length > 0 ? (
						displayedTransactions.map((transaction) => (
							<tr
								key={transaction.id}
								className="cursor-pointer text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover"
								onClick={() => router.push(`/explorer/txs/${transaction.id}`)}
							>
								<td className="px-6 py-2">
									{transaction.tx_hash
										? formatTransactionHash(transaction.tx_hash)
										: 'N/A'}
								</td>
								<td className="px-6 py-2">
									<TxTypes txType={transaction.type as ActionType} />
								</td>
								<td className="px-6 py-2">
									{transaction.timestamp
										? formatTimestamp(new Date(transaction.timestamp * 1000))
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
									{['deposit', 'CreateAccountDeposit', 'Withdraw'].includes(
										transaction.type.toLowerCase(),
									) ? (
										'-'
									) : (
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
									)}
								</td>
								<td className="px-6 py-2">{transaction.fromAccountIndex}</td>
								<td className="px-6 py-2">
									{transaction.batch_num === 0 ? (
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-yellow-400" />
											<span className="text-yellow-400">
												{ActionStatus.PENDING}
											</span>
										</div>
									) : (
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-green-400" />
											<span className="text-green-400">
												{ActionStatus.FORGED}
											</span>
										</div>
									)}
								</td>
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
						Page {currentPage} of {totalPages || 1}
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
					disabled={
						currentPage === (totalPages || 1) || (totalPages || 0) === 0
					}
					onClick={handleNextPage}
				>
					Next
				</Button>
			</div>
		</>
	);
};
