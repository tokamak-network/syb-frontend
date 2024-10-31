"use client";

import React, { useMemo } from "react";

export const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getUTCFullYear(), []);

  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      @{currentYear} SYB. All rights reserved.
    </footer>
  );
};
