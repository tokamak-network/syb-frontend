'use client';

import React, { useState } from 'react';

import { Header, Footer } from './';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isMegaMenuOpen, setMegaMenuOpen] = useState<boolean>(false);

	const handleMegaMenuToggle = (isOpen: boolean) => {
		setMegaMenuOpen(isOpen);
	};

	return (
		<div className={`flex min-h-screen flex-col`}>
			<Header
				isMegaMenuOpen={isMegaMenuOpen}
				onMegaMenuToggle={handleMegaMenuToggle}
			/>
			{isMegaMenuOpen && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
			)}
			<main
				className={`mt-24 w-full flex-grow ${isMegaMenuOpen ? 'blur-background' : ''}`}
			>
				{children}
			</main>
			<Footer className={`${isMegaMenuOpen ? 'blur-background' : ''}`} />
		</div>
	);
};
