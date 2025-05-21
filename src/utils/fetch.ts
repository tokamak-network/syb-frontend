import { Account, Order, Transaction, TransactionResponse } from '@/types';

import { apiRequest } from './api';

export const fetchTransactions = async (): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/api/v1/transactions`,
	});
};

export const fetchTransactionsByAccount = async (
	accountAddress: string,
): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/api/v1/transactions/${accountAddress}`,
	});
};

export const fetchTransactionsPaginated = async (
	page: number = 1,
	limit: number = 10,
	order: Order = Order.DESC,
): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/api/v1/transactions/list`,
		params: {
			page,
			limit,
			order,
		},
	});
};

export const fetchAccounts = async (): Promise<any> => {
	return apiRequest({
		method: 'GET',
		url: '/accounts',
	});
};

export const fetchTransactionByHash = async (
	txHash: string,
): Promise<Transaction> => {
	return apiRequest({
		method: 'GET',
		url: `/transactions-history/${txHash}`,
	});
};

export const fetchAccountByID = async (
	accountIndex: string,
): Promise<Account> => {
	return apiRequest({
		method: 'GET',
		url: `/accounts/${accountIndex}`,
	});
};

export const fetchAccountByAddress = async (
	accountAddress: string,
): Promise<Account> => {
	return apiRequest({
		method: 'GET',
		url: `/accounts/address/${accountAddress}`,
	});
};
