export const SybilSepoliaABI = [
	{ inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
	{
		inputs: [
			{ internalType: 'address', name: 'account', type: 'address' },
			{ internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
		],
		name: 'AccessControlUnauthorizedAccount',
		type: 'error',
	},
	{ inputs: [], name: 'BatchNotFull', type: 'error' },
	{ inputs: [], name: 'EthTransferFailed', type: 'error' },
	{ inputs: [], name: 'InsufficientBalance', type: 'error' },
	{ inputs: [], name: 'InsufficientETH', type: 'error' },
	{ inputs: [], name: 'InvalidInitialization', type: 'error' },
	{ inputs: [], name: 'InvalidPoseidon2Address', type: 'error' },
	{ inputs: [], name: 'InvalidPoseidon3Address', type: 'error' },
	{ inputs: [], name: 'InvalidProof', type: 'error' },
	{ inputs: [], name: 'InvalidVerifierAddress', type: 'error' },
	{ inputs: [], name: 'LimitAmountExceeded', type: 'error' },
	{ inputs: [], name: 'NotInitializing', type: 'error' },
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
		],
		name: 'NotVouched',
		type: 'error',
	},
	{ inputs: [], name: 'ReceiverHasZeroBalance', type: 'error' },
	{ inputs: [], name: 'SelfVouch', type: 'error' },
	{ inputs: [], name: 'SenderHasZeroBalance', type: 'error' },
	{ inputs: [], name: 'SmtProofInvalid', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'explodeAmount',
				type: 'uint256',
			},
		],
		name: 'ExplodeAmountUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint32',
				name: 'lastForgedBatch',
				type: 'uint32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lastForgedTxn',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'batchSize',
				type: 'uint256',
			},
			{ indexed: false, internalType: 'bytes', name: 'txnData', type: 'bytes' },
		],
		name: 'ForgeBatch',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint64',
				name: 'version',
				type: 'uint64',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'previousAdminRole',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'newAdminRole',
				type: 'bytes32',
			},
		],
		name: 'RoleAdminChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'RoleGranted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'RoleRevoked',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'newBalance',
				type: 'uint256',
			},
		],
		name: 'ScoringRequiredBalanceUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'lastAddedTxn',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'uint8',
				name: 'identifier',
				type: 'uint8',
			},
			{ indexed: false, internalType: 'uint24', name: 'from', type: 'uint24' },
			{ indexed: false, internalType: 'uint24', name: 'to', type: 'uint24' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'TxEvent',
		type: 'event',
	},
	{
		inputs: [],
		name: 'ADMIN_ROLE',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'DEFAULT_ADMIN_ROLE',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: '_MIN_BALANCE',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'key', type: 'uint256' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: '_hashFinalNode',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'left', type: 'uint256' },
			{ internalType: 'uint256', name: 'right', type: 'uint256' },
		],
		name: '_hashNode',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'accountInfo',
		outputs: [
			{ internalType: 'uint192', name: 'balance', type: 'uint192' },
			{ internalType: 'uint24', name: 'idx', type: 'uint24' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
		name: 'accountRootMap',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'batchSize',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'deposit',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
		name: 'exitRootMap',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'explodeAmount',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address[]', name: 'toEthAddrs', type: 'address[]' },
		],
		name: 'explodeMultiple',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'newAccountRoot', type: 'uint256' },
			{ internalType: 'uint256', name: 'newVouchRoot', type: 'uint256' },
			{ internalType: 'uint256', name: 'newScoreRoot', type: 'uint256' },
			{ internalType: 'uint256[2]', name: 'proofA', type: 'uint256[2]' },
			{ internalType: 'uint256[2][2]', name: 'proofB', type: 'uint256[2][2]' },
			{ internalType: 'uint256[2]', name: 'proofC', type: 'uint256[2]' },
		],
		name: 'forgeBatch',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getQueueLength',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
		name: 'getRoleAdmin',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
		name: 'getScore',
		outputs: [{ internalType: 'uint32', name: 'score', type: 'uint32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' },
		],
		name: 'grantRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' },
		],
		name: 'hasRole',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_verifier', type: 'address' },
			{ internalType: 'uint256', name: 'maxTx', type: 'uint256' },
			{ internalType: 'uint256', name: 'nLevel', type: 'uint256' },
			{ internalType: 'address', name: '_poseidon2Elements', type: 'address' },
			{ internalType: 'address', name: '_poseidon3Elements', type: 'address' },
			{ internalType: 'address', name: '_adminRole', type: 'address' },
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'lastAddedTxn',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'lastForgedBatch',
		outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'lastForgedTxn',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'lastIdx',
		outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint32', name: 'numScoreRoot', type: 'uint32' },
			{ internalType: 'uint24', name: 'idx', type: 'uint24' },
			{ internalType: 'uint32', name: 'score', type: 'uint32' },
			{ internalType: 'uint256[]', name: 'siblings', type: 'uint256[]' },
		],
		name: 'proveScoreMerkleProof',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'callerConfirmation', type: 'address' },
		],
		name: 'renounceRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'role', type: 'bytes32' },
			{ internalType: 'address', name: 'account', type: 'address' },
		],
		name: 'revokeRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
		name: 'scoreRootMap',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'scoreSnapshots',
		outputs: [
			{ internalType: 'uint32', name: 'score', type: 'uint32' },
			{ internalType: 'uint32', name: 'batchNum', type: 'uint32' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'scoringRequiredBalance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'unprocessedBatchesMap',
		outputs: [
			{ internalType: 'uint8', name: 'identifier', type: 'uint8' },
			{ internalType: 'uint24', name: 'from', type: 'uint24' },
			{ internalType: 'uint24', name: 'to', type: 'uint24' },
			{ internalType: 'uint128', name: 'amount', type: 'uint128' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'toEthAddr', type: 'address' }],
		name: 'unvouch',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: '_explodeAmount', type: 'uint256' },
		],
		name: 'updateExplodeAmount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'user', type: 'address' },
			{ internalType: 'uint32', name: 'score', type: 'uint32' },
		],
		name: 'updateScore',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_scoringRequiredBalance',
				type: 'uint256',
			},
		],
		name: 'updateScoringRequiredBalance',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'verifier',
		outputs: [
			{
				internalType: 'contract IVerifier',
				name: 'verifierInterface',
				type: 'address',
			},
			{ internalType: 'uint256', name: 'maxTx', type: 'uint256' },
			{ internalType: 'uint256', name: 'nLevel', type: 'uint256' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'toEthAddr', type: 'address' }],
		name: 'vouch',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
		name: 'vouchRootMap',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '', type: 'address' },
			{ internalType: 'address', name: '', type: 'address' },
		],
		name: 'vouches',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;
