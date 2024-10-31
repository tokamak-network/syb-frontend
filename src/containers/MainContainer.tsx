import React from "react";
import { Header, Footer } from "@/components";

const MainContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className="flex-grow px-4 w-full">
        <Header />
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default MainContainer;
