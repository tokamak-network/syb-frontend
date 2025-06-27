'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader, SearchBarComponent } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { apiRequest } from '@/utils/api';
import { Account, AccountsResponse } from '@/types';

const AccountPage: React.FC = () => {
	const router = useRouter();
	const { isConnected, address } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const { data: accountResponse, isLoading } = useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response: AccountsResponse = await apiRequest({
				method: 'GET',
				url: '/accounts',
			});

			return response;
		},
	});

	// Function to update score - will be connected to smart contract later
	const updateScore = async (accountAddress: string) => {
		try {
			alert(`Updating score for ${accountAddress}`);
		} catch (error) {
			console.error('Error updating score:', error);
		}
	};

	if (isLoading) return <PageLoader />;

	const filteredAccounts = accountResponse?.accounts.filter(
		(account: Account) =>
			account.idx.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col items-center space-y-12 p-6">
			{/* Search Bar */}
			<SearchBarComponent
				placeholder="Search accounts by ID..."
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{/* Account List Table */}
			<table className="min-w-full table-auto rounded-lg">
				<thead className="font-abhaya bg-tableHeader text-tableTextPrimary">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Account ID
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Account Address
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Balance
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Score
						</th>
						{isConnected && (
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody className="font-abhaya bg-tableBackground">
					{filteredAccounts &&
						filteredAccounts.map((account: Account) => (
							<tr
								key={account.idx}
								className={`font-abhaya border-b-2 border-tableBorder bg-tableBackground text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover`}
								onClick={() => router.push(`/explorer/accounts/${account.idx}`)}
							>
								<td className="px-6 py-2 text-left font-normal">
									{account.idx}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{account.eth_addr}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{account.balance}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{account.score}
								</td>
								{isConnected && (
									<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
										<div className="flex space-x-2">
											<Button
												className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
												onClick={(e) => {
													e.stopPropagation();
													alert(`Vouching for ${account.idx}`);
												}}
												disabled={
													address?.toLowerCase() ===
													account.eth_addr.toLowerCase()
												}
											>
												Vouch
											</Button>
											<Button
												className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
												onClick={(e) => {
													e.stopPropagation();
													updateScore(account.eth_addr);
												}}
											>
												Update Score
											</Button>
										</div>
									</td>
								)}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default AccountPage;
