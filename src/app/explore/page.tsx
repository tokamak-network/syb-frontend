import Button from "@/components/Button";
import SearchBarComponent from "@/components/SearchBar";
import ChainActivityTable from "@/components/tables/ChainActivity";
import UserActivityChart from "@/components/UserAcrivityChart";
import React from "react";
import { PiUserCircleFill } from "react-icons/pi";

const ExplorerPage: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      <div className="flex space-x-3 items-center">
        <SearchBarComponent
          placeholder={"Search by address / txn hash / block / token..."}
        />
        <PiUserCircleFill size={39} />
        <Button className="bg-[#1379FF] text-white rounded-xl font-kanit font-bold">
          Connect Wallet
        </Button>
      </div>
      <div className="flex">
        <div className="flex flex-col space-y-10 text-[#9E9EA3] font-narnoor">
          <div className="flex flex-col space-y-20 bg-[#1E1F20] px-2.5 pt-5 rounded-lg">
            {" "}
            {/** Transactions */}
            <span className="text-[36px]">Transactions</span>
            <span className="text-xl">
              <span className="text-white text-3xl">1,129,100</span> (24h)
            </span>
          </div>
          <div className="flex flex-col space-y-20 bg-[#1E1F20] px-2.5 pt-5 rounded-lg">
            {" "}
            {/** Pending Transactions */}
            <span className="text-[36px]">Pending transactions</span>
            <span className="text-xl">
              <span className="text-white text-3xl">151</span> (24h)
            </span>
          </div>
        </div>
        <div className="bg-[#1E1F20]">
          <UserActivityChart />
        </div>
      </div>
      <ChainActivityTable />
    </div>
  );
};

export default ExplorerPage;
