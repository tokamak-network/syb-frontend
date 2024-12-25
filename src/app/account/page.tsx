'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button, SearchBarComponent } from '@/components';
import { useWallet } from '@/hooks/useWallet'; // Import the useWallet hook

const AccountPage: React.FC = () => {
	const router = useRouter();
	const { isConnected } = useWallet(); // Get MetaMask connection status from useWallet
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [accounts, setAccounts] = useState<
		{
			id: string;
			vouchesGiven: number;
			vouchesReceived: number;
			score: number;
		}[]
	>([]);

	// Mock data for accounts
	const mockAccounts = [
		{ id: '0x123', vouchesGiven: 10, vouchesReceived: 15, score: 85 },
		{ id: '0x456', vouchesGiven: 5, vouchesReceived: 8, score: 80 },
		{ id: '0x789', vouchesGiven: 7, vouchesReceived: 10, score: 90 },
		{ id: '0xabc', vouchesGiven: 2, vouchesReceived: 2, score: 70 },
	];

	useEffect(() => {
		// Simulate fetching accounts from an API
		setAccounts(mockAccounts);
	}, []);

	// Filter accounts based on the search query
	const filteredAccounts = accounts.filter((account) =>
		account.id.toLowerCase().includes(searchQuery.toLowerCase()),
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
				<thead className="bg-tableHeader font-abhaya text-tableTextPrimary">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							User ID
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Vouches Given
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Vouches Received
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Score
						</th>
						{isConnected && (
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Action
							</th>
						)}
					</tr>
				</thead>
				<tbody className="bg-tableBackground font-abhaya">
					{filteredAccounts.map((account) => (
						<tr
							key={account.id}
							className={`border-b-2 border-tableBorder bg-tableBackground font-abhaya text-gray-700 transition-colors duration-300 hover:bg-tableHover`}
							onClick={() => router.push(`/account/${account.id}`)}
						>
							<td className="px-6 py-2 text-left font-normal">{account.id}</td>
							<td className="px-6 py-2 text-left font-normal">
								{account.vouchesGiven}
							</td>
							<td className="px-6 py-2 text-left font-normal">
								{account.vouchesReceived}
							</td>
							<td className="px-6 py-2 text-left font-normal">
								{account.score}
							</td>
							{isConnected && (
								<td className="flex flex-col space-y-4 whitespace-nowrap px-6 py-2 text-left font-normal">
									<Button
										className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
										onClick={(e) => {
											e.stopPropagation();
											alert(`Vouching for ${account.id}`);
										}}
									>
										Vouch
									</Button>
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
