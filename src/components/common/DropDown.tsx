import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useTheme } from '@/context/ThemeContext';
import { themeStyles } from '@/const';

interface DropdownProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	onItemSelect: (item: T) => void;
	triggerContent: React.ReactNode;
	itemClassName?: string;
	sideOffset?: number;
}

export const Dropdown = <T,>({
	items,
	renderItem,
	onItemSelect,
	triggerContent,
	itemClassName = '',
	sideOffset = 5,
}: DropdownProps<T>) => {
	const { theme } = useTheme();

	const currentThemeStyles = themeStyles[theme];
	const [selectedItem, setSelectedItem] = useState<T>();

	return (
		<DropdownMenu.Root modal={false}>
			<DropdownMenu.Trigger
				asChild
				className={`flex items-center justify-center rounded-md outline-none transition-all duration-200 ${currentThemeStyles.text} ${currentThemeStyles.dropdownBg}`}
			>
				{triggerContent}
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={`z-50 rounded-md p-2 shadow-lg transition-all duration-200 ${currentThemeStyles.text} ${currentThemeStyles.dropdownBg}`}
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
