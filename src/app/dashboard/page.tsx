"use client";

import React, { useState } from "react";
import AccountInfo from "@/components/AccountInfo";
import UserGraph from "@/components/UserGraph";
import { users } from "@/data/userData";
import TransactionTable from "@/components/tables/TransactionActivity";

const Dashboard: React.FC = () => {
  const [showTransactionTable, setShowTransactionTable] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  return (
    <div className="p-8 flex flex-col 3xl:flex-row gap-8">
      <div className="flex-1">
        <AccountInfo
          onShowMore={() => setShowTransactionTable(true)}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">User Connections</h3>
        <UserGraph users={users} />
      </div>
      {showTransactionTable && <TransactionTable selectedDate={selectedDate} />}
    </div>
  );
};

export default Dashboard;
