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
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  EXPLODE = "EXPLODE",
  VOUCH = "VOUCH",
}

export enum ActionStatus {
  SUCCESS,
  PENDING,
  FAILED,
}
