import { ActionMethod, ActionStatus, ActionType, ExplorerType } from '@/types';

export const transactionData: ExplorerType[] = [
	{
		txHash: '0x0',
		type: {
			txType: ActionType.DEPOSIT,
			txStatus: ActionStatus.FORGED,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863465,
		txUser: {
			from: '0xUser1',
			to: '0xUser2',
		},
		value: 1.5,
		fee: 0.0001,
		timestamp: new Date('2024-10-16T10:30:00Z'),
	},
	{
		txHash: '0x1',
		type: {
			txType: ActionType.WITHDRAW,
			txStatus: ActionStatus.PENDING,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863466,
		txUser: {
			from: '0xUser2',
			to: '0xUser3',
		},
		value: 0.75,
		fee: 0.0002,
		timestamp: new Date('2024-10-16T14:45:00Z'),
	},
	{
		txHash: '0xUser3TransactionHash',
		type: {
			txType: ActionType.EXPLODE,
			txStatus: ActionStatus.FAILED,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863467,
		txUser: {
			from: '0xUser3',
			to: '0xUser4',
		},
		value: 0,
		fee: 0.0003,
		timestamp: new Date('2024-10-16T09:15:00Z'),
	},
	{
		txHash: '0xUser4TransactionHash',
		type: {
			txType: ActionType.VOUCH,
			txStatus: ActionStatus.FAILED,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863468,
		txUser: {
			from: '0xUser4',
			to: '0xUser5',
		},
		value: 0,
		fee: 0.0004,
		timestamp: new Date('2024-10-16T17:00:00Z'),
	},
	{
		txHash: '0xUser5TransactionHash',
		type: {
			txType: ActionType.DEPOSIT,
			txStatus: ActionStatus.PENDING,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863469,
		txUser: {
			from: '0xUser5',
			to: '0xUser6',
		},
		value: 2.0,
		fee: 0.0005,
		timestamp: new Date('2023-11-05T11:30:00Z'),
	},
	{
		txHash: '0xUser6TransactionHash',
		type: {
			txType: ActionType.WITHDRAW,
			txStatus: ActionStatus.FORGED,
		},
		method: ActionMethod.TRANSFER,
		blockNumber: 20863470,
		txUser: {
			from: '0xUser6',
			to: '0xUser7',
		},
		value: 1.25,
		fee: 0.0006,
		timestamp: new Date('2023-11-06T15:20:00Z'),
	},
];

export default transactionData;
