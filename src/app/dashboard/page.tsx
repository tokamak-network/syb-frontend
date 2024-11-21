'use client';

import React, { useState } from 'react';

import { AccountInfo, UserGraph } from '@/components';
import TransactionTable from '@/components/tables/TransactionActivity';

const Dashboard: React.FC = () => {
	const [showTransactionTable, setShowTransactionTable] =
		useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

	return (
		<div className="3xl:flex-row flex flex-col gap-8 bg-primary bg-opacity-60 p-8">
			<div className="flex-1">
				<AccountInfo
					selectedDate={selectedDate}
					onDateSelect={setSelectedDate}
					onShowMore={() => setShowTransactionTable(true)}
				/>
			</div>
			<div className="flex-1">
				<h3 className="mb-4 text-xl font-semibold">User Connections</h3>
				<UserGraph />
			</div>
			{showTransactionTable && <TransactionTable selectedDate={selectedDate} />}
		</div>
	);
};

export default Dashboard;
