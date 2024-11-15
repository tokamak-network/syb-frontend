import React from 'react';

import transactionData from '@/data/transactions';
import { Button, DateSelector } from '@/components';

import { TransactionListDetailsCard } from './TransactionListDetails';

interface ActivityDetailsCardProps {
	onShowMore: () => void;
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
}

export const ActivityDetailsCard: React.FC<ActivityDetailsCardProps> = ({
	onShowMore,
	selectedDate,
	onDateSelect,
}) => {
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

	const transactionsToShow = filteredTransactions.slice(0, 3);

	return (
		<div className="flex h-[330px] w-[400px] flex-col space-y-1 rounded-lg bg-white p-4">
			<p className="font-poppins text-2xl text-[#3F4765]">Activities</p>
			<div className="flex flex-col gap-2">
				<DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
				<div className="space-y-3">
					{transactionsToShow.length ? (
						transactionsToShow.map((transaction, index) => (
							<TransactionListDetailsCard key={index} {...transaction} />
						))
					) : (
						<p className="text-gray-500">
							No transactions found for this date.
						</p>
					)}
				</div>
				{filteredTransactions.length > 3 && (
					<Button
						className="mt-2 text-blue-500 hover:underline"
						onClick={onShowMore}
					>
						Show More
					</Button>
				)}
			</div>
		</div>
	);
};
