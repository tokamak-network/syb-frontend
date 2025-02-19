'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { apiRequest } from '@/utils/api';
import { Button, PageLoader } from '@/components';
import { Account } from '@/types';
import { useWallet } from '@/hooks/useWallet';
import { fetchAccountByID } from '@/utils';

const AccountDetailsPage: React.FC = () => {
	const params = useParams();
	const id = decodeURIComponent(params.ethaddress as string);
	const { isConnected } = useWallet();

	const {
		data: account,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['account', id],
		queryFn: () => fetchAccountByID(id as string),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: !!id,
	});

	console.log(account, 'account');

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
					<p className="text-lg">Account ID: {account.accountIndex}</p>
					<p className="text-lg">
						Ethereum Address: {account.tonEthereumAddress}
					</p>
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
