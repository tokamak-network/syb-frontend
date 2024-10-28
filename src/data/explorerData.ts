import { ActionMethod, ActionStatus, ActionType, ExplorerType } from "@/types";

export const explorerData: ExplorerType[] = [
  {
    txHash: "0x512dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48e7",
    type: {
      txType: ActionType.DEPOSIT,
      txStatus: ActionStatus.SUCCESS,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863455,
    txUser: {
      from: "james",
      to: "syb:0x203902803230090234",
    },
    value: 0.01769191,
    fee: 0.00020368,
  },
  {
    txHash: "0xa72dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48b3",
    type: {
      txType: ActionType.WITHDRAW,
      txStatus: ActionStatus.PENDING,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863456,
    txUser: {
      from: "alice",
      to: "syb:0x203902803230090235",
    },
    value: 0.05428123,
    fee: 0.00012345,
  },
  {
    txHash: "0xc93dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48f4",
    type: {
      txType: ActionType.EXPLODE,
      txStatus: ActionStatus.FAILED,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863457,
    txUser: {
      from: "bob",
      to: "syb:0x203902803230090236",
    },
    value: 0.02000000,
    fee: 0.00050000,
  },
  {
    txHash: "0xd64dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48c8",
    type: {
      txType: ActionType.VOUCH,
      txStatus: ActionStatus.SUCCESS,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863458,
    txUser: {
      from: "charlie",
      to: "syb:0x203902803230090237",
    },
    value: 0.03567891,
    fee: 0.00025000,
  },
  {
    txHash: "0xe85dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48d9",
    type: {
      txType: ActionType.DEPOSIT,
      txStatus: ActionStatus.PENDING,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863459,
    txUser: {
      from: "diana",
      to: "syb:0x203902803230090238",
    },
    value: 0.01234567,
    fee: 0.00015000,
  },
];

export default explorerData;