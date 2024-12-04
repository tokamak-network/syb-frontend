import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
	return (
		<DropdownMenu.Root modal={false}>
			<DropdownMenu.Trigger asChild>
				<button className="flex items-center justify-center">
					{triggerContent}
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={`z-200 rounded-md bg-white p-2 shadow-lg ${dropdownClassName}`}
					sideOffset={sideOffset}
				>
					{items.map((item, index) => (
						<DropdownMenu.Item
							key={index}
							className={`z-30 cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100 ${itemClassName}`}
							onSelect={() => onItemSelect(item)}
						>
							{renderItem(item, index)}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
