'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FiCopy } from 'react-icons/fi';

import { TxType as TxTypes } from '@/components/tables';
import { ActionType, Order, Transaction } from '@/types';
import {
	formatTransactionHash,
	formatTimestamp,
	formatEthAddress,
	toChecksumAddress,
	formatBalanceToEth,
	copyToClipboard,
	formatAddressForDisplay,
} from '@/utils';
import { Button, Dropdown, Avatar } from '@/components';

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
	const [copySuccess, setCopySuccess] = useState<string | null>(null);

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

	const handleCopyTxHash = async (txHash: string, event: React.MouseEvent) => {
		event.stopPropagation();
		const success = await copyToClipboard(`0x${txHash}`);

		if (success) {
			setCopySuccess(txHash);
			setTimeout(() => setCopySuccess(null), 2000);
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
							className="flex cursor-pointer items-center gap-1 px-6 py-3 text-left text-sm font-bold uppercase text-tableTextPrimary"
							onClick={() =>
								setOrder(order === Order.ASC ? Order.DESC : Order.ASC)
							}
						>
							Timestamp
							<IoMdArrowDropdown
								className={`cursor-pointer ${order === Order.ASC ? 'rotate-180' : ''}`}
								size={16}
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
											<>
												<Button
													className="h-6 rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
													title="Copy transaction hash"
													onClick={(e) =>
														handleCopyTxHash(transaction.tx_hash!, e)
													}
												>
													<div className="flex items-center">
														{copySuccess === transaction.tx_hash ? (
															<span>✓</span>
														) : (
															<FiCopy size={14} />
														)}
													</div>
												</Button>
												<Button
													className="h-6 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
													onClick={(e) =>
														handleOpenSepoliaExplorer(transaction.tx_hash!, e)
													}
												>
													Sepolia
												</Button>
											</>
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
									<div className="group relative flex items-center space-x-2">
										{transaction.from_eth_addr && (
											<Avatar address={transaction.from_eth_addr} size="sm" />
										)}
										<div>
											{formatEthAddress(transaction.from_eth_addr)}
											<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
												{formatAddressForDisplay(transaction.from_eth_addr)}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-2">
									{shouldShowToAddress(transaction.type) ? (
										<div className="group relative flex items-center space-x-2">
											{transaction.to_eth_addr && (
												<Avatar address={transaction.to_eth_addr} size="sm" />
											)}
											<div>
												{formatEthAddress(transaction.to_eth_addr)}
												<div className="absolute bottom-full mb-2 hidden w-max rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
													{formatAddressForDisplay(transaction.to_eth_addr)}
												</div>
											</div>
										</div>
									) : (
										'-'
									)}
								</td>
								<td className="px-6 py-2 text-right">
									{transaction.amount
										? `${formatBalanceToEth(transaction.amount)}`
										: 'N/A'}
								</td>
								<td className="px-6 py-2 text-right">
									{transaction.gas_fee
										? `${formatBalanceToEth(transaction.gas_fee)}`
										: 'N/A'}
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
							triggerContent={
								<div className="flex min-w-[60px] items-center justify-between gap-2 px-2 py-1">
									<span>{itemsPerPage}</span>
									<span>▼</span>
								</div>
							}
							onItemSelect={handleItemsPerPageChange}
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
