import React from "react";
import Button from "../Button";
import explorerData from "@/data/explorerData";
import TxTypes from "./TxType";
import TxStatus from "./TxStatus";
import UserAddress from "./UserAddress";
import { HiOutlineArrowDown } from "react-icons/hi";

// interface ChainActivityTableProps {
// }

const ChainActivityTable: React.FC = () => {
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex justify-between">
        <div className="flex justify-between font-narnoor space-x-3">
          <Button className="bg-[#1B202C] text-center">Validated</Button>
          <Button className="bg-[#101112]">Pending</Button>
        </div>
        <div className="flex space-x-2 font-narnoor">
          <Button className="bg-[#1B202C] text-center text-[#6290B6] border-2 border-[#23323E]">
            First
          </Button>
          <div className="flex space-x-3">
            <Button className="bg-[#101112] text-[#6290B6] border-2 border-[#23323E]">
              {"<"}
            </Button>
            <Button className="bg-[#4B5569]">{"1"}</Button>
            <Button className="bg-[#101112] text-[#6290B6] border-2 border-[#23323E]">
              {">"}
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto rounded-lg">
          <thead className="bg-[#232425] text-[#B0B0B0] font-abhaya">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Transaction Hash
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Block
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                From/To
              </th>
              <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
                Value ETH
              </th>
              <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
                Fee ETh
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#101112] font-abhaya">
            <tr>
              <td colSpan={7} className="px-6 py-1 bg-[#353025]">
                <span className="text-[#4897EF]">9903 more transactions </span>
                <span className="text-[#D7BC90]">have come in</span>
              </td>
            </tr>
            {explorerData.map((transaction, index) => (
              <tr
                key={index}
                className={`bg-[#101112] text-gray-700 font-abhaya hover:bg-[#26292c] border-b-2 border-[#232425] transition-colors duration-300`}
              >
                <td className="px-6 py-2 flex flex-col space-y-4 whitespace-nowrap text-left font-normal">
                  <span className="text-[#70B4E8]">{`0xHash${index}`}</span>
                  <span className="text-[#FFFFFF]">{"1m ago"}</span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-left font-normal space-y-2">
                  <TxTypes txType={transaction.type.txType} />
                  <TxStatus status={transaction.type.txStatus} />
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-left font-normal">
                  <span className="px-2 py-1 rounded-lg bg-[#1E1F20] text-[#E6D7BE] font-abhaya">
                    {transaction.method.toLocaleLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-left text-[#70B4E8] font-normal">
                  {transaction.blockNumber}
                </td>
                <td className="px-6 py-2 flex whitespace-nowrap text-left font-normal">
                  <HiOutlineArrowDown
                    className="text-gray-500 mt-3"
                    size={16}
                  />
                  <div>
                    <UserAddress address={transaction.txUser.from} />
                    <UserAddress address={transaction.txUser.to} />
                  </div>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-right font-acme font-normal">
                  {transaction.value}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-right font-acme font-normal">
                  {transaction.fee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChainActivityTable;
