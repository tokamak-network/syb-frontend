'use client';

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';

import { ThemeDropdown } from '@/components/common';
import { useTheme } from '@/context/ThemeContext';
import { themeStyles } from '@/const';
import { useWallet } from '@/hooks/useWallet';

import { Button } from '../button';

export const Header: React.FC<{
	onMegaMenuToggle: (isOpen: boolean) => void;
	isMegaMenuOpen: boolean;
}> = ({ onMegaMenuToggle, isMegaMenuOpen }) => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	const { connect, isConnected, disconnect, connectors, address } = useWallet();

	const handleWalletMenuToggle = () => {
		setIsWalletMenuOpen((prev) => !prev);
	};

	const handleCopyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			alert('Address copied to clipboard!');
		}
	};

	return (
		<header className="border-gray fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b-2 bg-opacity-70 px-40 py-8 backdrop-blur-md md:flex-row">
			{/* Logo */}
			<Image
				alt="logo"
				height={50}
				src={'/images/logo-light.png'}
				width={200}
			/>

			{/* Navigation */}
			<nav className="flex flex-col space-y-2 text-xl font-bold md:mb-0 md:flex-row md:space-x-2 md:space-y-0">
				<Button
					className="flex items-center justify-between font-bold"
					onClick={() => onMegaMenuToggle(!isMegaMenuOpen)}
				>
					About
					<FiChevronDown
						className={`ml-2 h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
						strokeWidth={2.5}
					/>
				</Button>
			</nav>

			{/* Wallet and Theme Dropdown */}
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
