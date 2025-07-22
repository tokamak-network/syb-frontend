import {
	Account,
	Order,
	Transaction,
	TransactionResponse,
	TransactionByHashResponse,
	AccountResponse,
} from '@/types';

import { apiRequest } from './api';

export const fetchTransactions = async (): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/transactions`,
	});
};

export const fetchTransactionsByAccount = async (
	accountAddress: string,
): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/transactions/${accountAddress}`,
	});
};

export const fetchTransactionsPaginated = async (
	page: number = 1,
	limit: number = 10,
	order: Order = Order.DESC,
): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: `/transactions/list`,
		params: {
			page,
			limit,
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
	const response = await apiRequest<TransactionByHashResponse>({
		method: 'GET',
		url: `/transactions/hash/${txHash}`,
	});

	return response.transaction;
};

export const fetchAccountByID = async (
	accountIndex: string,
): Promise<Account> => {
	const response = await apiRequest<AccountResponse>({
		method: 'GET',
		url: `/account/${accountIndex}`,
	});

	return response.account;
};

export const fetchAccountByAddress = async (
	accountAddress: string,
): Promise<Account> => {
	const response = await apiRequest<AccountResponse>({
		method: 'GET',
		url: `/accounts/address/${accountAddress}`,
	});

	return response.account;
};
