"use client";

import React from "react";
import AccountInfo from "@/components/AccountInfo";
import UserGraph from "@/components/UserGraph";
import { users } from "@/data/userData";

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 flex flex-col 3xl:flex-row gap-8">
      <div className="flex-1">
        <AccountInfo />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">User Connections</h3>
        <UserGraph users={users} />
      </div>
    </div>
  );
};

export default Dashboard;
