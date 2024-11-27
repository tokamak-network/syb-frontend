import React from 'react';
import { CiSearch } from 'react-icons/ci';

interface SearchBarProps {
	placeholder: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBarComponent: React.FC<SearchBarProps> = ({
	placeholder,
	onChange,
}) => {
	return (
		<div className="flex w-full items-center justify-start space-x-2 rounded-lg border border-white px-4 py-2 font-montserrat">
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
