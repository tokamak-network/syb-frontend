import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useTheme } from '@/context/ThemeContext';
import { themeStyles } from '@/const';
import { Button } from '../button';

interface DropdownProps<T> {
	items: T[]; // Array of items to display in the dropdown
	renderItem: (item: T, index: number) => React.ReactNode; // Function to render each item
	onItemSelect: (item: T) => void; // Callback when an item is selected
	triggerContent: React.ReactNode; // Content for the dropdown trigger
	dropdownClassName?: string; // Optional className for dropdown content
	itemClassName?: string; // Optional className for dropdown items
	sideOffset?: number; // Optional offset for dropdown positioning
}

export const Dropdown = <T,>({
	items,
	renderItem,
	onItemSelect,
	triggerContent,
	dropdownClassName = '',
	itemClassName = '',
	sideOffset = 5,
}: DropdownProps<T>) => {
	const { theme } = useTheme();

	const currentThemeStyles = themeStyles[theme];
	const [selectedItem, setSelectedItem] = useState<T>();

	return (
		<DropdownMenu.Root modal={false}>
			<DropdownMenu.Trigger asChild>
				<Button
					className={`flex items-center justify-center rounded-md px-4 py-2 outline-none transition-all duration-200`}
				>
					{triggerContent}
				</Button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={`z-200 rounded-md p-2 shadow-lg transition-all duration-200 ${dropdownClassName}`}
					sideOffset={sideOffset}
				>
					{items.map((item, index) => (
						<DropdownMenu.Item
							key={index}
							className={`cursor-pointer rounded-md px-3 py-2 outline-none transition-all duration-200 ${
								selectedItem === item ? currentThemeStyles.selectedColor : ''
							} ${currentThemeStyles.hoverBg} ${currentThemeStyles.hoverText} ${itemClassName}`}
							onSelect={() => {
								setSelectedItem(item);
								onItemSelect(item);
							}}
						>
							{renderItem(item, index)}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
