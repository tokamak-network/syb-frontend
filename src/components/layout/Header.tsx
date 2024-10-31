'use client';

import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
	return (
		<header className="relative flex flex-col items-center justify-center p-8 text-white md:flex-row">
			<nav className="mb-4 flex flex-col space-y-2 text-xl font-bold md:mb-0 md:flex-row md:space-x-2 md:space-y-0">
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/"
				>
					Home
				</Link>
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/register"
				>
					Register
				</Link>
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/dashboard"
				>
					Dashboard
				</Link>
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/explore"
				>
					Explore
				</Link>
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/settings"
				>
					Settings
				</Link>
			</nav>
		</header>
	);
};
