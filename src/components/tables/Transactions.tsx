'use client';

import { useState } from 'react';
import TxTypes from '@/components/tables/TxType';
import { ActionType, ActionStatus, Order, Transaction } from '@/types';
import {
	formatTransactionHash,
	formatTimestamp,
	formatEthAddress,
	toChecksumAddress,
} from '@/utils/format';
import { Button, Dropdown } from '@/components';
import { useRouter } from 'next/navigation';

import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
	filteredTransactions: Transaction[];
	setOrder: (order: Order) => void;
	order: Order;
	currentPage?: number;
	totalPages?: number;
	itemsPerPage?: number;
	onPageChange?: (page: number) => void;
	onLimitChange?: (limit: number) => void;
	useExternalPagination?: boolean;
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
	useExternalPagination = false,
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

	// Only apply internal pagination if we're not using external pagination
	if (!useExternalPagination && externalCurrentPage === undefined) {
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		displayedTransactions = filteredTransactions.slice(
			indexOfFirstItem,
			indexOfLastItem,
		);

		totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
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
			setInternalCurrentPage(1);
		}
	};

	const handleOpenSepoliaExplorer = (
		txHash: string,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();
		const explorerUrl = process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER_URL;
		if (explorerUrl && txHash) {
			window.open(
				`${explorerUrl}/tx/0x${txHash}`,
				'_blank',
				'noopener,noreferrer',
			);
		}
	};

	const shouldShowToAddress = (txType: ActionType): boolean => {
		return ![
			ActionType.DEPOSIT,
			ActionType.WITHDRAW,
			ActionType.EXPLODE,
		].includes(txType as ActionType);
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
						<th className="px-6 py-3 text-right text-sm font-bold uppercase text-tableTextPrimary">
							Amount
						</th>
						<th className="px-6 py-3 text-right text-sm font-bold uppercase text-tableTextPrimary">
							Gas Fee
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
								key={transaction.item_id}
								className="cursor-pointer text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover"
								onClick={() =>
									router.push(`/explorer/txs/${transaction.tx_hash}`)
								}
							>
								<td className="px-6 py-2">
									<div className="flex items-center gap-2">
										<span className="flex-1">
											{transaction.tx_hash
												? formatTransactionHash(transaction.tx_hash)
												: 'N/A'}
										</span>
										{transaction.tx_hash && (
											<Button
												className="h-6 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
												onClick={(e) =>
													handleOpenSepoliaExplorer(transaction.tx_hash!, e)
												}
											>
												Sepolia
											</Button>
										)}
									</div>
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
										{formatEthAddress(transaction.from_eth_addr)}
										<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
											{transaction.from_eth_addr
												? toChecksumAddress(transaction.from_eth_addr)
												: 'N/A'}
										</div>
									</div>
								</td>
								<td className="px-6 py-2">
									{shouldShowToAddress(transaction.type) ? (
										<div className="group relative">
											{formatEthAddress(transaction.to_eth_addr)}
											<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
												{transaction.to_eth_addr
													? toChecksumAddress(transaction.to_eth_addr)
													: 'N/A'}
											</div>
										</div>
									) : (
										'-'
									)}
								</td>
								<td className="px-6 py-2 text-right">
									{transaction.amount ? `${transaction.amount} Gwei` : 'N/A'}
								</td>
								<td className="px-6 py-2 text-right">
									{transaction.gas_fee ? `${transaction.gas_fee} Wei` : 'N/A'}
								</td>
								<td className="px-6 py-2">
									{transaction.is_tx_forged ? (
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-green-400" />
											<span className="text-green-400">
												{transaction.is_tx_forged}
											</span>
										</div>
									) : (
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-yellow-400" />
											<span className="text-yellow-400">
												{transaction.is_tx_forged}
											</span>
										</div>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-6 py-2 text-center" colSpan={8}>
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
