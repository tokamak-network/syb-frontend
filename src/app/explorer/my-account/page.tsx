'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/button';
import { useTheme } from '@/context';
import { themeStyles } from '@/const';
import { cn } from '@/utils/cn';

type Voucher = {
	address: string;
	timestamp: string;
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

	const [isLoading, setIsLoading] = useState(true);
	const [usersVouched, setUsersVouched] = useState<Voucher[]>([]);
	const [vouchedByMe, setVouchedByMe] = useState<Voucher[]>([]);
	const [proofs, setProofs] = useState<string[]>([]);

	useEffect(() => {
		const fetchAccountData = async () => {
			setIsLoading(true);
			try {
				setTimeout(() => {
					setUsersVouched([
						{ address: '0x1234...5678', timestamp: '2023-07-15 14:30:22' },
						{ address: '0xabcd...efgh', timestamp: '2023-08-22 09:15:43' },
					]);

					setVouchedByMe([
						{ address: '0x9876...5432', timestamp: '2023-06-30 11:45:18' },
						{ address: '0xijkl...mnop', timestamp: '2023-09-05 16:20:37' },
					]);

					setProofs(['Proof1: 0x8f4e2c1a...', 'Proof2: 0x3b7d9e6f...']);

					setIsLoading(false);
				}, 1000);
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
					<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
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
								<div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2"></div>
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
						<h2 className="mb-4 text-xl font-semibold">Users Vouched</h2>
						{usersVouched.length > 0 ? (
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
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{usersVouched.map((user, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.address}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{user.timestamp}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-gray-500">No users vouched yet.</p>
						)}
					</div>

					<div className="mb-8 rounded-lg border p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Users Vouched By Me</h2>
						{vouchedByMe.length > 0 ? (
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
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{vouchedByMe.map((user, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-6 py-4 font-mono">
													{user.address}
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													{user.timestamp}
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
