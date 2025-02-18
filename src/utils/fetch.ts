import { Transaction, TransactionResponse } from '@/types';
import { apiRequest } from './api';

export const fetchTransactions = async (): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: '/transactions-history',
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
