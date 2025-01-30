'use client';

import React, { useState } from 'react';

import {
	Button,
	TransactionDropDown,
	Modal,
	UserActivityLineChart,
} from '@/components';
import transactionData from '@/const/transactions';
import { ActionStatus } from '@/types';

const ExplorerPage: React.FC = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [showMoreUsers, setShowMoreUsers] = useState(false);

	const [txOption, setTxOption] = useState('all');

	const filteredTransactions = transactionData.filter((tx) => {
		if (txOption === 'all') return true;
		if (txOption === 'pending')
			return tx.type.txStatus === ActionStatus.PENDING;
		if (txOption === 'forged') return tx.type.txStatus === ActionStatus.SUCCESS;

		return false;
	});

	return (
		<div className="grid grid-cols-2 gap-8 p-8">
			{/* Transactions Column */}
			<div className="space-y-8">
				<TransactionDropDown value={txOption} onChange={setTxOption} />
				<div>
					<h2 className="text-2xl">Filtered Transactions</h2>
					<ul>
						{filteredTransactions.map((tx) => (
							<li key={tx.txHash} className="p-2">
								{tx.txHash}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="space-y-8">
				{/* User Activity Chart */}
				<div className="rounded-lg bg-gray-300 p-5">
					<h2 className="text-3xl">User Activity</h2>
					<UserActivityLineChart />
				</div>

				{/* Top Users */}
				<div className="rounded-lg bg-gray-300 p-5">
					<h2 className="text-3xl">Top Users</h2>
					<Button
						className="mt-4 rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
						onClick={() => setShowMoreUsers(!showMoreUsers)}
					>
						{showMoreUsers ? 'Show Less Users' : 'Show More Users'}
					</Button>
				</div>
			</div>

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
