import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { useForm, Controller } from 'react-hook-form';

import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components';
import { NETWORKS } from '@/const/networks';

interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDeposit: (amount: number) => void;
}

interface FormData {
	amount: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({
	isOpen,
	onClose,
	onDeposit,
}) => {
	const { balance } = useWallet();
	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<FormData>();

	const onSubmit = (data: FormData) => {
		onDeposit(data.amount);
		onClose();
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md" />
			<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
				<div className="relative w-1/3 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 shadow-2xl">
					<Dialog.Close className="absolute right-2 top-2 text-white hover:text-gray-300 focus:outline-none">
						&times;
					</Dialog.Close>
					<Tabs.Root defaultValue="deposit">
						<Tabs.List className="mb-4 flex justify-between rounded-lg border border-white bg-opacity-20 p-1">
							<Tabs.Trigger
								className="flex-1 py-3 font-openSans text-xl text-white data-[state=active]:rounded-lg data-[state=active]:bg-white/20 data-[state=active]:font-bold"
								value="deposit"
							>
								Deposit
							</Tabs.Trigger>
							<Tabs.Trigger
								className="flex-1 py-3 font-openSans text-xl text-white data-[state=active]:rounded-lg data-[state=active]:bg-white/20 data-[state=active]:font-bold"
								value="withdraw"
							>
								Withdraw
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content
							className="rounded-lg bg-opacity-20 p-2 text-white"
							value="deposit"
						>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mb-4">
									<Label.Root
										className="block rounded-sm bg-opacity-50 font-openSans text-xl font-bold text-white"
										htmlFor="network"
									>
										From Network
									</Label.Root>
									<Select.Root>
										<Select.Trigger className="mt-1 w-full rounded border bg-white/20 p-2 font-openSans font-semibold text-white">
											<Select.Value placeholder="Ethereum Mainnet" />
										</Select.Trigger>
										<Select.Content className="w-full rounded bg-white/20 shadow-lg">
											<Select.ScrollUpButton />
											<Select.Viewport className="w-full">
												{NETWORKS.map((network) => (
													<Select.Item
														key={network.value}
														className="w-full bg-secondary/95 p-2 font-anekDevanagari font-bold text-white data-[highlighted]:bg-blue-200"
														value={network.value}
													>
														{network.label}
													</Select.Item>
												))}
											</Select.Viewport>
											<Select.ScrollDownButton />
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
										You will deposit {getValues('amount')} ETH
									</p>
								</div>
								<div className="flex justify-center">
									<Button
										className="w-full bg-gradient-to-r from-blue-500 to-green-500 font-anekDevanagari text-2xl font-bold text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600"
										disabled={!!errors.amount}
										type="submit"
									>
										Deposit
									</Button>
								</div>
							</form>
						</Tabs.Content>
						<Tabs.Content
							className="rounded-lg bg-opacity-20 p-2 text-white"
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
										<Select.Trigger className="mt-1 w-full rounded border bg-white/20 p-2 font-openSans font-semibold text-white">
											<Select.Value placeholder="Ethereum Mainnet" />
										</Select.Trigger>
										<Select.Content className="w-full rounded bg-white shadow-lg">
											{NETWORKS.map((network) => (
												<Select.Item
													key={network.value}
													className="w-full bg-secondary/95 p-2 font-anekDevanagari font-bold text-white data-[highlighted]:bg-blue-200"
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
										className="w-full bg-gradient-to-r from-blue-500 to-green-500 font-anekDevanagari text-2xl font-bold text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600"
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
		</Dialog.Root>
	);
};
