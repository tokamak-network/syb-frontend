'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';

import { ThemeDropdown } from '@/components/common';
import { useTheme } from '@/context/ThemeContext';
import { themeStyles } from '@/const';
import { cn } from '@/utils/cn';
import { useWallet } from '@/hooks/useWallet';

import { Button, NavLinkButton, LinkButton } from '../button';

export const Header: React.FC<{
	onMegaMenuToggle: (isOpen: boolean) => void;
	isMegaMenuOpen: boolean;
}> = ({ onMegaMenuToggle, isMegaMenuOpen }) => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false);
	const docsURL = process.env.NEXT_PUBLIC_DOCS_URL;

	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	const { connect, isConnected, disconnect, connectors, address } = useWallet();

	const handleButtonHover = (button: string) => {
		setActiveButton(button);
	};

	const handleMouseLeave = (event: React.MouseEvent) => {
		const relatedTarget = event.relatedTarget as Node;

		if (menuRef.current && menuRef.current.contains(relatedTarget)) {
			return;
		}

		onMegaMenuToggle(false);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			menuRef.current &&
			!menuRef.current.contains(event.target as Node) &&
			buttonRef.current &&
			!buttonRef.current.contains(event.target as Node)
		) {
			onMegaMenuToggle(false);
		}
	};

	const handleWalletMenuToggle = () => {
		setIsWalletMenuOpen((prev) => !prev);
	};

	const handleCopyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			alert('Address copied to clipboard!');
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="border-gray fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b-2 bg-opacity-70 px-40 py-8 backdrop-blur-md md:flex-row">
			<Image
				alt="logo"
				height={50}
				src={'/images/logo-light.png'}
				width={200}
			/>
			<nav className="flex flex-col space-y-2 text-xl font-bold md:mb-0 md:flex-row md:space-x-2 md:space-y-0">
				<NavLinkButton href="/home" label="Home" />
				{docsURL && <NavLinkButton href={docsURL} label="Docs" />}
				<NavLinkButton href="/explorer" label="Explorer" />
			</nav>
			<div
				ref={menuRef}
				className={`absolute left-0 top-full ml-0 flex w-full p-8 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${
					isMegaMenuOpen
						? 'visible translate-y-0 opacity-100'
						: 'invisible -translate-y-4 opacity-0'
				}`}
				onMouseLeave={handleMouseLeave}
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
						className={cn(`text-balance rounded py-2`, currentThemeStyles.text)}
						href="#"
						label="Team"
						onMouseEnter={() => handleButtonHover('Team')}
					/>
					<LinkButton
						className={cn(`mt-4 rounded py-2`, currentThemeStyles.text)}
						href="#"
						label="Strategy"
						onMouseEnter={() => handleButtonHover('Strategy')}
					/>
				</div>
			</div>
			<div className="flex space-x-2">
				<ThemeDropdown />
				{isConnected ? (
					<div className="relative">
						{/* Wallet Dropdown Button */}
						<Button
							className="flex items-center space-x-2 rounded-lg px-4 py-2"
							onClick={handleWalletMenuToggle}
						>
							<span>
								{address?.slice(0, 6)}...{address?.slice(-4)}
							</span>
							<FiChevronDown
								className={`ml-2 h-4 w-4 transition-transform ${isWalletMenuOpen ? 'rotate-180' : ''}`}
								strokeWidth={2.5}
							/>
						</Button>

						{/* Wallet Dropdown Menu */}
						{isWalletMenuOpen && (
							<div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg">
								<button
									className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={handleCopyAddress}
								>
									Copy Address
								</button>
								<button
									className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={async () => {
										await disconnect();
										setIsWalletMenuOpen(false);
									}}
								>
									Disconnect
								</button>
							</div>
						)}
					</div>
				) : (
					<Button
						className="flex items-center space-x-2 rounded-lg px-4 py-2"
						onClick={() => connect({ connector: connectors[0] })}
					>
						<Image
							alt="MetaMask Icon"
							height={20}
							src="/images/wallets/metamask.svg"
							width={20}
						/>
						<span>Connect</span>
					</Button>
				)}
			</div>
		</header>
	);
};
