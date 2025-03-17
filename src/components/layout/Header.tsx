'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';

import { ThemeDropdown } from '@/components/common';
import { useTheme, useToast } from '@/context';
import { themeStyles } from '@/const';
import { cn } from '@/utils/cn';
import { useWallet } from '@/hooks/useWallet';

import { Button, NavLinkButton, LinkButton, navButtonStyles } from '../button';
import { CreateTxModal } from '../modal';

export const Header: React.FC<{
	onMegaMenuToggle: (isOpen: boolean) => void;
	isMegaMenuOpen: boolean;
}> = ({ onMegaMenuToggle, isMegaMenuOpen }) => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false);
	const [isCreateTxModalOpen, setIsCreateTxModalOpen] =
		useState<boolean>(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const docsURL = process.env.NEXT_PUBLIC_DOCS_URL;

	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	const { addToast } = useToast();

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
			addToast('success', 'Address copied to clipboard!', '');
		}
	};

	const handleCreateTxModalToggle = () => {
		setIsCreateTxModalOpen((prev) => !prev);
	};

	const handleTransactionSubmit = (data: {
		type: string;
		from: string;
		to: string;
		amount: string;
	}) => {
		console.log('Transaction Data:', data);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => !prev);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="border-gray fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b-2 bg-opacity-70 px-4 py-4 backdrop-blur-md sm:px-2 md:px-4 md:py-8 lg:px-16 xl:px-40">
			<Image
				alt="logo"
				height={50}
				src={'/images/logo-light.png'}
				width={150}
				className="h-8 w-auto md:h-10 lg:h-12"
			/>

			<button
				className="rounded-md p-2 md:hidden"
				onClick={toggleMobileMenu}
				aria-label="Toggle mobile menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d={
							isMobileMenuOpen
								? 'M6 18L18 6M6 6l12 12'
								: 'M4 6h16M4 12h16M4 18h16'
						}
					/>
				</svg>
			</button>

			<nav className="hidden flex-col space-y-2 text-xl font-bold md:mb-0 md:flex md:flex-row md:space-x-2 md:space-y-0">
				<NavLinkButton href="/home" label="Home" />
				{docsURL && <NavLinkButton href={docsURL} label="Docs" />}
				<NavLinkButton href="/explorer" label="Explorer" />
			</nav>

			<div
				className={`absolute left-0 right-0 top-full bg-white shadow-lg transition-all duration-300 md:hidden dark:bg-gray-800 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
			>
				<div className="space-y-2 px-4 py-2">
					<NavLinkButton
						href="/home"
						label="Home"
						className="block w-full py-2 text-left"
					/>
					{docsURL && (
						<NavLinkButton
							href={docsURL}
							label="Docs"
							className="block w-full py-2 text-left"
						/>
					)}
					<NavLinkButton
						href="/explorer"
						label="Explorer"
						className="block w-full py-2 text-left"
					/>
					<hr className="my-2" />
					<Button
						className="w-full py-2 text-left font-bold"
						onClick={handleCreateTxModalToggle}
					>
						CreateTx
					</Button>
					<ThemeDropdown className="my-2 w-full" />
				</div>
			</div>

			<div
				ref={menuRef}
				className={`absolute left-0 top-full ml-0 hidden w-full p-8 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out md:flex ${
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

			<div className="hidden space-x-2 md:flex">
				<Button
					className={
						(navButtonStyles(currentThemeStyles), 'items-center font-bold')
					}
					onClick={handleCreateTxModalToggle}
				>
					CreateTx
				</Button>
				<ThemeDropdown />
				{isConnected ? (
					<div className="relative">
						<Button
							className="flex items-center space-x-2 rounded-lg px-4 py-2"
							onClick={handleWalletMenuToggle}
						>
							<span className="hidden sm:inline">
								{address?.slice(0, 6)}...{address?.slice(-4)}
							</span>
							<span className="sm:hidden">
								{address?.slice(0, 4)}...{address?.slice(-2)}
							</span>
							<FiChevronDown
								className={`ml-2 h-4 w-4 transition-transform ${isWalletMenuOpen ? 'rotate-180' : ''}`}
								strokeWidth={2.5}
							/>
						</Button>

						{isWalletMenuOpen && (
							<div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
								<button
									className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={handleCopyAddress}
								>
									Copy Address
								</button>
								<button
									className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={async () => {
										try {
											await disconnect();
											addToast(
												'success',
												'Wallet disconnected successfully',
												'',
											);
											setIsWalletMenuOpen(false);
										} catch (error) {
											addToast(
												'error',
												'Failed to disconnect wallet',
												error instanceof Error
													? error.message
													: 'Unknown error',
											);
										}
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
						onClick={async () => {
							try {
								await connect({ connector: connectors[0] });
								addToast('success', 'Wallet connected successfully', '');
							} catch (error) {
								addToast(
									'error',
									'Failed to connect wallet',
									error instanceof Error ? error.message : 'Unknown error',
								);
							}
						}}
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

			<div className="md:hidden">
				{isConnected ? (
					<Button
						className="flex items-center rounded-lg px-2 py-1"
						onClick={handleWalletMenuToggle}
					>
						<span>
							{address?.slice(0, 4)}...{address?.slice(-2)}
						</span>
					</Button>
				) : (
					<Button
						className="flex items-center rounded-lg px-2 py-1"
						onClick={async () => {
							try {
								await connect({ connector: connectors[0] });
								addToast('success', 'Wallet connected successfully', '');
							} catch (error) {
								addToast(
									'error',
									'Failed to connect wallet',
									error instanceof Error ? error.message : 'Unknown error',
								);
							}
						}}
					>
						<Image
							alt="MetaMask Icon"
							height={16}
							src="/images/wallets/metamask.svg"
							width={16}
						/>
					</Button>
				)}
			</div>

			<CreateTxModal
				isConnected={isConnected}
				isOpen={isCreateTxModalOpen}
				walletAddress={address}
				onClose={handleCreateTxModalToggle}
				onSubmit={handleTransactionSubmit}
			/>
		</header>
	);
};
