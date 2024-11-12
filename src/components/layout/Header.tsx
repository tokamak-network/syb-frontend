'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export const Header: React.FC = () => {
	const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const toggleMegaMenu = () => {
		setMegaMenuOpen((prev) => !prev);
	};

	const handleButtonHover = (button: string) => {
		setActiveButton(button);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			menuRef.current &&
			!menuRef.current.contains(event.target as Node) &&
			buttonRef.current &&
			!buttonRef.current.contains(event.target as Node)
		) {
			setMegaMenuOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="border-gray fixed left-0 right-0 top-0 z-50 flex flex-col items-center justify-center border-b-2 bg-opacity-70 p-8 text-white backdrop-blur-md md:flex-row">
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
					href="/settings"
				>
					Settings
				</Link>
				<button
					ref={buttonRef}
					className="flex items-center justify-between rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					onClick={toggleMegaMenu}
				>
					About
					<FiChevronDown
						className={`ml-2 h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
						strokeWidth={2.5}
					/>
				</button>
				<div
					ref={menuRef}
					className={`absolute left-0 top-full mt-2 flex w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
						isMegaMenuOpen
							? 'translate-y-0 opacity-100'
							: '-translate-y-4 opacity-0'
					}`}
					onMouseLeave={() => setMegaMenuOpen(false)}
				>
					<div className="w-1/2 p-4">
						{activeButton === 'Team' && (
							<div>
								<h3 className="text-lg font-bold">Our Team</h3>
								<p>Details about the team...</p>
							</div>
						)}
						{activeButton === 'Strategy' && (
							<div>
								<h3 className="text-lg font-bold">Our Strategy</h3>
								<p>Details about the strategy...</p>
							</div>
						)}
					</div>
					<div className="w-1/2 p-4">
						<button
							className="w-full text-balance rounded bg-blue-500 py-2 hover:bg-blue-600"
							onMouseEnter={() => handleButtonHover('Team')}
						>
							Team
						</button>
						<button
							className="mt-4 w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
							onMouseEnter={() => handleButtonHover('Strategy')}
						>
							Strategy
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
};
