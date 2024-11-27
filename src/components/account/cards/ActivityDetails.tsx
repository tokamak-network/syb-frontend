import React from 'react';

import transactionData from '@/const/transactions';
import { Button, DateSelector } from '@/components';

import { TransactionListDetailsCard } from './TransactionListDetails';

interface ActivityDetailsCardProps {
	onShowMore: () => void;
	selectedDate: Date;
	onDateSelect: (date: Date | null) => void;
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
		<div
			className="flex min-w-[400px] flex-col space-y-1 rounded-lg border-2 border-white border-opacity-50 bg-cover bg-center p-4"
			style={{
				backgroundImage: 'url(/images/accountinfo.png)',
			}}
		>
			<p className="font-poppins text-2xl text-white">Activities</p>
			<div className="flex space-x-8">
				<DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
				<div className="items-center space-y-3">
					{transactionsToShow.length ? (
						transactionsToShow.map((transaction, index) => (
							<TransactionListDetailsCard key={index} {...transaction} />
						))
					) : (
						<p className="text-gray-300">
							No transactions found for this date.
						</p>
					)}
					{filteredTransactions.length > 3 && (
						<Button
							className="w-full min-w-[33%] rounded-lg border-2 border-white border-opacity-50 text-xl font-semibold"
							onClick={onShowMore}
						>
							Show More
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
