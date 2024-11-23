'use client';

import React from 'react';
import Image from 'next/image';

import { useWallet } from '@/context/WalletContext';

import {
	AccountDetailsCard,
	VouchDetailsCard,
	RankDetailsCard,
	ActivityDetailsCard,
} from './cards';

interface AccountInfoProps {
	onShowMore: () => void;
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
	onShowMore,
	selectedDate,
	onDateSelect,
}) => {
	const { account, balance, network } = useWallet();

	return (
		<>
			{balance && account && network && (
				<div className="flex items-center justify-between space-x-5 px-52">
					<div className="flex flex-col items-center space-y-4">
						<Image
							alt="User Avatar"
							height={300}
							src={'/images/avatar/3.png'}
							width={300}
						/>
						<AccountDetailsCard
							address={account}
							balance={Number(balance)}
							network={network}
						/>
					</div>
					<div className="flex flex-col">
						<VouchDetailsCard vouches={500} />
						<RankDetailsCard rank={1} score={2.39} totalUsers={8888} />
					</div>
					<ActivityDetailsCard
						selectedDate={selectedDate}
						onDateSelect={onDateSelect}
						onShowMore={onShowMore}
					/>
				</div>
			)}
		</>
	);
};
