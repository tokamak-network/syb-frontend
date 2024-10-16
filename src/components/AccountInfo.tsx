"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import AccountDetailsCard from "./cards/AccountDetails";
import VouchDetailsCard from "./cards/VouchDetails";
import RankDetailsCard from "./cards/RankDetails";
import ActivityDetailsCard from "./cards/ActivityDetails";

const AccountInfo: React.FC = () => {
  const { account, balance } = useWallet();
  return (
    <div className="flex flex-col space-y-5">
      <p className="text-4xl">Account Information</p>
      <div className="flex lg:flex-row flex-col gap-5 justify-between items-center">
        {balance && account && (
          <>
            <AccountDetailsCard balance={Number(balance)} address={account} />
            <VouchDetailsCard vouches={500} />
            <RankDetailsCard rank={1} score={2.39} totalUsers={8888} />
            <ActivityDetailsCard />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
