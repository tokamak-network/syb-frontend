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
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  EXPLODE = "Explode",
  VOUCH = "Vouch",
}

export enum ActionStatus {
  SUCCESS = "Success",
  PENDING = "Pending",
  FAILED = "Failed",
}

export interface TransactionType {
  from: string;
  to: string;
  time: Date;
  amount: number;
  type: ActionType;
  staus: ActionStatus;
}
