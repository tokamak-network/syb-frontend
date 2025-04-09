'use client';

import React, { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import {
	Button,
	PageLoader,
	SearchBarComponent,
	TransactionsTable,
} from '@/components';
import { fetchTransactions } from '@/utils';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useWallet } from '@/hooks/useWallet';
import { formatTonAddress } from '@/utils/format';
import { Order } from '@/types';

const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const { address, isConnected } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [order, setOrder] = useState<Order>(Order.DESC);
	const { data: transactionHistory, isLoading: isLoadingTx } = useQuery({
		queryKey: ['transactions', order],
		queryFn: () => fetchTransactions(order),
		staleTime: 30000,
		refetchInterval: 30000,
	});

	const transactions = transactionHistory?.transactions || [];

	const filteredTransactions = transactions.filter((transaction) => {
		const query = searchQuery.toLowerCase();
		return (
			transaction.id.toLowerCase().includes(query) ||
			transaction.fromTonEthereumAddress.toLowerCase().includes(query) ||
			(transaction.fromAccountIndex &&
				transaction.fromAccountIndex.toString().toLowerCase().includes(query))
		);
	});

	if (isLoadingTx) return <PageLoader />;

	return (
		<div className="space-y-2 p-8">
			<Button
				className="inline-flex w-auto items-center hover:underline"
				leftIcon={IoArrowBackSharp}
				onClick={() => {
					router.push('/explorer');
				}}
			>
				Back to Explorer Page
			</Button>
			<SearchBarComponent
				placeholder="Search by Transaction Hash, From, or To"
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<Tabs defaultValue="all" className="shadow-blackA2 flex w-full flex-col">
				<TabsList className="flex w-[400px] shrink-0 border-b border-tabBorder">
					<TabsTrigger
						className="text-mauve11 flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center px-5 data-[state=active]:border-b-2 data-[state=active]:border-tabActive"
						value="all"
					>
						All
					</TabsTrigger>
					<TabsTrigger
						className="text-mauve11 flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center px-5 data-[state=active]:border-b-2 data-[state=active]:border-tabActive"
						value="me"
					>
						My Transactions
					</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					{filteredTransactions && (
						<TransactionsTable
							filteredTransactions={filteredTransactions}
							setOrder={setOrder}
							order={order}
						/>
					)}
				</TabsContent>
				<TabsContent value="me">
					{!isConnected ? (
						<div className="flex flex-col items-center justify-center rounded-lg p-10 text-center">
							<div className="mb-4 rounded-full bg-purple-600 p-3">
								<Image
									src="/images/wallets/metamask.svg"
									alt="MetaMask"
									width={24}
									height={24}
								/>
							</div>
							<p className="text-xl font-semibold text-purple-900">
								Please connect your MetaMask wallet
							</p>
							<p className="mt-2 text-purple-950">
								Connect your wallet to view your transaction history
							</p>
						</div>
					) : (
						filteredTransactions && (
							<TransactionsTable
								filteredTransactions={filteredTransactions.filter(
									(transaction) =>
										formatTonAddress(transaction.fromTonEthereumAddress) ===
										address,
								)}
								setOrder={setOrder}
								order={order}
							/>
						)
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransactionsPage;
