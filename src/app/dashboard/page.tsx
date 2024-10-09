import AccountInfo from "@/components/AccountInfo";
import UserGraph from "@/components/UserGraph";
import React from "react";

const Dashboard: React.FC = () => {
  const users = [
    {
      address: "0x800b181d71c23B25A9BCa9981c13C757043075b7",
      balance: 0,
      vouchesReceived: [
        { address: "0xUser2", amount: 1.0 },
        { address: "0xUser3", amount: 1.5 },
      ],
      score: 85,
    },
    {
      address: "0xUser2",
      balance: 1.0,
      vouchesReceived: [{ address: "0x123...", amount: 2.0 }],
      score: 60,
    },
    {
      address: "0xUser3",
      balance: 3.0,
      vouchesReceived: [{ address: "0xUser1", amount: 2.0 }],
      score: 92,
    },
  ];

  return (
    <div className="p-8 flex flex-col 2xl:flex-row gap-8">
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
