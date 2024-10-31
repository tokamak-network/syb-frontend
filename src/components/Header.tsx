"use client";

import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row justify-center items-center p-8 text-white relative">
      <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 md:mb-0 text-xl font-bold">
        <Link
          href="/"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/register"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Register
        </Link>
        <Link
          href="/dashboard"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/explore"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Explore
        </Link>
        <Link
          href="/settings"
          className="hover:bg-blue-500 rounded px-8 py-1 transition-colors duration-200"
        >
          Settings
        </Link>
      </nav>
    </header>
  );
};

export default Header;
