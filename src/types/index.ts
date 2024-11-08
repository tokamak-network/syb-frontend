import { Node, Edge, MarkerType } from '@xyflow/react';

export interface LeaderboardEntry {
	rank: number;
	address: string;
	score: number;
	balance: number;
}

export interface WalletContextType {
	address: string | null;
	balance: string | null;
	connectWallet: () => Promise<void>;
}

export interface User {
	address: string;
	balance: number;
	vouchesReceived: { address: string; amount: number }[];
	score: number;
}

export enum ActionType {
	DEPOSIT = 'Deposit',
	WITHDRAW = 'Withdraw',
	EXPLODE = 'Explode',
	VOUCH = 'Vouch',
}

export enum ActionStatus {
	SUCCESS = 'Success',
	PENDING = 'Pending',
	FAILED = 'Failed',
}

export interface TransactionType {
	from: string;
	to: string;
	time: Date;
	amount: number;
	type: ActionType;
	status: ActionStatus;
}

export enum ActionMethod {
	TRANSFER = 'Transfer',
}

export interface ExplorerType {
	txHash: string;
	type: {
		txType: ActionType;
		txStatus: ActionStatus;
	};
	method: ActionMethod;
	blockNumber: number;
	txUser: {
		from: string;
		to: string;
	};
	value: number;
	fee: number;
	timestamp: Date;
}

export interface UserNode extends Node {
	data: {
		label: string;
	};
	measured: {
		width: number;
		height: number;
	};
	__rf?: {
		width: number;
		height: number;
	}
}

export interface UserEdge extends Edge {
	source: string;
	target: string;
	type: string;
	markerEnd: {
		type: MarkerType;
	};
	style: {
		stroke: string;
		strokeWidth: number;
	};
}
