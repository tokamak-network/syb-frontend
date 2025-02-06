import React, { useState } from 'react';

import { Input, Select, Button, Modal } from '@/components';

interface CreateTxModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		type: string;
		from: string;
		to: string;
		amount: string;
	}) => void;
	isConnected: boolean;
	walletAddress?: string;
}

export const CreateTxModal: React.FC<CreateTxModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isConnected,
	walletAddress,
}) => {
	const [txType, setTxType] = useState('create account');
	const [txFrom, setTxFrom] = useState(walletAddress || '');
	const [txTo, setTxTo] = useState('');
	const [txAmount, setTxAmount] = useState('');

	const handleSend = () => {
		onSubmit({ type: txType, from: txFrom, to: txTo, amount: txAmount });
		onClose();
	};

	return (
		<Modal
			className="max-w-md"
			isOpen={isOpen}
			title="Create Transaction"
			onClose={onClose}
		>
			<div className="space-y-4">
				<Select
					label="Type"
					options={[
						{ value: 'create account', label: 'Create Account' },
						{ value: 'deposit', label: 'Deposit' },
						{ value: 'vouch', label: 'Vouch' },
						{ value: 'unvouch', label: 'Unvouch' },
						{ value: 'exit', label: 'Exit' },
						{ value: 'explode', label: 'Explode' },
					]}
					value={txType}
					onChange={setTxType}
				/>

				<Input
					disabled={!!walletAddress}
					label="From"
					value={txFrom}
					onChange={(e) => setTxFrom(e.target.value)}
				/>

				{['vouch', 'unvouch', 'explode'].includes(txType) && (
					<Input
						label="To"
						placeholder={
							txType === 'explode' ? 'Select from list...' : 'Enter address'
						}
						value={txTo}
						onChange={(e) => setTxTo(e.target.value)}
					/>
				)}

				<Input
					label="Amount"
					placeholder="Enter amount"
					type="number"
					value={txAmount}
					onChange={(e) => setTxAmount(e.target.value)}
				/>

				<Button
					className="mt-4 w-full"
					disabled={!isConnected}
					title={!isConnected ? 'Please connect with MetaMask first' : ''}
					onClick={handleSend}
				>
					Send
				</Button>
			</div>
		</Modal>
	);
};
