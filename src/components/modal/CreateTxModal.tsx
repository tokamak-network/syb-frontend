import React, { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';

import { Input, Select, Button, Modal } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { useSepoliaTransactions } from '@/hooks/useSepolia';
import { useToast } from '@/context';

interface CreateTxModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		type: string;
		from: string;
		to: string;
		amount: string;
		hash?: `0x${string}`;
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
	const router = useRouter();
	const { balance } = useWallet();
	const {
		handleDeposit,
		handleVouch,
		handleUnvouch,
		handleExplodeMultiple,
		handleWithdraw,
	} = useSepoliaTransactions();
	const { addToast } = useToast();

	const [txType, setTxType] = useState<string>('deposit');
	const [txFrom, setTxFrom] = useState<string>(walletAddress || '');
	const [txTo, setTxTo] = useState<string>('');
	const [txAmount, setTxAmount] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [pendingTxHash, setPendingTxHash] = useState<
		`0x${string}` | undefined
	>();
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
	const [successData, setSuccessData] = useState<{
		type: string;
		hash?: `0x${string}`;
	} | null>(null);

	const {
		data,
		isSuccess,
		isError,
		isLoading: isConfirming,
		error: txError,
	} = useWaitForTransactionReceipt({
		hash: pendingTxHash,
	});

	useEffect(() => {
		if (isSuccess && data) {
			addToast(
				'success',
				'Transaction Confirmed',
				`${txType.charAt(0).toUpperCase() + txType.slice(1)} transaction successful! Hash: ${pendingTxHash}`,
			);

			setSuccessData({
				type: txType,
				hash: pendingTxHash,
			});

			onSubmit({
				type: txType,
				from: txFrom,
				to: txTo,
				amount: txAmount,
				hash: pendingTxHash,
			});

			onClose();
			setIsSuccessModalOpen(true);
			setTxAmount('');
			setTxTo('');
			setError(null);
			setPendingTxHash(undefined);
		}

		if (isError && txError) {
			addToast(
				'error',
				'Transaction Failed',
				txError.message || 'Transaction failed during execution',
			);
			setError(txError.message || 'Transaction failed');
			setPendingTxHash(undefined);
		}
	}, [
		isSuccess,
		isError,
		data,
		txError,
		addToast,
		onSubmit,
		onClose,
		txType,
		txFrom,
		txTo,
		txAmount,
		pendingTxHash,
	]);

	const handleSend = async () => {
		if (!isConnected) {
			setError('Please connect your wallet first');

			return;
		}

		if (
			['deposit', 'withdraw'].includes(txType) &&
			(!txAmount || parseFloat(txAmount) <= 0)
		) {
			setError('Amount must be greater than 0');

			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			let hash: `0x${string}`;

			switch (txType) {
				case 'deposit': {
					hash = await handleDeposit(txAmount);
					break;
				}

				case 'withdraw': {
					hash = await handleWithdraw(txAmount);
					break;
				}

				case 'vouch': {
					if (!txTo) throw new Error('Recipient address required');
					hash = await handleVouch(txTo);
					break;
				}

				case 'unvouch': {
					if (!txTo) throw new Error('Recipient address required');
					hash = await handleUnvouch(txTo);
					break;
				}

				case 'explode': {
					if (!txTo) throw new Error('Recipient address required');

					// Parse multiple addresses if provided
					const addresses = txTo.includes(',')
						? txTo.split(',').map((addr) => addr.trim())
						: [txTo.trim()];

					// Validate that we have at least one valid address
					if (addresses.length === 0 || addresses.some((addr) => !addr)) {
						throw new Error('At least one valid address is required');
					}

					hash = await handleExplodeMultiple(addresses);
					break;
				}

				default:
					throw new Error('Unknown transaction type');
			}

			setPendingTxHash(hash);

			addToast(
				'info',
				'Transaction Pending',
				`${txType.charAt(0).toUpperCase() + txType.slice(1)} transaction submitted. \n Waiting for confirmation...`,
			);
		} catch (err: any) {
			setError(err.message || 'Transaction failed');
			addToast(
				'error',
				'Transaction Failed',
				err.message || 'Transaction failed. Please try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const isTransactionProcessing = isLoading || isConfirming;

	const handleSetMaxAmount = () => {
		if (balance) {
			setTxAmount(balance);
		}
	};

	const handleSuccessModalClose = () => {
		setIsSuccessModalOpen(false);
		setSuccessData(null);
	};

	const navigateToTransactions = () => {
		router.push('/explorer/txs');
		handleSuccessModalClose();
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

	const renderTransactionGuidance = () => {
		switch (txType) {
			case 'deposit':
				return (
					<div className="mt-1 text-xs text-gray-400">
						Deposit ETH into the Sybil contract. Minimum balance requirement
						applies.
					</div>
				);
			case 'withdraw':
				return (
					<div className="mt-1 text-xs text-gray-400">
						Withdraw ETH from the Sybil contract. You must maintain minimum
						balance.
					</div>
				);
			case 'vouch':
				return (
					<div className="mt-1 text-xs text-gray-400">
						Vouch for another account. Both accounts must have non-zero
						balances.
					</div>
				);
			case 'unvouch':
				return (
					<div className="mt-1 text-xs text-gray-400">
						Remove your vouch for another account. You must have previously
						vouched for them.
					</div>
				);
			case 'explode':
				return (
					<div className="mt-1 text-xs text-gray-400">
						Explode accounts that have vouched for you. They'll lose funds up to
						the explode amount.
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Modal
				className="max-w-md"
				isOpen={isOpen}
				title="Create Transaction"
				onClose={onClose}
			>
				<div className="flex flex-col space-y-4">
					<Select
						label="Type"
						options={[
							{ value: 'deposit', label: 'Deposit' },
							{ value: 'withdraw', label: 'Withdraw' },
							{ value: 'vouch', label: 'Vouch' },
							{ value: 'unvouch', label: 'Unvouch' },
							{ value: 'explode', label: 'Explode' },
						]}
						value={txType}
						onChange={(e) => {
							setTxType(e);
							setError(null);
						}}
					/>

					{renderTransactionGuidance()}

					<Input
						disabled={!!walletAddress || !isConnected}
						label="From"
						value={txFrom}
						onChange={(e) => setTxFrom(e.target.value)}
					/>

					{isConnected && (
						<div className="text-sm text-gray-500">
							Current Balance: {balance ? `${balance} ETH` : 'Loading...'}
						</div>
					)}

					{['vouch', 'unvouch', 'explode'].includes(txType) && (
						<>
							<Input
								disabled={!isConnected}
								label={
									txType === 'explode' ? 'To (comma-separated addresses)' : 'To'
								}
								placeholder={
									txType === 'explode' ? 'Enter Address(es)' : 'Enter Address'
								}
								value={txTo}
								onChange={(e) => setTxTo(e.target.value)}
							/>

							{txType === 'explode' && (
								<div className="text-xs text-gray-400">
									For multiple addresses, separate them with commas
								</div>
							)}
						</>
					)}

					{['deposit', 'withdraw'].includes(txType) && (
						<div className="flex space-x-2">
							<Input
								disabled={!isConnected}
								label="Amount (ETH)"
								placeholder="Enter amount"
								type="number"
								value={txAmount}
								onChange={(e) => setTxAmount(e.target.value)}
							/>
							<Button
								className="mt-6 px-2 py-1 text-sm"
								disabled={!isConnected || !balance}
								onClick={handleSetMaxAmount}
							>
								Max
							</Button>
						</div>
					)}

					{error && (
						<div className="rounded-md bg-red-500/20 p-3">
							<p className="text-sm text-red-500">{error}</p>
						</div>
					)}

					<div className="flex w-full justify-center">
						<Button
							className="mt-4 w-auto"
							disabled={!isConnected || isTransactionProcessing}
							onClick={handleSend}
						>
							{!isConnected
								? 'Please connect with MetaMask first'
								: isTransactionProcessing
									? isConfirming
										? 'Confirming...'
										: 'Processing...'
									: txType.toLocaleUpperCase()}
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				className="max-w-md"
				isOpen={isSuccessModalOpen}
				title="Transaction Successful"
				onClose={handleSuccessModalClose}
			>
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-center space-x-2 text-green-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<div className="text-center">
						<h3 className="text-lg font-bold text-gray-200">
							{successData?.type
								? successData.type.charAt(0).toUpperCase() +
									successData.type.slice(1)
								: 'Transaction'}
							{` Completed`}
						</h3>

						<p className="mt-2 text-sm text-gray-300">
							Your transaction has been successfully confirmed on the Mainnet.
						</p>

						{successData?.hash && (
							<div className="mt-4 overflow-hidden text-ellipsis rounded-md bg-gray-100 p-2 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
								<span className="font-medium">Transaction Hash:</span>
								<br />
								{successData.hash}
							</div>
						)}
					</div>

					<div className="flex flex-col space-y-2 pt-4">
						<Button className="w-full" onClick={navigateToTransactions}>
							Go To All Transactions
						</Button>
						<Button
							className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
							onClick={handleSuccessModalClose}
						>
							Close
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
