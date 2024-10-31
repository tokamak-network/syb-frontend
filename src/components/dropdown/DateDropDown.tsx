'use client';

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface DateDropdownMenuProps {
	onDateSelect: (date: Date) => void;
}

export const DateDropdownMenu: React.FC<DateDropdownMenuProps> = ({
	onDateSelect,
}) => {
	const [displayDate, setDisplayDate] = useState<string>('Today');

	const handleSelectDate = (label: string) => {
		const date = new Date();

		switch (label) {
			case 'Yesterday':
				date.setDate(date.getDate() - 1);
				break;
			case '1 week ago':
				date.setDate(date.getDate() - 7);
				break;
			case '1 month ago':
				date.setMonth(date.getMonth() - 1);
				break;
			default:
				break;
		}
		setDisplayDate(label);
		onDateSelect(date);
	};

	const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value);

		setDisplayDate(e.target.value);
		onDateSelect(date);
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="inline-flex items-center rounded py-2 text-[#969CCB]">
				{displayDate}
				<MdKeyboardArrowDown className="ml-2" />
			</DropdownMenu.Trigger>

			<DropdownMenu.Content
				align="start"
				className="z-20 mt-2 rounded-md bg-white text-[#969CCB] shadow-md"
				sideOffset={5}
			>
				<DropdownMenu.Item
					className="cursor-pointer rounded-md px-4 py-2 duration-150 hover:bg-blue-500"
					onSelect={() => handleSelectDate('Today')}
				>
					Today
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="cursor-pointer rounded-md px-4 py-2 duration-150 hover:bg-blue-500"
					onSelect={() => handleSelectDate('Yesterday')}
				>
					Yesterday
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="cursor-pointer rounded-md px-4 py-2 duration-150 hover:bg-blue-500"
					onSelect={() => handleSelectDate('1 week ago')}
				>
					1 week ago
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="cursor-pointer rounded-md px-4 py-2 duration-150 hover:bg-blue-500"
					onSelect={() => handleSelectDate('1 month ago')}
				>
					1 month ago
				</DropdownMenu.Item>
				<DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
				<DropdownMenu.Item
					className="px-4 py-2"
					onSelect={(e) => e.preventDefault()}
				>
					<input
						className="rounded border border-gray-300 px-2 py-1"
						type="date"
						onChange={handleDateInputChange}
						onClick={(e) => e.stopPropagation()}
					/>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
