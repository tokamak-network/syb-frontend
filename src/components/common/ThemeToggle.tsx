'use client';

import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
	const { theme, setTheme } = useTheme();

	return (
		<ToggleGroup.Root
			className="flex space-x-2"
			type="single"
			value={theme}
			onValueChange={(value) =>
				value && setTheme(value as 'light' | 'dark' | 'dim')
			}
		>
			<ToggleGroup.Item
				className={`rounded px-4 py-2 ${
					theme === 'light'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 text-black'
				}`}
				value="light"
			>
				Light
			</ToggleGroup.Item>
			<ToggleGroup.Item
				className={`rounded px-4 py-2 ${
					theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
				}`}
				value="dark"
			>
				Dark
			</ToggleGroup.Item>
			<ToggleGroup.Item
				className={`rounded px-4 py-2 ${
					theme === 'dim' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
				}`}
				value="dim"
			>
				Dim
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
};
