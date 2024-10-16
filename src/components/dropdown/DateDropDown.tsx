import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdKeyboardArrowDown } from "react-icons/md";

const DateDropdownMenu: React.FC = () => {
  // State to manage the selected date
  const [selectedDate, setSelectedDate] = useState<string>("Today");

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="text-[#969CCB] px-4 py-2 rounded inline-flex items-center">
        {selectedDate}
        <MdKeyboardArrowDown className="ml-2" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white text-[#969CCB] rounded-md shadow-md mt-2 z-20"
        align="start"
        sideOffset={5}
      >
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:border-0 rounded-md duration-150"
          onSelect={() => handleSelectDate("Today")}
        >
          Today
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:border-0 rounded-md duration-150"
          onSelect={() => handleSelectDate("Yesterday")}
        >
          Yesterday
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:border-0 rounded-md duration-150"
          onSelect={() => handleSelectDate("1 week ago")}
        >
          1 week ago
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:border-0 rounded-md duration-150"
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
            onChange={(e) => {
              handleSelectDate(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DateDropdownMenu;
