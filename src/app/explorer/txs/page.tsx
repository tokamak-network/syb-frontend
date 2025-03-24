'use client';

import React, { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';

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
const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const { address } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { data: transactionHistory, isLoading: isLoadingTx } = useQuery({
		queryKey: ['transactions'],
		queryFn: fetchTransactions,
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
						<TransactionsTable filteredTransactions={filteredTransactions} />
					)}
				</TabsContent>
				<TabsContent value="me">
					{filteredTransactions && (
						<TransactionsTable
							filteredTransactions={filteredTransactions.filter(
								(transaction) =>
									formatTonAddress(transaction.fromTonEthereumAddress) ===
									address,
							)}
						/>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransactionsPage;
