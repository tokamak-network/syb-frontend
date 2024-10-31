'use client';

import React, { useMemo } from 'react';

export const Footer: React.FC = () => {
	const currentYear = useMemo(() => new Date().getUTCFullYear(), []);

	return (
		<footer className="bg-gray-800 p-4 text-center text-white">
			@{currentYear} SYB. All rights reserved.
		</footer>
	);
};
