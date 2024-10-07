"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { useWallet } from "@/context/WalletContext";
import Modal from "./Modal";
import { cn } from "@/utils/cn";

const Header: React.FC = () => {
  const { account, connectWallet, isMetaMaskInstalled } = useWallet();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleConnectWallet = async () => {
    setLoading(true);
    if (!isMetaMaskInstalled) {
      setModalOpen(true);
      setLoading(true);
    } else {
      await connectWallet();
      setModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setLoading(false);
  };

  return (
    <header className="flex flex-col md:flex-row justify-center items-center p-8 text-white relative">
      <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 md:mb-0 text-xl font-bold">
        <Link
          href="/"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/register"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Register
        </Link>
        <Link
          href="/dashboard"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/leaderboard"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Leaderboard
        </Link>
        <Link
          href="/settings"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Settings
        </Link>
      </nav>
      <div>
        {account ? (
          <p>{account}</p>
        ) : (
          <Button
            backgroundImage="/images/button1.png"
            className="absolute right-5 font-bold w-80"
            isLoading={isLoading}
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        className="bg-black"
      >
        <h2 className="text-lg font-bold mb-4">MetaMask Not Installed</h2>
        <p className="mb-4">You need to install MetaMask to continue.</p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => {
              window.open(
                "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
                "_blank"
              );
              setLoading(false);
            }}
            className={cn("bg-blue-500 text-white px-4 py-2 rounded")}
          >
            Add MetaMask
          </Button>
          <Button
            onClick={handleModalClose}
            className={cn("bg-gray-500 text-white px-4 py-2 rounded")}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
