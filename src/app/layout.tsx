import type { Metadata } from 'next';

import React from 'react';
import './globals.css';

import { AppProviders } from '@/providers';
import { Layout } from '@/components';

export const metadata: Metadata = {
	title: 'SYB',
	description: 'Tokamak Sybil-Resistance',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={``} lang="en">
			<body suppressHydrationWarning={true}>
				<AppProviders>
					<Layout>{children}</Layout>
				</AppProviders>
			</body>
		</html>
	);
}
