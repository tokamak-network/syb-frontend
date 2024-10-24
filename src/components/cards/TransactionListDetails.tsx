import React from "react";
import { ActionStatus, ActionType, TransactionType } from "@/types";
import { formatDate, formatTime } from "@/utils";

const TransactionListDetailsCard: React.FC<TransactionType> = ({
  time,
  amount,
  type,
  status,
}) => {
  // Define color styles based on ActionType
  const typeStyles = {
    [ActionType.DEPOSIT]: "text-green-500",
    [ActionType.WITHDRAW]: "text-sky-500",
    [ActionType.EXPLODE]: "text-gray-500",
    [ActionType.VOUCH]: "text-blue-500",
  };

  // Define color styles based on ActionStatus
  const statusStyles = {
    [ActionStatus.SUCCESS]: "text-green-700",
    [ActionStatus.PENDING]: "text-yellow-700",
    [ActionStatus.FAILED]: "text-red-700",
  };

  return (
    <div className="flex justify-between border-b border-gray-200">
      {/* Transaction Information */}
      <div className="flex flex-col">
        <p className={`font-poppins font-medium ${typeStyles[type]}`}>{type}</p>
        <p className={`font-poppins font-normal ${statusStyles[status]}`}>
          {status}
        </p>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-roboto font-medium text-[#24A959]">{amount} ETH</p>
        <div className="flex flex-row font-poppins text-[#818E9E] justify-between">
          <p>{formatDate(time)}</p>
          &nbsp;{"|"}&nbsp;
          <p>{formatTime(time)}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionListDetailsCard;
