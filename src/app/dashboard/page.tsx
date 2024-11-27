'use client';

import React, { useEffect, useRef, useState } from 'react';

import { AccountInfo, UserGraph } from '@/components';
import TransactionTable from '@/components/tables/TransactionActivity';

const Dashboard: React.FC = () => {
	const [showTransactionTable, setShowTransactionTable] =
		useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		() => new Date(),
	);
	const tableRef = useRef<HTMLDivElement | null>(null);

	const handleShowMore = () => {
		setShowTransactionTable(true);
		if (tableRef.current) {
			tableRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		if (showTransactionTable && tableRef.current) {
			tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [showTransactionTable]);

	return (
		<div className="3xl:flex-row flex flex-col gap-8 bg-primary bg-opacity-60 p-8">
			<div className="flex-1 px-4">
				<AccountInfo
					selectedDate={selectedDate}
					onDateSelect={setSelectedDate}
					onShowMore={handleShowMore}
				/>
			</div>
			<div className="flex-1">
				<h3 className="mb-4 text-xl font-semibold">User Connections</h3>
				<UserGraph />
			</div>
			{showTransactionTable && (
				<div ref={tableRef}>
					<TransactionTable selectedDate={selectedDate} />
				</div>
			)}
		</div>
	);
};

export default Dashboard;
