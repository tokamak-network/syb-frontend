'use client';

import React, { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useReadContract } from 'wagmi';
import { ethers } from 'ethers';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/button';
import { useTheme } from '@/context';
import { themeStyles } from '@/const';
import { cn } from '@/utils/cn';
import { useVouchData } from '@/hooks/useVouchData';
import { SybilSepoliaABI, contracts } from '@/contracts';
import { formatEthAddress } from '@/utils';

type Voucher = {
	address: string;
	timestamp: string;
	txHash: string;
};

const MyAccountPage: React.FC = () => {
	const {
		isConnected,
		address,
		balance,
		currencySymbol,
		chain,
		isBalanceLoading,
	} = useWallet();
	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];
	const { useVouchersFor, useAddressesVouchedFor } = useVouchData();

	const [isLoading, setIsLoading] = useState(true);
	const [allAccounts, setAllAccounts] = useState<string[]>([]);
	const [proofs, setProofs] = useState<string[]>([]);

	// Read the user's contract balance (deposited amount)
	const { data: contractBalance, isLoading: isContractBalanceLoading } =
		useReadContract({
			address: formatEthAddress(
				contracts.sybilSepolia.address,
			) as `0x${string}`,
			abi: SybilSepoliaABI,
			functionName: 'accountInfo',
			args: address ? [address] : undefined,
		});

	// Format the deposited amount to ETH
	const formattedDepositAmount = contractBalance
		? ethers.utils.formatEther(contractBalance.toString())
		: '0';

	useEffect(() => {
		setAllAccounts([
			'0xC0dFB22a00F12123B257d97033a93C0580a7f5a1',
			'0x83D6C639AC4CB3833d60b3CB4dbCd234baBD501D',
			'0x9876543210987654321098765432109876543210',
			'0xfedcbafedcbafedcbafedcbafedcbafedcbafeed',
		]);
		setIsLoading(false);
	}, []);

	const {
		vouchers,
		vouchersWithTx,
		isLoading: isVouchersLoading,
		error: vouchersError,
	} = useVouchersFor(address || '', allAccounts);

	const {
		vouchedAddresses,
		vouchedWithTx,
		isLoading: isVouchedLoading,
		error: vouchedError,
	} = useAddressesVouchedFor(address || '', allAccounts);

	const getExplorerUrl = (txHash: string) => {
		const explorerBaseUrl = 'https://sepolia.etherscan.io/tx/';

		return `${explorerBaseUrl}${txHash}`;
	};

	const usersVouchedForMe = vouchersWithTx;
	const usersIVouchedFor = vouchedWithTx;

	useEffect(() => {
		const fetchAccountData = async () => {
			setIsLoading(true);
			try {
				setProofs(['Proof1: 0x8f4e2c1a...', 'Proof2: 0x3b7d9e6f...']);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching account data:', error);
				setIsLoading(false);
			}
		};

		if (isConnected && address) {
			fetchAccountData();
		} else {
			setIsLoading(false);
		}
	}, [isConnected, address]);

	if (!isConnected) {
		return (
			<div className="container mx-auto mt-24 p-6">
				<div className="rounded-lg border p-8 text-center shadow-md">
					<h1 className="mb-4 text-2xl font-bold">My Account</h1>
					<p className="mb-6 text-lg">
						Please connect your wallet to view account details.
					</p>
					<Button
						className={cn(
							`px-6 py-2 font-medium`,
							currentThemeStyles.buttonBg,
							currentThemeStyles.buttonText,
						)}
					>
						Connect Wallet
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto mt-24 p-6">
			<h1 className="mb-6 text-3xl font-bold">My Account</h1>

			{isLoading ? (
				<div className="flex justify-center p-10">
					<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2" />
				</div>
			) : (
				<>
					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Account Address</h2>
						<div
							className={cn(
								'break-all rounded p-4 font-mono',
								currentThemeStyles.background,
								currentThemeStyles.text,
								currentThemeStyles.borderColor,
							)}
						>
							{address}
						</div>
					</div>

					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Account Balance</h2>
						<div
							className={cn(
								'rounded p-4 font-mono',
								currentThemeStyles.background,
								currentThemeStyles.text,
								currentThemeStyles.borderColor,
							)}
						>
							{isBalanceLoading ? (
								<div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2" />
							) : (
								<>
									{balance}{' '}
									{currencySymbol || chain?.nativeCurrency?.symbol || 'ETH'}
									{chain && (
										<div className="mt-2 text-sm text-gray-500">
											Network: {chain.name}
										</div>
									)}
								</>
							)}
						</div>
					</div>

					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Deposited Amount</h2>
						<div
							className={cn(
								'rounded p-4 font-mono',
								currentThemeStyles.background,
								currentThemeStyles.text,
								currentThemeStyles.borderColor,
							)}
						>
							{isContractBalanceLoading ? (
								<div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2" />
							) : (
								<>
									{formattedDepositAmount}{' '}
									{currencySymbol || chain?.nativeCurrency?.symbol || 'ETH'}
									{contractBalance &&
									BigInt(contractBalance.toString()) > BigInt(0) ? (
										<div className="mt-2 text-sm text-green-500">
											You have funds deposited in the contract
										</div>
									) : (
										<div className="mt-2 text-sm text-yellow-500">
											You haven&apos;t deposited any funds yet
										</div>
									)}
								</>
							)}
						</div>
					</div>

					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Users I Vouched For</h2>
						{isVouchedLoading ? (
							<div className="flex justify-center p-4">
								<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2" />
							</div>
						) : vouchedError ? (
							<p className="text-red-500">
								Error loading vouch data: {vouchedError.message}
							</p>
						) : usersIVouchedFor.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Address
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Timestamp
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Transaction
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{usersIVouchedFor.map((user, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.address}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{user.timestamp}
												</td>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.txHash ? (
														<a
															className="inline-flex items-center text-blue-500 hover:text-blue-700 hover:underline"
															href={getExplorerUrl(user.txHash)}
															rel="noopener noreferrer"
															target="_blank"
														>
															{user.txHash.substring(0, 10)}...
															<FiExternalLink className="ml-1" />
														</a>
													) : (
														<span className="text-gray-400">
															No transaction data
														</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-gray-500">
								You haven&apos;t vouched for any users yet.
							</p>
						)}
					</div>

					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">
							Users Who Vouched For Me
						</h2>
						{isVouchersLoading ? (
							<div className="flex justify-center p-4">
								<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2" />
							</div>
						) : vouchersError ? (
							<p className="text-red-500">
								Error loading vouch data: {vouchersError.message}
							</p>
						) : usersVouchedForMe.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Address
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Timestamp
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
												Transaction
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{usersVouchedForMe.map((user, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.address}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{user.timestamp}
												</td>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.txHash ? (
														<a
															className="inline-flex items-center text-blue-500 hover:text-blue-700 hover:underline"
															href={getExplorerUrl(user.txHash)}
															rel="noopener noreferrer"
															target="_blank"
														>
															{user.txHash.substring(0, 10)}...
															<FiExternalLink className="ml-1" />
														</a>
													) : (
														<span className="text-gray-400">
															No transaction data
														</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-gray-500">
								No users have vouched for you yet.
							</p>
						)}
					</div>

					<div className="rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Proofs</h2>
						{proofs.length > 0 ? (
							<ul className="space-y-2">
								{proofs.map((proof, index) => (
									<li
										key={index}
										className={cn(
											'rounded p-3 font-mono text-sm',
											currentThemeStyles.background,
											currentThemeStyles.text,
											currentThemeStyles.borderColor,
										)}
									>
										{proof}
									</li>
								))}
							</ul>
						) : (
							<p className="text-gray-500">No proofs available.</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default MyAccountPage;
