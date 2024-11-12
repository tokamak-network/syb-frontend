import type { Metadata } from 'next';

import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';
import {
	Abhaya_Libre,
	Acme,
	Poppins,
	Roboto,
	Kanit,
	Montserrat,
	Narnoor,
} from 'next/font/google';

import { WalletProvider } from '@/context/WalletContext';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

const Layout = dynamic(
	() => import('@/components/layout').then((mod) => mod.Layout),
	{ ssr: false },
);

const abhayaLibre = Abhaya_Libre({
	subsets: ['latin'],
	weight: ['400', '700'],
});
const acme = Acme({ subsets: ['latin'], weight: ['400', '400'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });
const kanit = Kanit({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] });
const narnoor = Narnoor({ subsets: ['latin'], weight: ['400', '700'] });

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
		<html
			className={`${abhayaLibre.className} ${acme.className} ${poppins.className} ${roboto.className} ${kanit.className} ${montserrat.className} ${narnoor.className}`}
			lang="en"
		>
			<WalletProvider>
				<ReactQueryProvider>
					<body>
						<Layout>{children}</Layout>
					</body>
				</ReactQueryProvider>
			</WalletProvider>
		</html>
	);
}
