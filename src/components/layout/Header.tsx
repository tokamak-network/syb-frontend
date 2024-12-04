'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';

import { ThemeDropdown, LinkButton } from '@/components/common';

export const Header: React.FC<{
	onMegaMenuToggle: (isOpen: boolean) => void;
}> = ({ onMegaMenuToggle }) => {
	const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const toggleMegaMenu = () => {
		setMegaMenuOpen((prev) => {
			const newState = !prev;

			onMegaMenuToggle(newState);

			return newState;
		});
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
			onMegaMenuToggle(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="border-gray fixed left-0 right-0 top-0 z-20 flex items-center justify-between border-b-2 bg-opacity-70 px-40 py-8 text-white backdrop-blur-md md:flex-row">
			<Image
				alt="logo"
				height={50}
				src={'/images/logo-light.png'}
				width={200}
			/>
			<nav className="flex flex-col space-y-2 text-xl font-bold md:mb-0 md:flex-row md:space-x-2 md:space-y-0">
				<Link
					className="rounded px-8 py-1 transition-colors duration-200 hover:bg-blue-500"
					href="/"
				>
					Home
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
					href="/account"
				>
					Account
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
			</nav>
			<div
				ref={menuRef}
				className={`absolute left-0 top-full ml-0 flex w-full bg-secondary p-8 text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${
					isMegaMenuOpen
						? 'visible translate-y-0 opacity-100'
						: 'invisible -translate-y-4 opacity-0'
				}`}
				onMouseLeave={() =>
					setMegaMenuOpen((prev) => {
						const newState = !prev;

						onMegaMenuToggle(newState);

						return newState;
					})
				}
			>
				<div className="w-3/4 py-4">
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
				<div className="w-1/4 p-4">
					<LinkButton
						className="text-balance rounded py-2 text-white"
						href="#"
						label="Team"
						onMouseEnter={() => handleButtonHover('Team')}
					/>
					<LinkButton
						className="mt-4 rounded py-2 text-white"
						href="#"
						label="Strategy"
						onMouseEnter={() => handleButtonHover('Strategy')}
					/>
				</div>
			</div>
			<ThemeDropdown />
		</header>
	);
};
