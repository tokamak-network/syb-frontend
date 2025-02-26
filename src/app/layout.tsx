import type { Metadata } from 'next';

import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';

import { AppProviders } from '@/providers/AppProviders';

const Layout = dynamic(
	() => import('@/components/layout').then((mod) => mod.Layout),
	{ ssr: false },
);

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
			<body>
				<AppProviders>
					<Layout>{children}</Layout>
				</AppProviders>
			</body>
		</html>
	);
}
