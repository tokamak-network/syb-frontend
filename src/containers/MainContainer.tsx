import React from "react";
import Header from "@/components/Header";

const MainContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className="flex-grow px-4 w-full">
        <Header />
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        @ {`${new Date().getUTCFullYear()} SYB. All rights reserved.`}
      </footer>
    </div>
  );
};

export default MainContainer;
