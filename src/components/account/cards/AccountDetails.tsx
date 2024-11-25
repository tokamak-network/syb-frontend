//components/cards/AccountDetails.tsx
'use client';

import { useState } from 'react';
import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi';

import { Button } from '@/components';
import { DepositModal } from '@/components/modal';

interface AccountDetailsCardProps {
	balance: number;
	address: string;
	network: string;
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
	balance,
	address,
	network,
}) => {
	const [isDepositModalOpen, setDepositModalOpen] = useState<boolean>(false);

	const handleDeposit = (amount: number) => {
		console.log(`Deposited ${amount} ETH`);
	};

	return (
		<div className="flex flex-col space-y-8 rounded-3xl border-2 border-white border-opacity-50 p-4">
			<div className="border-3 relative space-y-10 rounded-lg border-white/40 px-2 py-3 shadow-lg">
				<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md duration-200 hover:cursor-default hover:bg-secondary">
					<h3 className="text-xl font-semibold text-white">Address</h3>
					<p className="text-lg text-white">{address}</p>
				</div>
				<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md duration-200 hover:cursor-default hover:bg-secondary">
					<h3 className="text-xl font-semibold text-white">Balance</h3>
					<p className="text-lg text-white">{balance}</p>
				</div>
			</div>
			<div className="flex justify-between">
				<Button
					className="min-w-[33%] rounded-lg border-2 border-white border-opacity-50 text-xl font-semibold"
					leftIcon={FiArrowDownCircle}
				>
					Withdraw
				</Button>
				<Button
					className="min-w-[33%] rounded-lg border-2 border-white border-opacity-50 text-xl font-semibold"
					leftIcon={FiArrowUpCircle}
					onClick={() => setDepositModalOpen(true)}
				>
					Deposit
				</Button>
			</div>
			<DepositModal
				isOpen={isDepositModalOpen}
				network={network}
				onClose={() => setDepositModalOpen(false)}
				onDeposit={handleDeposit}
			/>
		</div>
	);
};
