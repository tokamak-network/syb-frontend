// app/page.tsx
'use client';

import React from 'react';

import { UserActivityLineChart, ChainActivityTable } from '@/components';

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center px-20">
			<div className="flex w-full justify-between">
				<div className="flex w-full flex-col space-y-14 font-narnoor">
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-primaryText text-3xl">Transactions</p>
						<p className="text-secondaryText text-xl">
							<span className="text-3xl">1,129,100</span> (24h)
						</p>
					</div>
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-primaryText text-3xl">Pending transactions</p>
						<p className="text-secondaryText text-xl">
							<span className="text-3xl">151</span> (24h)
						</p>
					</div>
				</div>
				<div className="w-full">
					<UserActivityLineChart />
				</div>
			</div>
			<ChainActivityTable />
		</div>
	);
};

export default HomePage;
