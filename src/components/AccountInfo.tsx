"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import AccountDetailsCard from "./cards/AccountDetails";

const AccountInfo: React.FC = () => {
  const { account, balance } = useWallet();
  return (
    <div className="flex flex-col space-y-5">
      <p className="text-4xl">Account Information</p>
      <div className="flex justify-between">
        {balance && account && (
          <AccountDetailsCard balance={Number(balance)} address={account} />
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
