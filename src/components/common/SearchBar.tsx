'use client';

import React from 'react';
import { CiSearch } from 'react-icons/ci';

import { useTheme } from '@/context';

interface SearchBarProps {
	placeholder: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBarComponent: React.FC<SearchBarProps> = ({
	placeholder,
	onChange,
}) => {
	const { theme } = useTheme();

	const borderColor =
		theme === 'light'
			? 'border-gray-300'
			: theme === 'dark'
				? 'border-gray-700'
				: 'border-purple-500';

	return (
		<div
			className={`flex w-full items-center justify-start space-x-2 rounded-lg border ${borderColor} px-4 py-2 font-montserrat`}
		>
			<CiSearch className="text-xl" />
			<input
				className="w-full bg-inherit focus:outline-none"
				placeholder={placeholder}
				type="text"
				onChange={onChange}
			/>
		</div>
	);
};
