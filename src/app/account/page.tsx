'use client';

import React, { useState } from 'react';

import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components';
import { UserAvatar } from '@/components/account';

const AccountPage: React.FC = () => {
	const { account, balance, connectWallet, isMetaMaskInstalled } = useWallet();
	const [score, setScore] = useState<number>(0);

	const handleConnectWallet = async () => {
		if (isMetaMaskInstalled) {
			try {
				await connectWallet();
			} catch (error) {
				console.error('Failed to connect wallet:', error);
			}
		} else {
			alert(
				'MetaMask is not installed. Please install it to connect your wallet.',
			);
		}
	};

	return (
		<div className="flex w-full flex-col items-center bg-primary pt-8">
			{!account ? (
				<div className="flex flex-col items-center pt-20 text-center text-white">
					<p className="mb-40 font-openSans text-4xl">
						Connect your wallet to see your account information.
					</p>
					<Button
						className="mb-40 rounded bg-blue-500 px-4 py-2 text-white"
						onClick={handleConnectWallet}
					>
						Connect Wallet
					</Button>
				</div>
			) : (
				<div className="mb-20 flex items-center space-x-5 rounded-2xl bg-primary p-4">
					<div className="flex flex-col space-y-10 rounded-lg bg-primary p-4 shadow-md">
						<UserAvatar />
						<div className="flex flex-col space-y-3">
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">Address</h3>
								<p className="text-lg text-white">{account}</p>
							</div>
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">Balance</h3>
								<p className="text-lg text-white">{balance} ETH</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-10 rounded-lg bg-primary p-4 shadow-md">
						<div className="flex flex-col space-y-3">
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">Account ID</h3>
								<p className="text-lg text-white">{'0x123123'}</p>
							</div>
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">
									Account Balance
								</h3>
								<p className="text-lg text-white">{score}</p>
							</div>
						</div>
						<div className="flex flex-col space-y-3">
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">
									Registered Date
								</h3>
								<p className="text-lg text-white">{new Date().toString()}</p>
							</div>
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">
									Last Logged In
								</h3>
								<p className="text-lg text-white">{new Date().toString()}</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountPage;
