'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { UserActivityLineChart, Label } from '@/components';
import { fetchTransactions, fetchAccounts } from '@/utils';
import { TransactionResponse, AccountsResponse } from '@/types';
import { AccountNetworkGraph } from '@/components/graphs';

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

					setLastTransaction(latestTx.tx_hash || 'N/A');
					if (latestTx.block_number) {
						setLastBlock(latestTx.block_number);

						if (latestTx.timestamp) {
							const txTime = new Date(latestTx.timestamp * 1000);
							const now = new Date();
							const diffInMs = now.getTime() - txTime.getTime();

							// Calculate days, hours, minutes
							const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
							const days = Math.floor(diffInMinutes / (60 * 24));
							const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
							const minutes = diffInMinutes % 60;

							// Format the time string
							if (diffInMinutes < 1) {
								setLastBlockTime('just now');
							} else {
								let timeString = '';

								if (days > 0) {
									timeString += `${days} ${days === 1 ? 'day' : 'days'} `;
								}

								if (hours > 0 || days > 0) {
									timeString += `${hours} ${hours === 1 ? 'hour' : 'hours'} `;
								}

								if (minutes > 0 || (days === 0 && hours === 0)) {
									timeString += `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
								}

								setLastBlockTime(`${timeString.trim()} ago`);
							}
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
		<div className="w-full space-y-10">
			<section className="w-full rounded-xl border border-tableBorder bg-background p-5">
				<h2 className="mb-5 text-2xl font-semibold text-primaryText">
					Network Activity
				</h2>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					<div className="flex h-[350px] flex-col justify-between">
						<div className="rounded-lg border border-tableBorder bg-tableBackground p-4">
							<p className="text-lg font-medium text-primaryText">Last Block</p>
							{isLoading ? (
								<p className="mt-2 text-secondaryText">Loading...</p>
							) : error ? (
								<p className="mt-2 text-red-500">{error}</p>
							) : (
								<p className="mt-2">
									<span className="text-2xl font-semibold text-primaryText">
										#{lastBlock?.toLocaleString() || 'N/A'}
									</span>
									{lastBlockTime && (
										<span className="ml-1 text-secondaryText">
											({lastBlockTime})
										</span>
									)}
								</p>
							)}
						</div>
						<div className="rounded-lg border border-tableBorder bg-tableBackground p-4">
							<p className="text-lg font-medium text-primaryText">
								Last Transaction
							</p>
							{isLoading ? (
								<p className="mt-2 text-secondaryText">Loading...</p>
							) : error ? (
								<p className="mt-2 text-red-500">{error}</p>
							) : (
								<Label
									className="mt-2 text-xl text-primaryText"
									explore={false}
									isTransaction={true}
									navigateToAccount={true}
									shorten="middle"
									value={lastTransaction || 'N/A'}
								/>
							)}
						</div>
					</div>
					{/* Chart */}
					<div className="md:col-span-2">
						<div className="h-full rounded-lg border border-tableBorder bg-tableBackground p-3">
							<UserActivityLineChart />
						</div>
					</div>
				</div>
			</section>

			<section className="w-full rounded-xl border border-tableBorder bg-background p-5">
				<HomeNetworkGraph />
			</section>
		</div>
	);
};

export default HomePage;

const HomeNetworkGraph: React.FC = () => {
	const { data, isLoading, error } = useQuery<AccountsResponse>({
		queryKey: ['accounts'],
		queryFn: fetchAccounts,
		staleTime: 30000,
		refetchInterval: 30000,
	});

	if (isLoading) return null;
	if (error || !data?.accounts) return null;

	return (
		<div className="mt-8">
			<p className="mb-3 text-3xl font-semibold text-primaryText">
				Account Network
			</p>
			<AccountNetworkGraph
				mode="global"
				accounts={data.accounts}
				height={560}
				className="bg-gradient-to-b from-slate-900/40 to-slate-800/40"
			/>
		</div>
	);
};
