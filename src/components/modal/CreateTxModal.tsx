import React, { useEffect, useState } from 'react';

import { Input, Select, Button, Modal } from '@/components';
import { useWallet } from '@/hooks/useWallet';

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
	const { balance } = useWallet();
	const [txType, setTxType] = useState<string>('create account');
	const [txFrom, setTxFrom] = useState<string>(walletAddress || '');
	const [txTo, setTxTo] = useState<string>('');
	const [txAmount, setTxAmount] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	const handleSend = () => {
		// Validate the amount input
		if (!txAmount || parseFloat(txAmount) <= 0) {
			setError('Amount must be greater than 0');

			return;
		}

		// Clear any existing error and proceed with submission
		setError(null);
		onSubmit({ type: txType, from: txFrom, to: txTo, amount: txAmount });
		onClose();
	};

	useEffect(() => {
		if (walletAddress) {
			setTxFrom(walletAddress);
		}
	}, [walletAddress]);

	useEffect(() => {
		if (!isConnected) {
			setTxFrom('');
			setTxTo('');
			setTxAmount('');
		}
	}, [isConnected]);

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
					disabled={!!walletAddress || !isConnected}
					label="From"
					value={txFrom}
					onChange={(e) => setTxFrom(e.target.value)}
				/>

				{isConnected && (
					<div className="text-sm text-gray-500">
						Current Balance:{' '}
						{balance ? `${parseFloat(balance).toFixed(2)} ETH` : 'Loading...'}
					</div>
				)}

				{['vouch', 'unvouch', 'explode'].includes(txType) && (
					<Input
						disabled={!isConnected}
						label="To"
						placeholder={
							txType === 'explode' ? 'Select from list...' : 'Enter address'
						}
						value={txTo}
						onChange={(e) => setTxTo(e.target.value)}
					/>
				)}

				<Input
					disabled={!isConnected}
					label="Amount"
					placeholder="Enter amount"
					type="number"
					value={txAmount}
					onChange={(e) => setTxAmount(e.target.value)}
				/>
				{error && <p className="text-sm text-red-500">{error}</p>}

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
