'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

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
	const [menuStates, setMenuStates] = useState({
		activeButton: null as string | null,
		isWalletMenuOpen: false,
		isCreateTxModalOpen: false,
		isMobileMenuOpen: false,
	});

	const [docsURL, setDocsURL] = useState<string | null>(null);
	const [isClient, setIsClient] = useState(false);

	const {
		activeButton,
		isWalletMenuOpen,
		isCreateTxModalOpen,
		isMobileMenuOpen,
	} = menuStates;

	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	const { addToast } = useToast();

	const { connectAsync, isConnected, disconnect, connectors, address } =
		useWallet();

	const handleButtonHover = useCallback((button: string) => {
		setMenuStates((prev) => ({ ...prev, activeButton: button }));
	}, []);

	const handleMouseLeave = useCallback(
		(event: React.MouseEvent) => {
			const relatedTarget = event.relatedTarget as Node;

			if (menuRef.current && menuRef.current.contains(relatedTarget)) {
				return;
			}

			onMegaMenuToggle(false);
		},
		[onMegaMenuToggle],
	);

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
		setMenuStates((prev) => ({
			...prev,
			isWalletMenuOpen: !prev.isWalletMenuOpen,
		}));
	};

	const handleCopyAddress = useCallback(async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			addToast('success', 'Address copied to clipboard!', '');
		}
	}, [address, addToast]);

	const handleCreateTxModalToggle = useCallback(() => {
		setMenuStates((prev) => ({
			...prev,
			isCreateTxModalOpen: !prev.isCreateTxModalOpen,
		}));
	}, []);

	const handleTransactionSubmit = (data: {
		type: string;
		from: string;
		to: string;
		amount: string;
	}) => {
		console.log('Transaction Data:', data);
	};

	const toggleMobileMenu = useCallback(() => {
		setMenuStates((prev) => ({
			...prev,
			isMobileMenuOpen: !prev.isMobileMenuOpen,
		}));
	}, []);

	const connectWallet = useCallback(async () => {
		try {
			await connectAsync({ connector: connectors[0] });
			addToast('success', 'Wallet connected successfully', '');
		} catch (error) {
			addToast(
				'error',
				'Failed to connect wallet',
				error instanceof Error ? error.message : 'Unknown error',
			);
		}
	}, [connectAsync, connectors, addToast]);

	const disconnectWallet = useCallback(async () => {
		try {
			await disconnect();
			addToast('success', 'Wallet disconnected successfully', '');
			setMenuStates((prev) => ({ ...prev, isWalletMenuOpen: false }));
		} catch (error) {
			addToast(
				'error',
				'Failed to disconnect wallet',
				error instanceof Error ? error.message : 'Unknown error',
			);
		}
	}, [disconnect, addToast]);

	useEffect(() => {
		// Set the docs URL and client flag on mount to prevent hydration mismatch
		setDocsURL(process.env.NEXT_PUBLIC_DOCS_URL || null);
		setIsClient(true);
	}, []);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		document.documentElement.style.overflow = isCreateTxModalOpen
			? 'hidden'
			: 'auto';
	}, [isCreateTxModalOpen]);

	return (
		<header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b-2 bg-background px-4 py-4 md:px-8 lg:px-16 xl:px-20">
			<Image
				alt="logo"
				className="h-8 w-auto md:h-10 lg:h-12"
				height={50}
				src={'/images/logo-light.png'}
				width={150}
			/>

			<nav className="max-w-300 mb-0 hidden flex-col justify-around space-y-2 text-xl font-bold md:flex md:flex-row md:space-x-5 md:space-y-0">
				<NavLinkButton href="/home" label="Home" />
				{isClient && docsURL && <NavLinkButton href={docsURL} label="Docs" />}
				<NavLinkButton href="/explorer" label="Explorer" />
			</nav>

			<div
				className={`absolute left-0 right-0 top-full bg-white shadow-lg transition-all duration-300 md:hidden dark:bg-gray-800 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
			>
				<div className="space-y-2 px-4 py-2">
					<NavLinkButton
						className="block w-full py-2 text-left"
						href="/home"
						label="Home"
					/>
					{isClient && docsURL && (
						<NavLinkButton
							className="block w-full py-2 text-left"
							href={docsURL}
							label="Docs"
						/>
					)}
					<NavLinkButton
						className="block w-full py-2 text-left"
						href="/explorer"
						label="Explorer"
					/>
					<hr className="my-2" />
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
				<ThemeDropdown className="fixed right-0 top-60" />
				{isClient && isConnected ? (
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
								<Link
									className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									href="/explorer/my-account"
								>
									My Account
								</Link>
								<button
									className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={handleCopyAddress}
								>
									Copy Address
								</button>
								<button
									className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									onClick={disconnectWallet}
								>
									Disconnect
								</button>
							</div>
						)}
					</div>
				) : isClient ? (
					<Button
						className="flex items-center space-x-2 rounded-lg px-4 py-2"
						onClick={connectWallet}
					>
						<Image
							alt="MetaMask Icon"
							height={20}
							src="/images/wallets/metamask.svg"
							width={20}
						/>
						<span>Connect</span>
					</Button>
				) : (
					<div className="h-[40px] w-[120px]" />
				)}
			</div>

			<div className="relative flex items-center space-x-2 md:hidden">
				<Button
					className="flex items-center justify-center rounded-lg px-2 py-2"
					onClick={handleCreateTxModalToggle}
				>
					<FaPlus />
				</Button>
				{isClient && isConnected ? (
					<Button
						className="flex items-center rounded-lg px-2 py-1"
						onClick={handleWalletMenuToggle}
					>
						<span>
							{address?.slice(0, 4)}...{address?.slice(-2)}
						</span>
						<FiChevronDown
							className={`ml-2 h-4 w-4 transition-transform ${isWalletMenuOpen ? 'rotate-180' : ''}`}
							strokeWidth={2.5}
						/>
					</Button>
				) : isClient ? (
					<Button
						className="flex items-center rounded-lg px-2 py-1"
						onClick={connectWallet}
					>
						<Image
							alt="MetaMask Icon"
							height={16}
							src="/images/wallets/metamask.svg"
							width={16}
						/>
					</Button>
				) : (
					<div className="h-[32px] w-[60px]" />
				)}
				{isClient && isWalletMenuOpen && (
					<div className="absolute right-12 top-8 mt-2 w-48 rounded-md bg-white shadow-lg">
						<Link
							className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
							href="/explorer/my-account"
						>
							My Account
						</Link>
						<button
							className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
							onClick={handleCopyAddress}
						>
							Copy Address
						</button>
						<button
							className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
							onClick={disconnectWallet}
						>
							Disconnect
						</button>
					</div>
				)}
				<button
					aria-label="Toggle mobile menu"
					className="rounded-md p-2 md:hidden"
					onClick={toggleMobileMenu}
				>
					<svg
						className="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d={
								isMobileMenuOpen
									? 'M6 18L18 6M6 6l12 12'
									: 'M4 6h16M4 12h16M4 18h16'
							}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
						/>
					</svg>
				</button>
			</div>

			{isClient && (
				<CreateTxModal
					isConnected={isConnected}
					isOpen={isCreateTxModalOpen}
					walletAddress={address}
					onClose={handleCreateTxModalToggle}
					onSubmit={handleTransactionSubmit}
				/>
			)}
		</header>
	);
};
