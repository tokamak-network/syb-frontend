"use client";

import Button from "@/components/Button";
import SearchBarComponent from "@/components/SearchBar";
import ChainActivityTable from "@/components/tables/ChainActivity";
import UserActivityChart from "@/components/UserAcrivityChart";
import React from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { useWallet } from "@/context/WalletContext";

const ExplorerPage: React.FC = () => {
  const { account, balance, connectWallet, isMetaMaskInstalled } = useWallet();

  return (
    <div className="p-8 space-y-4">
      <div className="flex space-x-3 items-center">
        <SearchBarComponent
          placeholder={"Search by address / txn hash / block / token..."}
        />
        <PiUserCircleFill size={39} />
        {!account ? (
          <Button
            onClick={connectWallet}
            className="bg-[#1379FF] text-white rounded-xl font-kanit font-bold"
          >
            {isMetaMaskInstalled ? "Connect Wallet" : "Install MetaMask"}
          </Button>
        ) : (
          <div className="flex flex-col items-start">
            <span className="text-white font-kanit">{`Account: ${account}`}</span>
            <span className="text-white font-kanit">{`Balance: ${balance} ETH`}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between space-x-10">
        <div className="flex flex-col space-y-14 text-[#9E9EA3] font-narnoor w-full">
          <div className="flex flex-col space-y-14 bg-[#1E1F2090] px-2.5 pt-5 rounded-lg">
            <span className="text-3xl">Transactions</span>
            <span className="text-xl">
              <span className="text-white text-3xl">1,129,100</span> (24h)
            </span>
          </div>
          <div className="flex flex-col space-y-14 bg-[#1E1F2090] px-2.5 pt-5 rounded-lg">
            <span className="text-3xl">Pending transactions</span>
            <span className="text-xl">
              <span className="text-white text-3xl">151</span> (24h)
            </span>
          </div>
        </div>
        <div className="bg-[#1E1F2090] w-full">
          <UserActivityChart />
        </div>
      </div>
      <ChainActivityTable />
    </div>
  );
};

export default ExplorerPage;
