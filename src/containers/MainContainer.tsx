"use client";

import React, { useCallback, useState } from "react";
import Header from "@/components/Header";
const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
import Button from "@/components/Button";
import dynamic from "next/dynamic";

const MainContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setLoading(false);
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isModalOpen ? "backdrop-blur" : ""
      }`}
    >
      <Header
        setModalOpen={setModalOpen}
        setLoading={setLoading}
        isLoading={isLoading}
      />
      <main className="flex-grow px-4 w-full">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        @ {`${new Date().getUTCFullYear()} SYB. All rights reserved.`}
      </footer>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        className="custom-modal-class"
        title="MetaMask is not installed"
        content="You need to install MetaMask to use our Platform"
      >
        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => {
              window.open(
                "https://chrome.google.com/webstore/detail/metamask/",
                "_blank"
              );
            }}
            className="bg-blue-500"
          >
            Add MetaMask
          </Button>
          <Button onClick={handleModalClose} className="bg-gray-500">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MainContainer;
