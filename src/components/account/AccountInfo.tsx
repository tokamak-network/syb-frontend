'use client';

import React from 'react';

import {
	AccountDetailsCard,
	VouchDetailsCard,
	RankDetailsCard,
	ActivityDetailsCard,
} from './cards';

import { useWallet } from '@/context/WalletContext';

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
	const { account, balance } = useWallet();

	return (
		<div className="flex flex-col space-y-5">
			<p className="text-4xl">Account Information</p>
			<div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
				{balance && account && (
					<>
						<AccountDetailsCard address={account} balance={Number(balance)} />
						<VouchDetailsCard vouches={500} />
						<RankDetailsCard rank={1} score={2.39} totalUsers={8888} />
						<ActivityDetailsCard
							selectedDate={selectedDate}
							onDateSelect={onDateSelect}
							onShowMore={onShowMore}
						/>
					</>
				)}
			</div>
		</div>
	);
};
