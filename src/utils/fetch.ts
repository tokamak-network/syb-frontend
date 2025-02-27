import { Account, Transaction, TransactionResponse } from '@/types';

import { apiRequest } from './api';

export const fetchTransactions = async (): Promise<TransactionResponse> => {
	return apiRequest({
		method: 'GET',
		url: '/transactions-history?includePendingL1s=true',
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
