'use client';

import React, { useState, useEffect } from 'react';
import { UserActivityLineChart, Label } from '@/components';
import { fetchTransactions } from '@/utils/fetch';
import { TransactionResponse } from '@/types';

const HomePage: React.FC = () => {
	const [lastTransaction, setLastTransaction] = useState<string | null>(null);
	const [lastBlock, setLastBlock] = useState<number | null>(null);
	const [lastBlockTime, setLastBlockTime] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getTransactionData = async () => {
			try {
				setIsLoading(true);
				const response: TransactionResponse = await fetchTransactions();

				if (response.transactions && response.transactions.length > 0) {
					const latestTx = response.transactions[0];
					console.log(latestTx, 'latestTx');
					setLastTransaction(latestTx.L1Info.ethereumTxHash);
					if (latestTx.L1Info.ethereumBlockNum) {
						setLastBlock(latestTx.L1Info.ethereumBlockNum);

						if (latestTx.timestamp) {
							const txTime = new Date(latestTx.timestamp);
							const now = new Date();
							const diffInMinutes = Math.floor(
								(now.getTime() - txTime.getTime()) / (1000 * 60),
							);

							setLastBlockTime(
								diffInMinutes < 1
									? 'just now'
									: diffInMinutes === 1
										? '1 min ago'
										: `${diffInMinutes} mins ago`,
							);
						}
					}
				}
			} catch (err) {
				console.error('Failed to fetch transaction data:', err);
				setError('Failed to load transaction data');
			} finally {
				setIsLoading(false);
			}
		};

		getTransactionData();
	}, []);

	return (
		<div className="flex flex-col items-center px-20">
			<div className="flex w-full justify-between space-x-5">
				<div className="flex w-full flex-col space-y-14 font-narnoor">
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-3xl text-primaryText">Last Block</p>
						{isLoading ? (
							<p className="text-xl text-secondaryText">Loading...</p>
						) : error ? (
							<p className="text-xl text-red-500">{error}</p>
						) : (
							<p className="text-xl text-secondaryText">
								<span className="text-3xl">
									#{lastBlock?.toLocaleString() || 'N/A'}
								</span>
								{lastBlockTime && ` (${lastBlockTime})`}
							</p>
						)}
					</div>
					<div className="flex flex-col space-y-14 rounded-lg border-2 border-tableBorder px-2.5 pt-5">
						<p className="text-3xl text-primaryText">Last Transaction</p>
						{isLoading ? (
							<p className="text-xl text-secondaryText">Loading...</p>
						) : error ? (
							<p className="text-xl text-red-500">{error}</p>
						) : (
							<Label
								className="text-3xl text-secondaryText"
								explore={true}
								isTransaction={true}
								navigateToAccount={true}
								shorten="end"
								value={lastTransaction || 'N/A'}
							/>
						)}
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
