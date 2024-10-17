import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdKeyboardArrowDown } from "react-icons/md";

interface DateDropdownMenuProps {
  onDateSelect: (date: Date) => void;
}

const DateDropdownMenu: React.FC<DateDropdownMenuProps> = ({
  onDateSelect,
}) => {
  const [displayDate, setDisplayDate] = useState<string>("Today");

  const handleSelectDate = (label: string) => {
    let date = new Date();
    switch (label) {
      case "Yesterday":
        date.setDate(date.getDate() - 1);
        break;
      case "1 week ago":
        date.setDate(date.getDate() - 7);
        break;
      case "1 month ago":
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
      <DropdownMenu.Trigger className="text-[#969CCB] py-2 rounded inline-flex items-center">
        {displayDate}
        <MdKeyboardArrowDown className="ml-2" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white text-[#969CCB] rounded-md shadow-md mt-2 z-20"
        align="start"
        sideOffset={5}
      >
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 rounded-md duration-150"
          onSelect={() => handleSelectDate("Today")}
        >
          Today
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 rounded-md duration-150"
          onSelect={() => handleSelectDate("Yesterday")}
        >
          Yesterday
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 rounded-md duration-150"
          onSelect={() => handleSelectDate("1 week ago")}
        >
          1 week ago
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 rounded-md duration-150"
          onSelect={() => handleSelectDate("1 month ago")}
        >
          1 month ago
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
        <DropdownMenu.Item
          className="px-4 py-2"
          onSelect={(e) => e.preventDefault()}
        >
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1"
            onChange={handleDateInputChange}
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DateDropdownMenu;
