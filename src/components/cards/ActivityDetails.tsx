import React from "react";
import transactionData from "@/data/transactionData";
import DateSelector from "@/components/DateSelector";
import TransactionListDetailsCard from "./TransactionListDetails";
import Button from "../Button";

interface ActivityDetailsCardProps {
  onShowMore: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const ActivityDetailsCard: React.FC<ActivityDetailsCardProps> = ({
  onShowMore,
  selectedDate,
  onDateSelect,
}) => {
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const filteredTransactions = transactionData.filter((transaction) =>
    selectedDate ? isSameDay(transaction.time, selectedDate) : true
  );

  const transactionsToShow = filteredTransactions.slice(0, 3);

  return (
    <div className="flex flex-col space-y-1 w-[400px] bg-white rounded-lg p-4 h-[330px]">
      <p className="font-poppins text-2xl text-[#3F4765]">Activities</p>
      <div className="flex flex-col gap-2">
        <DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
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
            onClick={onShowMore}
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
