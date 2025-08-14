'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiArrowUp, FiThumbsUp, FiCopy } from 'react-icons/fi';
import { BiCoin, BiMedal } from 'react-icons/bi';
import { IoArrowBackSharp } from 'react-icons/io5';
import Jazzicon from 'react-jazzicon';

import { Button, PageLoader } from '@/components';
import { AccountNetworkGraph } from '@/components/graphs';
import { useWallet, useScoreUpdate, useSepoliaTransactions } from '@/hooks';
import { useVouchData } from '@/hooks/useVouchData';
import { fetchAccountByID, fetchAccounts } from '@/utils';
import { cn } from '@/utils/cn';
import { useTheme } from '@/context';
import { themeStyles } from '@/const/themeStyles';

const AccountDetailsPage: React.FC = () => {
	const params = useParams();
	const router = useRouter();
	const accountIdx = decodeURIComponent(params.accountIdx as string);
	const { isConnected, address } = useWallet();
	const { handleUpdateScore } = useScoreUpdate();
	const { handleVouch } = useSepoliaTransactions();
	const [isUpdatingScore, setIsUpdatingScore] = useState(false);
	const [isVouching, setIsVouching] = useState(false);
	const [copied, setCopied] = useState(false);
	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];
	const [screenWidth, setScreenWidth] = useState<number>(0);

	useEffect(() => {
		setScreenWidth(window.innerWidth);

		// Update on resize
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const {
		data: account,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['account', accountIdx],
		queryFn: () => fetchAccountByID(accountIdx as string),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: !!accountIdx,
	});

	const { data: accountsData } = useQuery({
		queryKey: ['accounts'],
		queryFn: fetchAccounts,
		staleTime: 30000,
		refetchInterval: 30000,
	});

	const allAccountAddresses = useMemo(() => {
		if (!accountsData?.accounts) return [];

		return accountsData.accounts
			.map((acc: any) => acc.eth_addr)
			.filter(Boolean);
	}, [accountsData]);

	const avatarSeed = useMemo(() => {
		if (!account?.eth_addr) return 0;

		return parseInt(account.eth_addr.slice(2, 10), 16);
	}, [account?.eth_addr]);

	const onUpdateScore = async () => {
		if (!account) return;

		try {
			setIsUpdatingScore(true);

			const newScore = (account.score ? parseInt(account.score) : 0) + 1;

			const hash = await handleUpdateScore(account.eth_addr, newScore);

			console.log('Score updated successfully:', hash);
			await refetch();
		} catch (error) {
			console.error('Failed to update score:', error);
		} finally {
			setIsUpdatingScore(false);
		}
	};

	const onVouch = async () => {
		if (!account) return;

		try {
			setIsVouching(true);
			const hash = await handleVouch(account.eth_addr);

			console.log('Vouched successfully:', hash);
			await refetch();
		} catch (error) {
			console.error('Failed to vouch:', error);
		} finally {
			setIsVouching(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const truncateAddress = (address: string) => {
		if (!address) return '';

		if (screenWidth < 400) {
			return `${address.slice(0, 4)}...${address.slice(-4)}`;
		} else if (screenWidth < 640) {
			return `${address.slice(0, 6)}...${address.slice(-4)}`;
		} else if (screenWidth < 768) {
			return `${address.slice(0, 8)}...${address.slice(-6)}`;
		} else if (screenWidth < 1024) {
			return `${address.slice(0, 10)}...${address.slice(-8)}`;
		} else {
			return `${address.slice(0, 14)}...${address.slice(-12)}`;
		}
	};

	const getCardBg = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/90';
			case 'dark':
				return 'bg-gray-800/80';
			case 'dim':
				return 'bg-gray-700/80';
			default:
				return 'bg-gray-800/80';
		}
	};

	const getHeaderBg = () => {
		switch (theme) {
			case 'light':
				return 'bg-gradient-to-br from-gray-100/90 to-gray-200/90';
			case 'dark':
				return 'bg-gradient-to-br from-gray-800/80 to-gray-900/80';
			case 'dim':
				return 'bg-gradient-to-br from-gray-700/80 to-gray-800/80';
			default:
				return 'bg-gradient-to-br from-gray-800/80 to-gray-900/80';
		}
	};

	const getIconBgColor = (color: string) => {
		switch (theme) {
			case 'light':
				return color === 'blue' ? 'bg-blue-100' : 'bg-purple-100';
			case 'dark':
				return color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20';
			case 'dim':
				return color === 'blue' ? 'bg-blue-400/20' : 'bg-purple-400/20';
			default:
				return color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20';
		}
	};

	const getIconColor = (color: string) => {
		switch (theme) {
			case 'light':
				return color === 'blue' ? 'text-blue-600' : 'text-purple-600';
			case 'dark':
				return color === 'blue' ? 'text-blue-400' : 'text-purple-400';
			case 'dim':
				return color === 'blue' ? 'text-blue-300' : 'text-purple-300';
			default:
				return color === 'blue' ? 'text-blue-400' : 'text-purple-400';
		}
	};

	const handleBack = () => {
		router.push('/explorer/accounts');
	};

	// Custom components for voucher display
	const AccountVouchedUsers: React.FC = () => {
		const { useAddressesVouchedFor } = useVouchData();
		const [vouchedAddresses, setVouchedAddresses] = useState<string[]>([]);

		const {
			vouchedAddresses: fetchedAddresses,
			isLoading,
			error,
		} = useAddressesVouchedFor(account?.eth_addr || '', allAccountAddresses);

		useEffect(() => {
			if (fetchedAddresses) {
				setVouchedAddresses(fetchedAddresses);
			}
		}, [fetchedAddresses]);

		if (isLoading) {
			return <div className="animate-pulse">Loading vouched users...</div>;
		}

		if (error) {
			return <div className="text-red-500">Error: {error.message}</div>;
		}

		if (vouchedAddresses.length === 0) {
			return <div>This account hasn&apos;t vouched for any users yet.</div>;
		}

		return (
			<div>
				<ul className="space-y-2">
					{vouchedAddresses.map((address) => (
						<li key={address} className="rounded-md border p-2">
							<span className="font-mono">{address}</span>
						</li>
					))}
				</ul>
			</div>
		);
	};

	const AccountUsersWhoVouched: React.FC = () => {
		const { useVouchersFor } = useVouchData();
		const [vouchers, setVouchers] = useState<string[]>([]);

		const {
			vouchers: fetchedVouchers,
			isLoading,
			error,
		} = useVouchersFor(account?.eth_addr || '', allAccountAddresses);

		useEffect(() => {
			if (fetchedVouchers) {
				setVouchers(fetchedVouchers);
			}
		}, [fetchedVouchers]);

		if (isLoading) {
			return (
				<div className="animate-pulse">
					Loading users who vouched for this account...
				</div>
			);
		}

		if (error) {
			return <div className="text-red-500">Error: {error.message}</div>;
		}

		if (vouchers.length === 0) {
			return <div>No users have vouched for this account yet.</div>;
		}

		return (
			<div>
				<ul className="space-y-2">
					{vouchers.map((address) => (
						<li key={address} className="rounded-md border p-2">
							<span className="font-mono">{address}</span>
						</li>
					))}
				</ul>
			</div>
		);
	};

	if (isError) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<div className="rounded-xl bg-red-500/10 p-8 text-center backdrop-blur-sm">
					<h2 className="text-xl font-bold text-red-500">Error</h2>
					<p className={`mt-2 ${currentThemeStyles.text}`}>
						Failed to load account details. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`container mx-auto max-w-4xl px-4 py-12 ${currentThemeStyles.text}`}
		>
			{/* Back button */}
			<div className="mb-4">
				<Button
					className="inline-flex w-auto items-center hover:underline"
					leftIcon={IoArrowBackSharp}
					onClick={handleBack}
				>
					Back to Accounts List
				</Button>
			</div>

			{isLoading ? (
				<PageLoader />
			) : (
				account && (
					<div className="space-y-8">
						<div
							className={`flex flex-col items-center space-y-6 rounded-2xl ${getHeaderBg()} p-8 text-center shadow-xl backdrop-blur-md`}
						>
							<div className="relative">
								<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur" />
								<div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-gray-800 bg-gray-700">
									<Jazzicon diameter={112} seed={avatarSeed} />
								</div>
							</div>

							<div>
								<h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
									Account #{account.idx}
								</h1>
								<div className="mt-4 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
									<div className="group relative flex items-center">
										<p
											className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
										>
											{truncateAddress(account.eth_addr)}
										</p>
										<button
											className={`ml-2 rounded-full p-1.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} transition-colors hover:bg-gray-700 hover:text-white`}
											title="Copy address"
											onClick={() => copyToClipboard(account.eth_addr)}
										>
											<FiCopy size={16} />
										</button>
										{copied && (
											<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white">
												Copied!
											</span>
										)}
										<span className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
											{account.eth_addr}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Stats cards */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div
								className={`flex flex-col rounded-xl ${getCardBg()} p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]`}
							>
								<div className="mb-4 flex items-center">
									<div
										className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${getIconBgColor('blue')} p-3`}
									>
										<BiCoin className={getIconColor('blue')} size={28} />
									</div>
									<div>
										<p
											className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
										>
											Balance
										</p>
										<h3
											className={`text-2xl font-bold ${currentThemeStyles.text}`}
										>
											{account.balance}
										</h3>
									</div>
								</div>
								<div
									className={`mt-auto h-1.5 w-full overflow-hidden rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
								>
									<div
										className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
										style={{
											width: `${Math.min(parseInt(account.balance) / 10, 100)}%`,
										}}
									/>
								</div>
							</div>

							<div
								className={`flex flex-col rounded-xl ${getCardBg()} p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]`}
							>
								<div className="mb-4 flex items-center">
									<div
										className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${getIconBgColor('purple')} p-3`}
									>
										<BiMedal className={getIconColor('purple')} size={28} />
									</div>
									<div>
										<p
											className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
										>
											Trust Score
										</p>
										<h3
											className={`text-2xl font-bold ${currentThemeStyles.text}`}
										>
											{account.score}
										</h3>
									</div>
								</div>
								<div
									className={`mt-auto h-1.5 w-full overflow-hidden rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
								>
									<div
										className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
										style={{
											width: `${Math.min(parseInt(account.score || '0') * 10, 100)}%`,
										}}
									/>
								</div>
							</div>
						</div>

						{/* Action buttons */}
						{isConnected && (
							<div
								className={`rounded-xl ${theme === 'light' ? 'bg-gray-100/70' : 'bg-gray-800/30'} p-6 backdrop-blur-sm`}
							>
								<h3
									className={`mb-4 text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
								>
									Actions
								</h3>
								<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
									<Button
										className={cn(
											'flex-1 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800',
											'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-blue-700',
											'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
										)}
										disabled={
											isVouching ||
											address?.toLowerCase() === account.eth_addr.toLowerCase()
										}
										isLoading={isVouching}
										leftIcon={FiThumbsUp}
										onClick={onVouch}
									>
										{isVouching ? 'Vouching...' : 'Vouch for User'}
									</Button>
									<Button
										className={cn(
											'flex-1 rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-white shadow-lg transition-all hover:from-purple-700 hover:to-purple-800',
											'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-purple-700',
											'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
										)}
										disabled={isUpdatingScore}
										isLoading={isUpdatingScore}
										leftIcon={FiArrowUp}
										onClick={onUpdateScore}
									>
										{isUpdatingScore ? 'Updating...' : 'Increase Trust Score'}
									</Button>
								</div>
							</div>
						)}

						{/* Ego network graph (3 layers) */}
						{account && (
							<div>
								<h3 className="text-lg font-medium">Connections</h3>
								<AccountNetworkGraph
									mode="ego"
									accounts={accountsData?.accounts || []}
									centerAddress={account.eth_addr}
									maxDepth={3}
								/>
							</div>
						)}

						{/* Voucher sections */}
						{account && (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{/* Users vouched by this account */}
								<div
									className={`rounded-xl ${getCardBg()} p-6 shadow-lg backdrop-blur-sm`}
								>
									<h3
										className={`mb-4 text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
									>
										Users Vouched by This Account
									</h3>
									<AccountVouchedUsers />
								</div>

								<div
									className={`rounded-xl ${getCardBg()} p-6 shadow-lg backdrop-blur-sm`}
								>
									<h3
										className={`mb-4 text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
									>
										Users Who Vouched for This Account
									</h3>
									<AccountUsersWhoVouched />
								</div>
							</div>
						)}
					</div>
				)
			)}
		</div>
	);
};

export default AccountDetailsPage;
