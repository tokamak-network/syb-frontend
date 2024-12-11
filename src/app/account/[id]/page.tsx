'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components';
import {
	VouchDetailsCard,
	AccountDetailsCard,
} from '@/components/account/cards';

const AccountDetailsPage: React.FC = () => {
	const { id } = useParams();
	const { address, balance } = useWallet();

	const isConnectedAccount = address === undefined ? true : false;

	return (
		<div className="space-y-4 p-8">
			<div className="flex flex-col items-center space-y-4">
				<h1 className="text-3xl font-bold">Account Details</h1>
				<p className="text-lg">Account: {id}</p>
				{!isConnectedAccount && (
					<Button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
						Vouch
					</Button>
				)}
			</div>
			{address && balance && (
				<div className="flex flex-col space-y-4">
					<AccountDetailsCard
						address={id as string}
						balance={Number(balance)}
						network="Ethereum"
					/>
					<VouchDetailsCard vouches={10} />
				</div>
			)}
		</div>
	);
};

export default AccountDetailsPage;
