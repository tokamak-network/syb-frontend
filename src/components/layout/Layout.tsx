'use client';

import React from 'react';

import { Header, Footer } from './';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className={`flex min-h-screen flex-col`}>
			<Header />
			<main className="w-full flex-grow">{children}</main>
			<Footer />
		</div>
	);
};
