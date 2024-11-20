export const projectStructure = [
	{
		title: 'Sequencer',
		description:
			'Initially the zk-rollup will have just one operator, which we call the ‘sequencer’.  This is a single machine that stores the state(accounts and vouches and scores) as a Merkle tree. Users send txn requests to the sequencer in a specified format. It collects these user transactions into a batch and then updates the state Merkle tree and then sends to the contract three things.',
	},
	{
		title: 'Contract',
		description:
			'Periodically, Smart Contract receives a new batch from the sequencer. When it receives a new batch, it checks the snark proof is correct. If the proof is correct, the contract updates its state root variable to the new state root. The contract also stores the txn data but doesn’t process it. Some transactions are sent directly to the L1 contract. When this happens the txn isn&apos;t applied to the state tree immediately, instead, the contract stores the txn in a queue. Then the sequencer can read the queue in the contract and include those txns in the next batch.',
	},
	{
		title: 'Circuit',
		description:
			'The circuit is a program that contains the logic of applying txns and updating the state tree. It is written in circom language. It is created and fixed at the start of the L2 launching and published so the public can check the logic is doing the right thing. When the circuit is created, we get two pieces of data related to the circuit called the “proving key” and “verifier key”. The prover (sequencer) can use some ‘public inputs’, the proving key, and some ‘private inputs’ to create a ‘proof’. Then the verifier (the contract) can use the verification key, the same public inputs, and the proof, to check if it is true that there exists a valid set of txns that take the state from the old root to the new root.',
	},
];
