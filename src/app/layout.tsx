import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import dynamic from "next/dynamic";

const MainContainer = dynamic(() => import("@/containers/MainContainer"), {
  ssr: false,
});

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <WalletProvider>
        <body
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
            <MainContainer>{children}</MainContainer>
          </div>
        </body>
      </WalletProvider>
    </html>
  );
}
