import React from 'react';
import { FaSun, FaMoon, FaAdjust } from 'react-icons/fa';

import { useTheme } from '@/context/ThemeContext';

import { Dropdown } from './DropDown';

export const ThemeDropdown: React.FC = () => {
	const { theme, setTheme } = useTheme();

	const themeOptions = [
		{
			value: 'light',
			label: 'Light',
			icon: <FaSun className="text-yellow-500" />,
		},
		{
			value: 'dark',
			label: 'Dark',
			icon: <FaMoon className="text-gray-800" />,
		},
		{
			value: 'dim',
			label: 'Dim',
			icon: <FaAdjust className="text-purple-500" />,
		},
	];

	const currentThemeIcon = themeOptions.find(
		(option) => option.value === theme,
	)?.icon;

	return (
		<Dropdown
			dropdownClassName={`${
				theme === 'light'
					? 'bg-white text-black'
					: theme === 'dark'
						? 'bg-gray-800 text-white'
						: 'bg-gray-700 text-gray-200'
			}`}
			items={themeOptions}
			renderItem={(item) => (
				<div className="flex items-center space-x-2">
					{item.icon}
					<span className="text-sm">{item.label}</span>
				</div>
			)}
			triggerContent={
				<button
					aria-label="Select Theme"
					className={`flex h-10 w-10 items-center justify-center rounded-full ${
						theme === 'light'
							? 'bg-gray-200 text-black'
							: theme === 'dark'
								? 'bg-gray-800 text-white'
								: 'bg-gray-600 text-gray-200'
					}`}
				>
					{currentThemeIcon}
				</button>
			}
			onItemSelect={(item) => setTheme(item.value as 'light' | 'dark' | 'dim')}
		/>
	);
};
