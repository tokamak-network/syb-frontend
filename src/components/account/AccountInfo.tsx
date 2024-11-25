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
	selectedDate: Date | null;
	onDateSelect: (date: Date | null) => void;
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
				<div className="flex flex-col items-center space-y-10">
					<div className="flex w-full items-center justify-between px-40">
						<Image
							alt="User Avatar"
							height={300}
							src={'/images/avatar/3.png'}
							width={300}
						/>
						{selectedDate && (
							<ActivityDetailsCard
								selectedDate={selectedDate}
								onDateSelect={onDateSelect}
								onShowMore={onShowMore}
							/>
						)}
					</div>
					<div className="flex justify-between space-x-10">
						<AccountDetailsCard
							address={account}
							balance={Number(balance)}
							network={network}
						/>
						<VouchDetailsCard vouches={500} />
						<RankDetailsCard rank={1} score={2.39} totalUsers={8888} />
					</div>
				</div>
			)}
		</>
	);
};
