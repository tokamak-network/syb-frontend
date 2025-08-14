'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IoArrowBackSharp } from 'react-icons/io5';

import { Button, PageLoader, SearchBarComponent, Modal } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { useSepoliaTransactions } from '@/hooks/useSepolia';
import { useScoreUpdate } from '@/hooks';
import { apiRequest } from '@/utils/api';
import { Account, AccountsResponse } from '@/types';
import { useToast } from '@/context';
import {
	formatScore,
	convertBigIntToNumber,
	formatBalanceToEth,
} from '@/utils/format';

const AccountPage: React.FC = () => {
	const router = useRouter();
	const { isConnected, address } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
	const [isVouchModalOpen, setIsVouchModalOpen] = useState<boolean>(false);
	const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
	const [isVouchLoading, setIsVouchLoading] = useState<boolean>(false);
	const [isScoreLoading, setIsScoreLoading] = useState<boolean>(false);
	const { handleVouch } = useSepoliaTransactions();
	const { handleUpdateScore } = useScoreUpdate();
	const { addToast } = useToast();

	const {
		data: accountResponse,
		isLoading: isLoadingAccounts,
		refetch,
	} = useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response: AccountsResponse = await apiRequest({
				method: 'GET',
				url: '/accounts',
			});

			return response;
		},
	});

	// Function to handle opening the vouch modal
	const openVouchModal = (account: Account) => {
		setSelectedAccount(account);
		setIsVouchModalOpen(true);
	};

	// Function to handle opening the score update modal
	const openScoreModal = (account: Account) => {
		setSelectedAccount(account);
		setIsScoreModalOpen(true);
	};

	// Function to handle vouching for an account
	const handleVouchForAccount = async () => {
		if (!selectedAccount) return;

		setIsVouchLoading(true);
		try {
			const hash = await handleVouch(selectedAccount.eth_addr);

			addToast(
				'success',
				'Vouch Successful',
				`You have successfully vouched for account ${selectedAccount.idx}. Transaction hash: ${hash}`,
			);

			setIsVouchModalOpen(false);
			setSelectedAccount(null);
			refetch(); // Refresh the account list
		} catch (error: any) {
			addToast(
				'error',
				'Vouch Failed',
				error.message || 'Failed to vouch for account',
			);
		} finally {
			setIsVouchLoading(false);
		}
	};

	// Function to handle updating score for an account
	const handleUpdateScoreForAccount = async () => {
		if (!selectedAccount) return;

		setIsScoreLoading(true);
		try {
			// Calculate new score (increment by 1)
			const newScore = convertBigIntToNumber(selectedAccount.score) + 1;

			const hash = await handleUpdateScore(selectedAccount.eth_addr, newScore);

			addToast(
				'success',
				'Score Update Successful',
				`You have successfully updated the score for account ${selectedAccount.idx}. Transaction hash: ${hash}`,
			);

			setIsScoreModalOpen(false);
			setSelectedAccount(null);
			refetch(); // Refresh the account list
		} catch (error: any) {
			addToast(
				'error',
				'Score Update Failed',
				error.message || 'Failed to update score for account',
			);
		} finally {
			setIsScoreLoading(false);
		}
	};

	const handleBackToExplorer = () => {
		router.push('/explorer');
	};

	if (isLoadingAccounts) return <PageLoader />;

	const filteredAccounts = accountResponse?.accounts.filter(
		(account: Account) =>
			account.idx.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col items-center space-y-12 p-6">
			{/* Back button */}
			<div className="mb-4 self-start">
				<Button
					className="inline-flex w-auto items-center hover:underline"
					leftIcon={IoArrowBackSharp}
					onClick={handleBackToExplorer}
				>
					Back to Explorer
				</Button>
			</div>

			{/* Search Bar */}
			<SearchBarComponent
				placeholder="Search accounts by ID..."
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{/* Account List Table */}
			<table className="min-w-full table-auto rounded-lg">
				<thead className="font-abhaya bg-tableHeader text-tableTextPrimary">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Account ID
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Account Address
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Balance
						</th>
						<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
							Score
						</th>
						{isConnected && (
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody className="font-abhaya bg-tableBackground">
					{filteredAccounts &&
						filteredAccounts.map((account: Account) => (
							<tr
								key={account.idx}
								className={`font-abhaya border-b-2 border-tableBorder bg-tableBackground text-tableTextSecondary transition-colors duration-300 hover:bg-tableHover`}
								onClick={() => router.push(`/explorer/accounts/${account.idx}`)}
							>
								<td className="px-6 py-2 text-left font-normal">
									{account.idx}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{account.eth_addr}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{formatBalanceToEth(account.balance)}
								</td>
								<td className="px-6 py-2 text-left font-normal">
									{formatScore(account.score_int)}
								</td>
								{isConnected && (
									<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
										<div className="flex space-x-2">
											<Button
												className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
												disabled={
													address?.toLowerCase() ===
													account.eth_addr.toLowerCase()
												}
												onClick={(e) => {
													e.stopPropagation();
													openVouchModal(account);
												}}
											>
												Vouch
											</Button>
											<Button
												className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
												onClick={(e) => {
													e.stopPropagation();
													openScoreModal(account);
												}}
											>
												Update Score
											</Button>
										</div>
									</td>
								)}
							</tr>
						))}
				</tbody>
			</table>

			{/* Vouch Confirmation Modal */}
			<Modal
				className="max-w-md"
				isOpen={isVouchModalOpen}
				title="Vouch Confirmation"
				onClose={() => setIsVouchModalOpen(false)}
			>
				<div className="flex flex-col space-y-4">
					{selectedAccount && (
						<>
							<p className="text-center text-white">
								Are you sure you want to vouch for this account?
							</p>

							<div className="rounded-md bg-gray-800 p-4">
								<div className="grid grid-cols-2 gap-2">
									<p className="text-sm text-gray-400">Account ID:</p>
									<p className="text-sm font-medium text-white">
										{selectedAccount.idx}
									</p>

									<p className="text-sm text-gray-400">Address:</p>
									<p className="overflow-hidden text-ellipsis text-sm font-medium text-white">
										{selectedAccount.eth_addr}
									</p>

									<p className="text-sm text-gray-400">Score:</p>
									<p className="text-sm font-medium text-white">
										{formatScore(selectedAccount.score)}
									</p>
								</div>
							</div>

							<div className="mt-2 text-xs text-gray-400">
								<p>
									Vouching for an account means you trust this account. If this
									account explodes, you may lose your funds.
								</p>
							</div>

							<div className="flex justify-center space-x-4 pt-4">
								<Button
									className="bg-gray-600 hover:bg-gray-700"
									onClick={() => setIsVouchModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									className="bg-blue-500 hover:bg-blue-600"
									disabled={isVouchLoading}
									onClick={handleVouchForAccount}
								>
									{isVouchLoading ? 'Processing...' : 'Confirm Vouch'}
								</Button>
							</div>
						</>
					)}
				</div>
			</Modal>

			{/* Update Score Confirmation Modal */}
			<Modal
				className="max-w-md"
				isOpen={isScoreModalOpen}
				title="Update Score Confirmation"
				onClose={() => setIsScoreModalOpen(false)}
			>
				<div className="flex flex-col space-y-4">
					{selectedAccount && (
						<>
							<p className="text-center text-white">
								Are you sure you want to update the score for this account?
							</p>

							<div className="rounded-md bg-gray-800 p-4">
								<div className="grid grid-cols-2 gap-2">
									<p className="text-sm text-gray-400">Account ID:</p>
									<p className="text-sm font-medium text-white">
										{selectedAccount.idx}
									</p>

									<p className="text-sm text-gray-400">Address:</p>
									<p className="overflow-hidden text-ellipsis text-sm font-medium text-white">
										{selectedAccount.eth_addr}
									</p>

									<p className="text-sm text-gray-400">Current Score:</p>
									<p className="text-sm font-medium text-white">
										{formatScore(selectedAccount.score)}
									</p>

									<p className="text-sm text-gray-400">New Score:</p>
									<p className="text-sm font-medium text-white">
										{convertBigIntToNumber(selectedAccount.score) + 1}
									</p>
								</div>
							</div>

							<div className="mt-2 text-xs text-gray-400">
								<p>
									Updating the score will increase the account&apos;s reputation
									in the network. This action cannot be undone.
								</p>
							</div>

							<div className="flex justify-center space-x-4 pt-4">
								<Button
									className="bg-gray-600 hover:bg-gray-700"
									onClick={() => setIsScoreModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									className="bg-green-500 hover:bg-green-600"
									disabled={isScoreLoading}
									onClick={handleUpdateScoreForAccount}
								>
									{isScoreLoading ? 'Processing...' : 'Confirm Update'}
								</Button>
							</div>
						</>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default AccountPage;
