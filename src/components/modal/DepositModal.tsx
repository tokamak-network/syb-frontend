import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { useForm, Controller } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';

import { useWallet } from '@/context/WalletContext';
import { Button, Modal } from '@/components';
import { NETWORKS } from '@/const/networks';
import { depositETH } from '@/blockchain';

interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDeposit: (amount: number) => void;
	network: string;
}

interface FormData {
	amount: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({
	isOpen,
	onClose,
	network,
}) => {
	const { balance, updateBalance } = useWallet();
	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
		watch,
	} = useForm<FormData>();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

	const amount = watch('amount', 0);

	const onSubmit = (data: FormData) => {
		setIsConfirmOpen(true);
	};

	const handleConfirmDeposit = async (data: FormData) => {
		setIsLoading(true);
		setIsSuccess(false);
		setIsConfirmOpen(false);
		try {
			await handleDeposit(data.amount);
			setIsSuccess(true);
			updateBalance();
		} catch (error) {
			console.error('Deposit failed:', error);
		} finally {
			setIsLoading(false);
			reset();
		}
	};

	const handleDeposit = async (amount: number) => {
		const platformAddress = '0xF48242C4C352C778e98Cfc365752e9229C9eF737';

		await depositETH(amount, platformAddress);
	};

	useEffect(() => {
		if (!isOpen) {
			setIsSuccess(false);
			reset();
		}
	}, [isOpen, reset]);

	const newBalance = balance ? parseFloat(balance) - amount : 0;

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md" />
			<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
				<div className="relative w-1/3 rounded-lg bg-modal-primary p-6 shadow-2xl">
					<Dialog.Close className="absolute right-2 top-2 text-white hover:text-gray-300 focus:outline-none">
						&times;
					</Dialog.Close>
					<Tabs.Root className="w-full" defaultValue="deposit">
						<Tabs.List className="mb-4 flex justify-between rounded-3xl border border-dialog-tab-border bg-dialog-background bg-opacity-20 p-1">
							<Tabs.Trigger
								className="flex-1 rounded-3xl py-3 font-openSans text-xl text-dialog-tab-text hover:bg-dialog-tab-hover hover:text-white data-[state=active]:bg-dialog-tab-active"
								value="deposit"
							>
								Deposit
							</Tabs.Trigger>
							<Tabs.Trigger
								className="flex-1 rounded-3xl py-3 font-openSans text-xl text-dialog-tab-text hover:bg-dialog-tab-hover hover:text-white data-[state=active]:bg-dialog-tab-active"
								value="withdraw"
							>
								Withdraw
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content
							className="w-full rounded-lg border-2 border-dialog-content-border bg-dialog-content p-4 text-white"
							value="deposit"
						>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="relative mb-4 w-full">
									<Label.Root
										className="block rounded-sm bg-opacity-50 font-openSans text-xl font-bold text-white"
										htmlFor="network"
									>
										From Network
									</Label.Root>
									<Select.Root>
										<Select.Trigger className="mt-1 flex w-full items-center justify-between rounded border bg-gray-500 p-2 font-openSans font-semibold text-white">
											<Select.Value placeholder={network.toUpperCase()} />
											<Select.Icon>
												<FaChevronDown />
											</Select.Icon>
										</Select.Trigger>
										<Select.Content className="w-full">
											<Select.ScrollDownButton />
											<Select.Viewport className="relative w-full">
												{NETWORKS.map((network) => (
													<Select.Item
														key={network.value}
														className="w-full bg-gray-500 p-2 font-anekDevanagari font-bold text-white data-[highlighted]:bg-gray-600"
														value={network.value}
													>
														{network.label}
													</Select.Item>
												))}
											</Select.Viewport>
											<Select.ScrollUpButton />
										</Select.Content>
									</Select.Root>
								</div>
								<div className="mb-4">
									<Label.Root
										className="block font-openSans text-xl font-bold text-white"
										htmlFor="amount"
									>
										Amount
									</Label.Root>
									<Controller
										control={control}
										defaultValue={0}
										name="amount"
										render={({ field }) => (
											<input
												{...field}
												className="w-full flex-1 rounded border bg-white/20 p-2 text-white hover:outline-none"
												id="amount"
												placeholder="0.00"
												type="number"
											/>
										)}
										rules={{
											required: 'Amount is required',
											min: { value: 0.01, message: 'Minimum amount is 0.01' },
											max: {
												value: parseFloat(balance || '0'),
												message: 'Amount exceeds wallet balance',
											},
										}}
									/>
									{errors.amount && (
										<p className="text-red-700">{errors.amount.message}</p>
									)}
									<p className="mt-1 font-openSans text-xl font-bold">
										Balance: {balance} ETH
									</p>
								</div>
								<div className="mb-4">
									<p className="font-openSans text-xl font-bold text-white">
										You will deposit {amount} ETH
									</p>
									<p className="font-openSans text-xl font-bold text-white">
										New Balance: {newBalance.toFixed(4)} ETH
									</p>
								</div>
								<div className="flex justify-center">
									<Button
										className="w-full bg-dialog-button font-anekDevanagari text-2xl font-bold text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600"
										disabled={!!errors.amount}
										type="submit"
									>
										{isLoading ? (
											<span className="flex items-center justify-center">
												<svg
													className="mr-2 h-5 w-5 animate-spin text-white"
													fill="none"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
														fill="currentColor"
													/>
												</svg>
												Processing...
											</span>
										) : (
											'Deposit'
										)}
									</Button>
								</div>
								{isSuccess && (
									<p className="mt-4 text-center text-green-500">
										Deposit successful!
									</p>
								)}
							</form>
						</Tabs.Content>
						<Tabs.Content
							className="rounded-lg border-2 border-dialog-content-border bg-dialog-content p-4 text-white"
							value="withdraw"
						>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mb-4 font-anekDevanagari text-white">
									<Label.Root
										className="block bg-opacity-50 font-openSans text-xl font-bold text-white"
										htmlFor="network"
									>
										To Network
									</Label.Root>
									<Select.Root>
										<Select.Trigger className="mt-1 w-full rounded border bg-gray-500 p-2 font-openSans font-semibold text-white">
											<Select.Value placeholder="Ethereum" />
										</Select.Trigger>
										<Select.Content className="w-full rounded bg-white shadow-lg">
											{NETWORKS.map((network) => (
												<Select.Item
													key={network.value}
													className="w-full bg-gray-500 p-2 font-anekDevanagari font-bold text-white data-[highlighted]:bg-gray-600"
													value={network.value}
												>
													{network.label}
												</Select.Item>
											))}
										</Select.Content>
									</Select.Root>
								</div>
								<div className="mb-4 text-white">
									<Label.Root
										className="block font-openSans text-xl font-bold text-white"
										htmlFor="amount"
									>
										Amount
									</Label.Root>
									<Controller
										control={control}
										defaultValue={0}
										name="amount"
										render={({ field }) => (
											<input
												{...field}
												className="w-full flex-1 rounded border bg-white/20 p-2 font-openSans font-medium text-white hover:outline-none"
												id="amount"
												placeholder="0.00"
												type="number"
											/>
										)}
										rules={{
											required: 'Amount is required',
											min: { value: 0.01, message: 'Minimum amount is 0.01' },
											max: {
												value: parseFloat(balance || '0'),
												message: 'Amount exceeds wallet balance',
											},
										}}
									/>
									{errors.amount && (
										<p className="text-red-500">{errors.amount.message}</p>
									)}
									<p className="mt-1 font-openSans text-xl font-bold">
										Balance: {balance} ETH
									</p>
								</div>
								<div className="mb-4 font-anekDevanagari text-white">
									<p className="font-openSans text-xl font-bold text-white">
										You will withdraw {getValues('amount')} ETH
									</p>
								</div>
								<div className="flex justify-center">
									<Button
										className="w-full bg-dialog-button font-anekDevanagari text-2xl font-bold text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600"
										disabled={!!errors.amount}
										type="submit"
									>
										Withdraw
									</Button>
								</div>
							</form>
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</Dialog.Content>
			<Modal
				className="z-50"
				content={`Are you sure you want to deposit ${amount} ETH?`}
				isOpen={isConfirmOpen}
				title={'Confirm Deposit'}
				onClose={() => setIsConfirmOpen(false)}
			>
				<div className="p-6">
					<div className="mt-6 flex justify-center space-x-4">
						<Button
							className="bg-red-500 text-white"
							onClick={() => setIsConfirmOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="bg-green-500 text-white"
							onClick={() => handleConfirmDeposit({ amount })}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
		</Dialog.Root>
	);
};
