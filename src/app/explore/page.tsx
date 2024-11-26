'use client';

import React, { useState } from 'react';
import { PiUserCircleFill } from 'react-icons/pi';

import {
	Button,
	SearchBarComponent,
	Modal,
	UserActivityLineChart,
} from '@/components';
import ChainActivityTable from '@/components/tables/ChainActivity';
import { useWallet } from '@/context/WalletContext';

const ExplorerPage: React.FC = () => {
	const { account, balance, connectWallet, isMetaMaskInstalled } = useWallet();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleConnectWallet = () => {
		if (isMetaMaskInstalled) {
			connectWallet();
		} else {
			setModalOpen(true);
		}
	};

	return (
		<div className="space-y-4 bg-primary p-8">
			<div className="flex items-center space-x-3">
				<SearchBarComponent
					placeholder={'Search by address / txn hash / block / token...'}
				/>
				<PiUserCircleFill size={39} />
				{!account ? (
					<Button
						className="rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
						onClick={handleConnectWallet}
					>
						Connect Wallet
					</Button>
				) : (
					<div className="flex flex-col items-start">
						<span className="font-kanit text-white">{`Account: ${account}`}</span>
						<span className="font-kanit text-white">{`Balance: ${balance} ETH`}</span>
					</div>
				)}
			</div>
			<div className="flex justify-between space-x-10">
				<div className="flex w-full flex-col space-y-14 font-narnoor text-[#9E9EA3]">
					<div className="flex flex-col space-y-14 rounded-lg bg-[#1E1F2090] px-2.5 pt-5">
						<span className="text-3xl">Transactions</span>
						<span className="text-xl">
							<span className="text-3xl text-white">1,129,100</span> (24h)
						</span>
					</div>
					<div className="flex flex-col space-y-14 rounded-lg bg-[#1E1F2090] px-2.5 pt-5">
						<span className="text-3xl">Pending transactions</span>
						<span className="text-xl">
							<span className="text-3xl text-white">151</span> (24h)
						</span>
					</div>
				</div>
				<div className="w-full bg-[#1E1F2090]">
					<UserActivityLineChart />
				</div>
			</div>
			<ChainActivityTable />

			<Modal
				content="Please install MetaMask to connect your wallet."
				isOpen={isModalOpen}
				title="MetaMask Not Installed"
				onClose={() => setModalOpen(false)}
			>
				<Button
					className="rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
					onClick={() => {
						window.open(
							'https://chromewebstore.google.com/search/MetaMask',
							'_blank',
						);
					}}
				>
					Add MetaMask
				</Button>
				<Button
					className="rounded-xl bg-[#1379FF] font-kanit font-bold text-white"
					onClick={() => setModalOpen(false)}
				>
					Close
				</Button>
			</Modal>
		</div>
	);
};

export default ExplorerPage;
