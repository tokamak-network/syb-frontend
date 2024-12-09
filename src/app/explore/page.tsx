'use client';

import React, { useState } from 'react';

import {
	Button,
	Modal,
	UserActivityLineChart,
	UserGraph,
	ChainActivityTable,
} from '@/components';

const ExplorerPage: React.FC = () => {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<div className="space-y-4 bg-primary p-8">
			<UserGraph />
			<div className="flex justify-between space-x-10">
				<div className="flex w-full flex-col space-y-14 font-narnoor text-[#9E9EA3]">
					<div className="flex flex-col space-y-14 rounded-lg bg-[#1E1F2090] px-2.5 pt-5">
						<span className="text-3xl">Transactions</span>
						<span className="text-xl">
							<span className="text-3xl text-white">1,129,100</span> (24h)
						</span>
					</div>
					<div className="flex flex-col space-y-14 rounded-lg bg-[#1E1F2090] px-2.5 pt-5">
						<span className="text-3xl">Pending transactions</span>
						<span className="text-xl">
							<span className="text-3xl text-white">151</span> (24h)
						</span>
					</div>
				</div>
				<div className="w-full bg-[#1E1F2090]">
					<UserActivityLineChart />
				</div>
			</div>
			<ChainActivityTable />

			<Modal
				content="Please install MetaMask to connect your wallet."
				isOpen={isModalOpen}
				title="MetaMask Not Installed"
				onClose={() => setModalOpen(false)}
			>
				<Button
					className="rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
					onClick={() => {
						window.open(
							'https://chromewebstore.google.com/search/MetaMask',
							'_blank',
						);
					}}
				>
					Add MetaMask
				</Button>
				<Button
					className="rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
					onClick={() => setModalOpen(false)}
				>
					Close
				</Button>
			</Modal>
		</div>
	);
};

export default ExplorerPage;
