'use client';

import React from 'react';

import { UserActivityLineChart, Label } from '@/components';

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center px-20">
			<div className="flex w-full justify-between space-x-5">
				<div className="flex w-full flex-col space-y-14 font-narnoor">
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-3xl text-primaryText">Last Block</p>
						<p className="text-xl text-secondaryText">
							<span className="text-3xl">#12,345,678</span> (2 mins ago)
						</p>
					</div>
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-3xl text-primaryText">Last Transaction</p>
						<Label
							className="text-3xl text-secondaryText"
							explore={true}
							isTransaction={true}
							navigateToAccount={true}
							shorten="end"
							value={
								'0xe8b37530878af405094880bae8852e4628d494937ce873c7a9f1c9af82e911cb'
							}
						/>
					</div>
				</div>
				<div className="w-full">
					<UserActivityLineChart />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
