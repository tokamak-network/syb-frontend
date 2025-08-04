import React from 'react';
import { FaSun, FaMoon, FaAdjust } from 'react-icons/fa';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

import { Dropdown } from './DropDown';

interface ThemeDropdownProps {
	className?: string;
}

export const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ className }) => {
	const { theme, setTheme } = useTheme();

	const themeOptions = [
		{
			value: 'light',
			label: 'Light',
			icon: <FaSun className="text-yellow-500" size={16} />,
		},
		{
			value: 'dark',
			label: 'Dark',
			icon: <FaMoon className="text-gray-800" size={16} />,
		},
		{
			value: 'dim',
			label: 'Dim',
			icon: <FaAdjust className="text-purple-500" size={16} />,
		},
	];

	const currentThemeIcon = themeOptions.find(
		(option) => option.value === theme,
	)?.icon;

	return (
		<div className={cn(className)}>
			<Dropdown
				items={themeOptions}
				renderItem={(item) => (
					<div className="flex items-center space-x-2">{item.icon}</div>
				)}
				side="left"
				triggerContent={
					<button
						aria-label="Select Theme"
						className={`flex h-10 w-10 items-center justify-center rounded-lg ${
							theme === 'light'
								? 'bg-gray-200 text-black'
								: theme === 'dark'
									? 'bg-black text-white'
									: 'bg-gray-600 text-gray-200'
						}`}
					>
						{currentThemeIcon}
					</button>
				}
				onItemSelect={(item) =>
					setTheme(item.value as 'light' | 'dark' | 'dim')
				}
			/>
		</div>
	);
};
