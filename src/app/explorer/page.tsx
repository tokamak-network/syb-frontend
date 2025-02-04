'use client';

import React, { useState } from 'react';

import {
	Button,
	TransactionDropDown,
	Modal,
	UserActivityLineChart,
} from '@/components';
import transactionData from '@/const/transactions';
import { ActionStatus, ActionType } from '@/types';
import { formatFirstLetter, statusStyles, typeStyles } from '@/utils';

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
			<div className="space-y-8">
				<TransactionDropDown value={txOption} onChange={setTxOption} />
				<div>
					<h2 className="text-2xl">
						{formatFirstLetter(txOption)} Transactions
					</h2>
					<table className="w-full text-left text-sm text-tableTextPrimary">
						<thead className="bg-tableHeader text-xs uppercase text-tableTextSecondary">
							<tr>
								<th className="px-6 py-3" scope="col">
									Transaction Hash
								</th>
								<th className="px-6 py-3" scope="col">
									Type
								</th>
								<th className="px-6 py-3" scope="col">
									Status
								</th>
								<th className="px-6 py-3" scope="col">
									Amount
								</th>
							</tr>
						</thead>
						<tbody className="bg-tableRowBackground">
							{filteredTransactions.map((tx, index) => (
								<tr
									key={tx.txHash}
									className={`${
										index % 2 === 0
											? 'bg-tableRowBackground'
											: 'bg-tableBackground'
									} hover:bg-tableHover`}
								>
									<td className="px-6 py-4 font-medium text-tableTextPrimary">
										{tx.txHash}
									</td>
									<td
										className={`px-6 py-4 ${
											typeStyles[tx.type.txType as ActionType] || ''
										}`}
									>
										{tx.type.txType}
									</td>
									<td
										className={`px-6 py-4 font-bold ${
											statusStyles[tx.type.txStatus as ActionStatus] || ''
										}`}
									>
										{tx.type.txStatus}
									</td>
									<td className="px-6 py-4 text-tableTextPrimary">
										{tx.value}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4">
						<Button
							className="rounded-xl bg-buttonPrimary font-kanit font-bold text-white"
							onClick={() => {
								window.location.href = '/explorer/txs';
							}}
						>
							Show All Transactions
						</Button>
					</div>
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
					className="rounded-xl bg-buttonPrimary font-kanit font-bold text-white"
					onClick={() => setModalOpen(false)}
				>
					Close
				</Button>
			</Modal>
		</div>
	);
};

export default ExplorerPage;
