import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SYB",
  description: "Tokamak Sybil-Resistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex flex-col min-h-screen"
        style={{
          backgroundImage: "url(/images/back0.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            backgroundImage: "url(/images/back1.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "1000px",
          }}
        >
          <Header />
          {/* Main content area */}
          <main className="flex-grow  px-4 w-full">{children}</main>
          {/* Footer or additional layout */}
        </div>
        <footer className="bg-gray-800 text-white p-4 text-center">
          @ {`${new Date().getUTCFullYear()} SYB. All rights reserved.`}
        </footer>
      </body>
    </html>
  );
}
