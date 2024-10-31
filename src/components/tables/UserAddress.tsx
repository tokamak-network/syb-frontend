"use client";

import React from "react";
import { FiUser, FiCopy } from "react-icons/fi";

interface UserAddressProps {
  address: string;
}

const UserAddress: React.FC<UserAddressProps> = ({ address }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="flex items-center space-x-2">
      <FiUser className="text-blue-500" size={20} />
      <span className="text-[#70B4E8] font-acme">{address}</span>
      <button
        onClick={copyToClipboard}
        className="text-gray-500 hover:text-white"
      >
        <FiCopy size={16} />
      </button>
    </div>
  );
};

export default UserAddress;
