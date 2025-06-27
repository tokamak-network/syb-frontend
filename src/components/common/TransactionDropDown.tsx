'use client';

import React from 'react';
import { FaList, FaClock, FaCheck } from 'react-icons/fa';

import { useTheme } from '@/context/ThemeContext';

import { Button } from '../button';

import { Dropdown } from './DropDown';

interface TransactionDropDownProps {
	value: string;
	onChange: (value: string) => void;
}

export const TransactionDropDown: React.FC<TransactionDropDownProps> = ({
	value,
	onChange,
}) => {
	const transactionOptions = [
		{
			value: 'all',
			label: 'All Transactions',
			icon: <FaList className="text-blue-500" size={16} />,
		},
		{
			value: 'pending',
			label: 'Pending Transactions',
			icon: <FaClock className="text-yellow-500" size={16} />,
		},
		{
			value: 'forged',
			label: 'Forged Transactions',
			icon: <FaCheck className="text-green-500" size={16} />,
		},
	];

	const currentOption = transactionOptions.find(
		(option) => option.value === value,
	);

	return (
		<Dropdown
			items={transactionOptions}
			renderItem={(item) => (
				<div className="items-left flex space-x-2">
					{item.icon}
					<span className="text-sm">{item.label}</span>
				</div>
			)}
			triggerContent={
				<Button
					aria-label="Select Theme"
					className={'flex items-center justify-center rounded-full'}
				>
					{currentOption?.icon}
					<span className="px-2 text-sm">{currentOption?.label}</span>
				</Button>
			}
			onItemSelect={(item) => onChange(item.value)}
		/>
	);
};
