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
			<Header onMegaMenuToggle={handleMegaMenuToggle} />
			<main
				className={`mt-24 w-full flex-grow ${isMegaMenuOpen ? 'blur-background' : ''}`}
			>
				{children}
			</main>
			<Footer />
		</div>
	);
};
