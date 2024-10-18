import React, { useState } from "react";
import DateDropdownMenu from "../dropdown/DateDropDown";
import transactionData from "@/data/transactionData";
import TransactionListDetailsCard from "./TransactionListDetails";
import Button from "../Button";

const ActivityDetailsCard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const filteredTransactions = transactionData.filter((transaction) => {
    return selectedDate
      ? transaction.time.toDateString() === selectedDate.toDateString()
      : true;
  });

  const transactionsToShow = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 3);

  return (
    <div className="flex flex-col space-y-1 w-[400px] bg-white rounded-lg p-4 h-[330px]">
      <p className="font-poppins text-2xl text-[#3F4765]">Activities</p>
      <div className="flex flex-col gap-2">
        <div>
          <DateDropdownMenu onDateSelect={setSelectedDate} />
        </div>
        <div className="space-y-3">
          {transactionsToShow.length ? (
            transactionsToShow.map((transaction, index) => (
              <TransactionListDetailsCard key={index} {...transaction} />
            ))
          ) : (
            <p className="text-gray-500">
              No transactions found for this date.
            </p>
          )}
        </div>
        {filteredTransactions.length > 3 && (
          <Button
            onClick={() => setShowAll(true)}
            className="mt-2 text-blue-500 hover:underline"
          >
            Show More
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailsCard;
