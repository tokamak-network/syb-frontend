"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import { shortenAddress } from "@/utils";

const AccountInfo: React.FC = () => {
  const { account, balance } = useWallet();
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Account Information</h3>
      <div className="text-gray-700">
        <p>
          <strong>Address:</strong> {account || "Not connected"}
        </p>
        <p>
          <strong>Balance:</strong> {balance ? `${balance} ETH` : "0 ETH"}
        </p>
      </div>
    </div>
  );
};

export default AccountInfo;
