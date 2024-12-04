'use client';

import React from 'react';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components';
import { UserAvatar } from '@/components/account';

const AccountPage: React.FC = () => {
	const {
		connect,
		connectors,
		isConnected,
		address,
		ensName,
		balance,
		isBalanceLoading,
		currencySymbol,
	} = useWallet();

	const handleConnectWallet = async () => {
		connectors.map((connector) => {
			if (connector.name === 'MetaMask') {
				connect({ connector });
			}
		});
	};

	return (
		<div className="flex w-full flex-col items-center bg-primary pt-8">
			{!isConnected ? (
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
								<p className="text-lg text-white">{ensName || address}</p>
							</div>
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">Balance</h3>
								{isBalanceLoading ? (
									<p className="text-lg text-white">Loading...</p>
								) : (
									<p className="text-lg text-white">
										{balance} {currencySymbol}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-10 rounded-lg bg-primary p-4 shadow-md">
						<div className="flex flex-col space-y-3">
							<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
								<h3 className="text-xl font-semibold text-white">Account ID</h3>
								<p className="text-lg text-white">{'0x123123'}</p>
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
