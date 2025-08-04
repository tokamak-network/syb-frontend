'use client';

import React, { useState, useEffect } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

import {
	Button,
	PageLoader,
	SearchBarComponent,
	TransactionsTable,
} from '@/components';
import {
	fetchTransactions,
	fetchTransactionsPaginated,
	fetchTransactionsByAccount,
} from '@/utils';
import { useWallet } from '@/hooks/useWallet';
import { Order } from '@/types';

const TransactionsPage: React.FC = () => {
	const router = useRouter();
	const { address, isConnected } = useWallet();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [order, setOrder] = useState<Order>(Order.DESC);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [activeTab, setActiveTab] = useState<string>('all');
	const [totalTransactions, setTotalTransactions] = useState<number>(0);

	const { data: allTransactions } = useQuery({
		queryKey: ['allTransactions'],
		queryFn: fetchTransactions,
	});

	useEffect(() => {
		if (allTransactions?.transactions) {
			setTotalTransactions(allTransactions.transactions.length);
		}
	}, [allTransactions]);

	const { data: transactionHistory, isLoading: isLoadingTx } = useQuery({
		queryKey: ['transactions', order, page, limit],
		queryFn: () => fetchTransactionsPaginated(page, limit, order),
		staleTime: 30000,
		refetchInterval: 30000,
	});

	const { data: userTransactions, isLoading: isLoadingUserTx } = useQuery({
		queryKey: ['userTransactions', address, order],
		queryFn: () => (address ? fetchTransactionsByAccount(address) : null),
		staleTime: 30000,
		refetchInterval: 30000,
		enabled: !!address,
	});

	const transactions = transactionHistory?.transactions || [];
	const totalPages = Math.max(1, Math.ceil(totalTransactions / limit));

	const filteredTransactions = transactions.filter((transaction) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();

		return (
			(transaction.tx_hash
				? String(transaction.tx_hash).toLowerCase().includes(query)
				: false) ||
			(transaction.from_eth_addr
				? transaction.from_eth_addr.toLowerCase().includes(query)
				: false) ||
			(transaction.from_idx
				? String(transaction.from_idx).toLowerCase().includes(query)
				: false) ||
			(transaction.to_eth_addr
				? transaction.to_eth_addr.toLowerCase().includes(query)
				: false) ||
			(transaction.to_idx
				? String(transaction.to_idx).toLowerCase().includes(query)
				: false)
		);
	});

	const userTxs = userTransactions?.transactions || [];
	const [userTxPage, setUserTxPage] = useState<number>(1);
	const [userTxLimit, setUserTxLimit] = useState<number>(10);

	const indexOfLastUserTx = userTxPage * userTxLimit;
	const indexOfFirstUserTx = indexOfLastUserTx - userTxLimit;
	const displayedUserTxs = userTxs.slice(indexOfFirstUserTx, indexOfLastUserTx);
	const userTxTotalPages = Math.max(1, Math.ceil(userTxs.length / userTxLimit));

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	const handleUserTxPageChange = (newPage: number) => {
		setUserTxPage(newPage);
	};

	const handleUserTxLimitChange = (newLimit: number) => {
		setUserTxLimit(newLimit);
		setUserTxPage(1);
	};

	useEffect(() => {
		if (activeTab === 'all') {
			setPage(1);
		} else {
			setUserTxPage(1);
		}
	}, [activeTab]);

	if (isLoadingTx && activeTab === 'all') return <PageLoader />;

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

			<Tabs
				className="shadow-blackA2 flex w-full flex-col"
				defaultValue="all"
				onValueChange={(value) => setActiveTab(value)}
			>
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
							currentPage={page}
							filteredTransactions={filteredTransactions}
							itemsPerPage={limit}
							order={order}
							setOrder={setOrder}
							totalPages={totalPages}
							useExternalPagination={true}
							onLimitChange={handleLimitChange}
							onPageChange={handlePageChange}
						/>
					)}
				</TabsContent>
				<TabsContent value="me">
					{!isConnected ? (
						<div className="flex flex-col items-center justify-center rounded-lg p-10 text-center">
							<div className="mb-4 rounded-full bg-purple-600 p-3">
								<Image
									alt="MetaMask"
									height={24}
									src="/images/wallets/metamask.svg"
									width={24}
								/>
							</div>
							<p className="text-xl font-semibold text-purple-900">
								Please connect your MetaMask wallet
							</p>
							<p className="mt-2 text-purple-950">
								Connect your wallet to view your transaction history
							</p>
						</div>
					) : isLoadingUserTx ? (
						<PageLoader />
					) : (
						userTransactions?.transactions && (
							<TransactionsTable
								currentPage={userTxPage}
								filteredTransactions={displayedUserTxs}
								itemsPerPage={userTxLimit}
								order={order}
								setOrder={setOrder}
								totalPages={userTxTotalPages}
								useExternalPagination={false}
								onLimitChange={handleUserTxLimitChange}
								onPageChange={handleUserTxPageChange}
							/>
						)
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransactionsPage;
