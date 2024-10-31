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
    timestamp: new Date('2023-01-15T10:00:00Z'),
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
    timestamp: new Date('2023-02-10T11:00:00Z'),
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
    timestamp: new Date('2023-02-20T12:00:00Z'),
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
    timestamp: new Date('2023-03-05T13:00:00Z'),
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
    timestamp: new Date('2023-03-15T14:00:00Z'),
  },
  {
    txHash: "0xf95dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48e0",
    type: {
      txType: ActionType.WITHDRAW,
      txStatus: ActionStatus.SUCCESS,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863460,
    txUser: {
      from: "eve",
      to: "syb:0x203902803230090239",
    },
    value: 0.02500000,
    fee: 0.00020000,
    timestamp: new Date('2023-04-10T15:00:00Z'),
  },
  {
    txHash: "0xg26dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48f1",
    type: {
      txType: ActionType.VOUCH,
      txStatus: ActionStatus.PENDING,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863461,
    txUser: {
      from: "frank",
      to: "syb:0x203902803230090240",
    },
    value: 0.03000000,
    fee: 0.00018000,
    timestamp: new Date('2023-04-25T16:00:00Z'),
  },
  {
    txHash: "0xh37dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48c2",
    type: {
      txType: ActionType.DEPOSIT,
      txStatus: ActionStatus.FAILED,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863462,
    txUser: {
      from: "george",
      to: "syb:0x203902803230090241",
    },
    value: 0.04500000,
    fee: 0.00030000,
    timestamp: new Date('2023-05-05T17:00:00Z'),
  },
  {
    txHash: "0xi48dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48b6",
    type: {
      txType: ActionType.EXPLODE,
      txStatus: ActionStatus.SUCCESS,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863463,
    txUser: {
      from: "harry",
      to: "syb:0x203902803230090242",
    },
    value: 0.05000000,
    fee: 0.00040000,
    timestamp: new Date('2023-06-01T18:00:00Z'),
  },
  {
    txHash: "0xj59dd790de38114e95fbc98477605caf3e26f1a48963f9b5aaeebd5613cf48a1",
    type: {
      txType: ActionType.WITHDRAW,
      txStatus: ActionStatus.FAILED,
    },
    method: ActionMethod.TRANSFER,
    blockNumber: 20863464,
    txUser: {
      from: "ivy",
      to: "syb:0x203902803230090243",
    },
    value: 0.06000000,
    fee: 0.00050000,
    timestamp: new Date('2023-06-20T19:00:00Z'),
  },
];

export default explorerData;