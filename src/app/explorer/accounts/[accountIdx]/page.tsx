'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Button, PageLoader } from '@/components';
import { useWallet, useScoreUpdate, useSepoliaTransactions } from '@/hooks';
import { fetchAccountByID } from '@/utils';

const AccountDetailsPage: React.FC = () => {
	const params = useParams();
	const accountIdx = decodeURIComponent(params.accountIdx as string);
	const { isConnected, address } = useWallet();
	const { handleUpdateScore } = useScoreUpdate();
	const { handleVouch } = useSepoliaTransactions();
	const [isUpdatingScore, setIsUpdatingScore] = useState(false);
	const [isVouching, setIsVouching] = useState(false);

	const {
		data: account,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['account', accountIdx],
		queryFn: () => fetchAccountByID(accountIdx as string),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: !!accountIdx,
	});

	const onUpdateScore = async () => {
		if (!account) return;

		try {
			setIsUpdatingScore(true);

			const newScore = (account.score ? parseInt(account.score) : 0) + 1;

			const hash = await handleUpdateScore(account.eth_addr, newScore);

			console.log('Score updated successfully:', hash);
			await refetch();
		} catch (error) {
			console.error('Failed to update score:', error);
		} finally {
			setIsUpdatingScore(false);
		}
	};

	const onVouch = async () => {
		if (!account) return;

		try {
			setIsVouching(true);
			const hash = await handleVouch(account.eth_addr);
			console.log('Vouched successfully:', hash);
			await refetch();
		} catch (error) {
			console.error('Failed to vouch:', error);
		} finally {
			setIsVouching(false);
		}
	};

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
					<p className="text-lg">Score: {account.score}</p>
					{isConnected && (
						<div className="flex space-x-4">
							<Button
								className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
								onClick={onVouch}
								disabled={
									isVouching ||
									address?.toLowerCase() === account.eth_addr.toLowerCase()
								}
							>
								{isVouching ? 'Vouching...' : 'Vouch'}
							</Button>
							<Button
								className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
								onClick={onUpdateScore}
								disabled={isUpdatingScore}
							>
								{isUpdatingScore ? 'Updating...' : 'Update Score'}
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AccountDetailsPage;
