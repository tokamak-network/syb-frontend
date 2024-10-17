import { ActionStatus, ActionType, TransactionType } from "@/utils/types";

export const transactionData: TransactionType[] = [
  {
    from: "0xUser1",
    to: "0xUser2",
    time: new Date("2024-10-16T10:30:00Z"),
    amount: 1.5,
    type: ActionType.DEPOSIT,
    staus: ActionStatus.SUCCESS,
  },
  {
    from: "0xUser2",
    to: "0xUser3",
    time: new Date("2024-10-16T14:45:00Z"),
    amount: 0.75,
    type: ActionType.WITHDRAW,
    staus: ActionStatus.PENDING,
  },
  {
    from: "0xUser3",
    to: "0xUser4",
    time: new Date("2024-10-16T09:15:00Z"),
    amount: 0,
    type: ActionType.EXPLODE,
    staus: ActionStatus.FAILED,
  },
  {
    from: "0xUser4",
    to: "0xUser5",
    time: new Date("2024-10-16T17:00:00Z"),
    amount: 0,
    type: ActionType.VOUCH,
    staus: ActionStatus.SUCCESS,
  },
  {
    from: "0xUser5",
    to: "0xUser6",
    time: new Date("2023-11-05T11:30:00Z"),
    amount: 2.0,
    type: ActionType.DEPOSIT,
    staus: ActionStatus.PENDING,
  },
  {
    from: "0xUser6",
    to: "0xUser7",
    time: new Date("2023-11-06T15:20:00Z"),
    amount: 1.25,
    type: ActionType.WITHDRAW,
    staus: ActionStatus.SUCCESS,
  },
];

export default transactionData;
