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

const TransactionsPage: React.FC = () => {
	const router = useRouter();

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
			{filteredTransactions && (
				<TransactionsTable filteredTransactions={filteredTransactions} />
			)}
		</div>
	);
};

export default TransactionsPage;
