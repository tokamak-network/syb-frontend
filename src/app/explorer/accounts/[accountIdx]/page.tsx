'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { fetchAccountByAddress, fetchAccountByID } from '@/utils';

const AccountDetailsPage: React.FC = () => {
	const params = useParams();
	const accountIdx = decodeURIComponent(params.accountIdx as string);
	const { isConnected } = useWallet();

	const {
		data: account,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['account', accountIdx],
		queryFn: () => fetchAccountByID(accountIdx as string),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: !!accountIdx,
	});

	if (isError) {
		return (
			<div className="p-8 text-center">Error loading account details.</div>
		);
	}

	return (
		<div className="space-y-4 p-8">
			{isLoading && <PageLoader />}
			{account && (
				<div className="flex flex-col items-center space-y-4">
					<h1 className="text-3xl font-bold">Account Details</h1>
					<p className="text-lg">Account ID: {account.idx}</p>
					<p className="text-lg">Ethereum Address: {account.eth_addr}</p>
					<p className="text-lg">Balance: {account.balance}</p>
					{isConnected && (
						<Button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
							Vouch
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default AccountDetailsPage;
