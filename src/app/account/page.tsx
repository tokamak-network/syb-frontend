'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader, SearchBarComponent } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { apiRequest } from '@/utils/api';
import { AccountType } from '@/types';

const AccountPage: React.FC = () => {
	const router = useRouter();
	const { isConnected } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const { data: accounts, isLoading } = useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response: AccountType[] = await apiRequest({
				method: 'GET',
				url: '/account',
			});

			return response;
		},
	});

	if (isLoading) return <PageLoader />;

	// Filter accounts based on the search query
	const filteredAccounts = accounts?.filter((account: any) =>
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
							Name
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							User Image
						</th>
						{isConnected && (
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Action
							</th>
						)}
					</tr>
				</thead>
				<tbody className="bg-tableBackground font-abhaya">
					{filteredAccounts &&
						filteredAccounts.map((account: AccountType) => (
							<tr
								key={account.accountIndex}
								className={`border-b-2 border-tableBorder bg-tableBackground font-abhaya text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover`}
								onClick={() => router.push(`/account/${account.accountIndex}`)}
							>
								<td className="px-6 py-2 text-left font-normal">
									{account.accountIndex}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{account.name || 'Default User'}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									<div className="relative h-16 w-16 overflow-hidden rounded-full">
										<Image
											alt="User Image"
											fill={true}
											loading="lazy"
											src={account.image as string}
											style={{ objectFit: 'cover' }}
										/>
									</div>
								</td>
								{isConnected && (
									<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
										<Button
											className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
											onClick={(e) => {
												e.stopPropagation();
												alert(`Vouching for ${account.accountIndex}`);
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
