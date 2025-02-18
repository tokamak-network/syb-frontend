'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { apiRequest } from '@/utils/api';
import { Button, PageLoader } from '@/components';
import { AccountType } from '@/types';
import { useWallet } from '@/hooks/useWallet';

const AccountDetailsPage: React.FC = () => {
	const { id } = useParams();
	const { isConnected } = useWallet();

	const {
		data: account,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['account', id],
		queryFn: async () => {
			const response: AccountType = await apiRequest({
				method: 'GET',
				url: `/account?id=${id}`,
			});

			return response;
		},
		enabled: !!id,
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
					<p className="text-lg">Account ID: {account.accountIndex}</p>
					<p className="text-lg">Name: {account.name || 'No Name Provided'}</p>
					<div className="relative h-32 w-32 overflow-hidden rounded-full">
						<Image
							alt="User Image"
							fill={true}
							loading="lazy"
							src={account.image || '/images/avatar/default-avatar.png'}
							style={{ objectFit: 'cover' }}
						/>
					</div>
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
