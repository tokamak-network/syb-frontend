import React from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  placeholder: string;
}

export const SearchBarComponent: React.FC<SearchBarProps> = ({
  placeholder,
}) => {
  return (
    <div className="border border-white items-center flex space-x-2 justify-start px-4 py-2 rounded-lg w-full font-montserrat">
      <CiSearch className="text-xl" />
      <input
        className="w-full bg-inherit focus:outline-none"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};
