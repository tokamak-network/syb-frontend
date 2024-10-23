"use client";

import React from "react";
import { formatFullTime, formatTime } from "@/utils"; // Ensure this path is correct
import { transactionData } from "@/data/transactionData";
import TxStatus from "./TxStatus";
import TxTypes from "./TxType";

const TransactionTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full table-auto divide-y divide-gray-300 rounded-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Transaction Hash
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              To
            </th>
            <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
              Txn Fee
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactionData.map((transaction, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } text-gray-700 hover:bg-gray-100 transition-colors duration-300`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-left font-normal">
                {`0xHash${index}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left font-normal">
                {formatFullTime(transaction.time)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <TxTypes txType={transaction.type} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left font-normal">
                {transaction.from}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left font-normal">
                {transaction.to}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-normal">
                {transaction.amount} ETH
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-normal">
                {transaction.amount * 0.01} ETH
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <TxStatus status={transaction.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
