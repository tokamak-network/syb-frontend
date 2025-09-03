'use client';

import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import * as Popover from '@radix-ui/react-popover';

import {
	formatTransactionHash,
	formatTimestamp,
	formatWeiValue,
	formatFullEthAddress,
} from '@/utils';
import { Transaction, ActionStatus } from '@/types';
import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';

interface TransactionDetailsPopoverProps {
	transaction: Transaction;
	className?: string;
	buttonClassName?: string;
	popoverClassName?: string;
}

export const TransactionDetailsPopover: React.FC<
	TransactionDetailsPopoverProps
> = ({
	transaction,
	className = '',
	buttonClassName = '',
	popoverClassName = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={className}>
			<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger asChild>
					<button
						className={`flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300 ${buttonClassName}`}
						title="View transaction details"
					>
						<FaEye size={16} />
					</button>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						align="end"
						className={`z-50 w-96 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${popoverClassName}`}
						side="bottom"
						sideOffset={5}
					>
						<div className="space-y-3">
							<div>
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									Transaction Hash:
								</strong>
								<div className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
									{transaction.tx_hash
										? formatTransactionHash(String(transaction.tx_hash))
										: '-'}
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									Type:
								</strong>
								<TxTypes txType={transaction.type} />
							</div>

							<div className="flex items-center space-x-2">
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									Status:
								</strong>
								<TxStatus
									status={
										transaction.is_tx_forged
											? ActionStatus.FORGED
											: ActionStatus.PENDING
									}
								/>
							</div>

							<div>
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									From:
								</strong>
								<div className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
									{formatFullEthAddress(transaction.from_eth_addr)}
								</div>
							</div>

							<div>
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									To:
								</strong>
								<div className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
									{transaction.to_eth_addr
										? formatFullEthAddress(transaction.to_eth_addr)
										: '-'}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										Block:
									</strong>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{transaction.block_number}
									</div>
								</div>
								<div>
									<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										Value:
									</strong>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{formatWeiValue(transaction.amount)}
									</div>
								</div>
							</div>

							<div>
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									Fee:
								</strong>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{formatWeiValue(transaction.gas_fee)}
								</div>
							</div>

							<div>
								<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									Timestamp:
								</strong>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{formatTimestamp(new Date(transaction.timestamp * 1000))}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										Batch:
									</strong>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{transaction.batch_num}
									</div>
								</div>
								<div>
									<strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										Position:
									</strong>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{transaction.position}
									</div>
								</div>
							</div>
						</div>
						<Popover.Arrow className="fill-white dark:fill-gray-800" />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
};
