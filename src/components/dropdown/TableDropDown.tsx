"use client";

import React, { useState } from "react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";

interface TableDropdownProps {
  items: number[];
  defaultValue: number;
  onChange: (value: number) => void;
  className?: string;
}

export const TableDropdown: React.FC<TableDropdownProps> = ({
  items,
  defaultValue,
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState<number>(defaultValue);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger
        className={cn(
          "px-2 py-1 border rounded bg-white text-black",
          className
        )}
      >
        {selectedValue}
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Content className="bg-white shadow-lg rounded-md text-black">
        {items.map((item) => (
          <RadixDropdownMenu.Item
            key={item}
            className="px-2 py-1 cursor-pointer hover:bg-gray-100"
            onSelect={() => handleSelect(item)}
          >
            {item}
          </RadixDropdownMenu.Item>
        ))}
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Root>
  );
};
