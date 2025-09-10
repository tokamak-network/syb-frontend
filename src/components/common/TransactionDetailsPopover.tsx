'use client';

import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import * as Popover from '@radix-ui/react-popover';

import { formatTimestamp, formatWeiValue, formatFullEthAddress } from '@/utils';
import { Transaction, ActionStatus } from '@/types';
import TxTypes from '@/components/tables/TxType';
import TxStatus from '@/components/tables/TxStatus';
import { useTheme } from '@/context/ThemeContext';

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
	const { theme } = useTheme();

	return (
		<div className={className}>
			<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger asChild>
					<button
						className={`flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 ${buttonClassName}`}
						title="View transaction details"
					>
						<FaEye size={16} />
					</button>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						align="end"
						className={`z-50 w-auto max-w-md rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-white' : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-600 bg-gray-700'} p-4 shadow-lg ${popoverClassName}`}
						side="bottom"
						sideOffset={5}
					>
						<div className="space-y-3 overflow-hidden">
							<div>
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									Transaction Hash:
								</strong>
								<div
									className={`mt-1 break-all font-mono text-xs ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
								>
									{`0x${transaction.tx_hash}`}
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									Type:
								</strong>
								<div className="outline-none focus:outline-none">
									<TxTypes txType={transaction.type} />
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									Status:
								</strong>
								<div className="outline-none focus:outline-none">
									<TxStatus
										status={
											transaction.is_tx_forged
												? ActionStatus.FORGED
												: ActionStatus.PENDING
										}
									/>
								</div>
							</div>

							<div>
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									From:
								</strong>
								<div
									className={`mt-1 break-all font-mono text-xs ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
								>
									{formatFullEthAddress(transaction.from_eth_addr)}
								</div>
							</div>

							<div>
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									To:
								</strong>
								<div
									className={`mt-1 break-all font-mono text-xs ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
								>
									{transaction.to_eth_addr
										? formatFullEthAddress(transaction.to_eth_addr)
										: '-'}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<strong
										className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
									>
										Block:
									</strong>
									<div
										className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
									>
										{transaction.block_number}
									</div>
								</div>
								<div>
									<strong
										className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
									>
										Value:
									</strong>
									<div
										className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
									>
										{formatWeiValue(transaction.amount)}
									</div>
								</div>
							</div>

							<div>
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									Fee:
								</strong>
								<div
									className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
								>
									{formatWeiValue(transaction.gas_fee)}
								</div>
							</div>

							<div>
								<strong
									className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
								>
									Timestamp:
								</strong>
								<div
									className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
								>
									{formatTimestamp(new Date(transaction.timestamp * 1000))}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<strong
										className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
									>
										Batch:
									</strong>
									<div
										className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
									>
										{transaction.batch_num}
									</div>
								</div>
								<div>
									<strong
										className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
									>
										Position:
									</strong>
									<div
										className={`text-sm ${theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
									>
										{transaction.position}
									</div>
								</div>
							</div>
						</div>
						<Popover.Arrow
							className={`${theme === 'light' ? 'fill-white' : theme === 'dark' ? 'fill-gray-800' : 'fill-gray-700'}`}
						/>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
};
