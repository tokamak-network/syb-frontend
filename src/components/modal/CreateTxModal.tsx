import React, { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

import { Input, Select, Button, Modal } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { useSepoliaTransactions } from '@/hooks/useSepolia';
import { useToast } from '@/context';
import { SybilSepoliaABI, contracts } from '@/contracts';
import { formatEthAddress } from '@/utils';

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
	walletAddress?: `0x${string}`;
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
	const [hasContractBalance, setHasContractBalance] = useState<boolean>(false);

	// Read the user's contract balance
	const { data: contractBalance } = useReadContract({
		address: formatEthAddress(contracts.sybilSepolia.address) as `0x${string}`,
		abi: SybilSepoliaABI,
		functionName: 'balances',
		args: walletAddress ? [walletAddress] : undefined,
	});

	// Check if user has contract balance
	useEffect(() => {
		if (contractBalance) {
			// If contract balance is greater than 0, user has deposited
			setHasContractBalance(BigInt(contractBalance.toString()) > BigInt(0));
		} else {
			setHasContractBalance(false);
		}
	}, [contractBalance]);

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

		// Check if deposit amount exceeds wallet balance
		if (
			txType === 'deposit' &&
			balance &&
			parseFloat(txAmount) > parseFloat(balance)
		) {
			setError('Deposit amount cannot exceed wallet balance');
			return;
		}

		// Check if withdraw amount exceeds contract balance
		if (txType === 'withdraw' && contractBalance) {
			const contractBalanceEth = ethers.utils.formatEther(
				contractBalance.toString(),
			);
			if (parseFloat(txAmount) > parseFloat(contractBalanceEth)) {
				setError('Withdraw amount cannot exceed contract balance');
				return;
			}
		}

		// Check if the user has contract balance when attempting non-deposit transactions
		if (!hasContractBalance && txType !== 'deposit') {
			setError('You need to make a deposit first to use this functionality');
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
						{!hasContractBalance ? (
							<span className="text-red-400">
								First deposit to use this functionality.
							</span>
						) : (
							<span>
								Withdraw ETH from the Sybil contract. You must maintain minimum
								balance.
							</span>
						)}
					</div>
				);
			case 'vouch':
				return (
					<div className="mt-1 text-xs text-gray-400">
						{!hasContractBalance ? (
							<span className="text-red-400">
								First deposit to use this functionality.
							</span>
						) : (
							<span>
								Vouch for another account. Both accounts must have non-zero
								balances.
							</span>
						)}
					</div>
				);
			case 'unvouch':
				return (
					<div className="mt-1 text-xs text-gray-400">
						{!hasContractBalance ? (
							<span className="text-red-400">
								First deposit to use this functionality.
							</span>
						) : (
							<span>
								Remove your vouch for another account. You must have previously
								vouched for them.
							</span>
						)}
					</div>
				);
			case 'explode':
				return (
					<div className="mt-1 text-xs text-gray-400">
						{!hasContractBalance ? (
							<span className="text-red-400">
								First deposit to use this functionality.
							</span>
						) : (
							<span>
								Explode accounts that have vouched for you. They&apos;ll lose
								funds up to the explode amount.
							</span>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	const txTypeOptions = [
		{ value: 'deposit', label: 'Deposit' },
		{ value: 'withdraw', label: 'Withdraw' },
		{ value: 'vouch', label: 'Vouch' },
		{ value: 'unvouch', label: 'Unvouch' },
		{ value: 'explode', label: 'Explode' },
	];

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
						options={txTypeOptions}
						value={txType}
						onChange={(e) => {
							// Only allow changing to non-deposit types if user has a contract balance
							if (!hasContractBalance && e !== 'deposit') {
								setError(
									'You need to make a deposit first to use this functionality',
								);
								return;
							}
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
						<div className="space-y-2">
							<div className="text-sm text-gray-500">
								Current Wallet Balance:{' '}
								{balance ? `${balance} ETH` : 'Loading...'}
							</div>

							<div className="text-sm">
								{hasContractBalance && contractBalance ? (
									<span className="text-green-500">
										Deposited Amount:{' '}
										{ethers.utils.formatEther(contractBalance.toString())} ETH
									</span>
								) : (
									<span className="text-yellow-500">
										You haven't deposited any funds yet. Deposit to unlock all
										features.
									</span>
								)}
							</div>
						</div>
					)}

					{['vouch', 'unvouch', 'explode'].includes(txType) && (
						<>
							<Input
								disabled={
									!isConnected || (txType !== 'deposit' && !hasContractBalance)
								}
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
						<div className="flex flex-col space-y-2">
							<div className="flex space-x-2">
								<Input
									disabled={
										!isConnected ||
										(txType !== 'deposit' && !hasContractBalance)
									}
									label="Amount (ETH)"
									placeholder="Enter amount"
									type="number"
									value={txAmount}
									onChange={(e) => setTxAmount(e.target.value)}
								/>
								<Button
									className="mt-6 px-2 py-1 text-sm"
									disabled={
										!isConnected ||
										!balance ||
										(txType !== 'deposit' && !hasContractBalance)
									}
									onClick={handleSetMaxAmount}
								>
									Max
								</Button>
							</div>
							{txType === 'deposit' && balance && (
								<div className="text-xs text-gray-400">
									<div>Available wallet balance: {balance} ETH</div>
									{txAmount && parseFloat(txAmount) > 0 && (
										<div
											className={
												parseFloat(txAmount) > parseFloat(balance)
													? 'mt-1 text-red-400'
													: 'mt-1 text-green-400'
											}
										>
											{parseFloat(txAmount) > parseFloat(balance)
												? 'Amount exceeds available balance'
												: 'Valid amount'}
										</div>
									)}
								</div>
							)}
							{txType === 'withdraw' && contractBalance && (
								<div className="text-xs text-gray-400">
									<div>
										Available contract balance:{' '}
										{ethers.utils.formatEther(contractBalance.toString())} ETH
									</div>
									{txAmount && parseFloat(txAmount) > 0 && (
										<div
											className={
												parseFloat(txAmount) >
												parseFloat(
													ethers.utils.formatEther(contractBalance.toString()),
												)
													? 'mt-1 text-red-400'
													: 'mt-1 text-green-400'
											}
										>
											{parseFloat(txAmount) >
											parseFloat(
												ethers.utils.formatEther(contractBalance.toString()),
											)
												? 'Amount exceeds contract balance'
												: 'Valid amount'}
										</div>
									)}
								</div>
							)}
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
							disabled={
								!isConnected ||
								isTransactionProcessing ||
								(txType !== 'deposit' && !hasContractBalance)
							}
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
