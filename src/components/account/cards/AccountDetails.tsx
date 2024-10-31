//components/cards/AccountDetails.tsx

import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi';

import { Button } from '@/components';

interface AccountDetailsCardProps {
	balance: number;
	address: string;
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
	balance,
	address,
}) => {
	return (
		<div className="flex w-[400px] flex-col space-y-8">
			<div
				className="relative h-[250px] space-y-20 rounded-lg bg-cover bg-center px-2 py-3 shadow-lg"
				style={{ backgroundImage: "url('/images/accountinfo-Eth.png')" }}
			>
				<div className="space-y-10 px-8">
					<p className="font-poppins text-2xl">Balance</p>
					<p className="font-roboto text-3xl">{balance}</p>
				</div>
				<p className="text-center text-xs">{address}</p>
			</div>
			<div className="flex justify-between">
				<Button
					className="min-w-[33%] rounded-lg border-2 border-[#60BC63] text-xl font-semibold text-[#60BC63]"
					leftIcon={FiArrowDownCircle}
				>
					Withdraw
				</Button>
				<Button
					className="rounded-lg border-2 border-[#60BC63] bg-[#60BC63] text-xl font-semibold text-white"
					leftIcon={FiArrowUpCircle}
				>
					Deposit
				</Button>
			</div>
		</div>
	);
};
