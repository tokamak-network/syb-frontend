"use client";

import React, { useState } from "react";
import {
  Button,
  SearchBarComponent,
  Modal,
  UserActivityLineChart,
} from "@/components";
import ChainActivityTable from "@/components/tables/ChainActivity";
import { PiUserCircleFill } from "react-icons/pi";
import { useWallet } from "@/context/WalletContext";

const ExplorerPage: React.FC = () => {
  const { account, balance, connectWallet, isMetaMaskInstalled } = useWallet();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConnectWallet = () => {
    if (isMetaMaskInstalled) {
      connectWallet();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="flex space-x-3 items-center">
        <SearchBarComponent
          placeholder={"Search by address / txn hash / block / token..."}
        />
        <PiUserCircleFill size={39} />
        {!account ? (
          <Button
            onClick={handleConnectWallet}
            className="bg-[#1379FF] text-white rounded-xl font-kanit font-bold"
          >
            Connect Wallet
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
          <UserActivityLineChart />
        </div>
      </div>
      <ChainActivityTable />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="MetaMask Not Installed"
        content="Please install MetaMask to connect your wallet."
      >
        <Button
          onClick={() => {
            window.open(
              "https://chromewebstore.google.com/search/MetaMask",
              "_blank"
            );
          }}
          className="bg-[#1379FF] text-white rounded-xl font-kanit font-bold"
        >
          Add MetaMask
        </Button>
        <Button
          className="bg-[#1379FF] text-white rounded-xl font-kanit font-bold"
          onClick={() => setModalOpen(false)}
        >
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default ExplorerPage;
