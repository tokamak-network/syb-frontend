import { Node, Edge, MarkerType } from '@xyflow/react';
export * from './network';
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
	DEPOSIT = 'CreateAccountDeposit',
	WITHDRAW = 'Withdraw',
	EXPLODE = 'Explode',
	VOUCH = 'Vouch',
	EXIT = 'ForceExit',
}

export enum ActionStatus {
	FORGED = 'Forged',
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
	};
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

export interface NetworkType {
	id: number;
	name: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	rpcUrls: {
		readonly default: {
			http: readonly [string];
			webSocket?: readonly [string];
		};
	};
	blockExplorers: {
		default: {
			name: string;
			url: string;
			apiUrl: string;
		};
	};
}

export interface Account {
	accountIndex: string;
	balance: string;
	name?: string;
	image?: string;
	tonEthereumAddress: string;
	itemId: number;
	nonce: number;
}

interface L1Info {
	ethereumBlockNum: number;
	historicDepositAmountUSD: number | null;
	depositAmount: string;
	toForgeL1TransactionsNum: number;
	userOrigin: boolean;
	ethereumTxHash: string;
	l1Fee: string;
}

export interface Transaction {
	item_id: number;
	batch_num: number;
	position: string;
	type: string;
	from_idx: number;
	from_eth_addr: string;
	to_idx: number;
	to_eth_addr: string;
	amount: string;
	block_number: number;
	timestamp: number;
	gas_fee: string;
	fromAccountIndex?: string;
	fromTonEthereumAddress?: string;
	id?: string; // Assuming item_id can serve as id
	itemId?: number; // Duplicate of item_id
	toAccountIndex?: string;
	toTonEthereumAddress?: string | null;
	tx_hash?: string;
}

export interface TransactionResponse {
	transactions: Transaction[];
	pendingItems: number;
}

export interface AccountsResponse {
	accounts: Account[];
	pendingItems: number;
}

export enum Order {
	ASC = 'ASC',
	DESC = 'DESC',
}
