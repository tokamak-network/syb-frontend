'use client';

import React from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

import { WalletProvider, ToastProvider } from '@/context';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

interface AppProvidersProps {
	children: React.ReactNode;
}

export const config = createConfig({
	chains: [sepolia, mainnet],
	connectors: [metaMask()],
	transports: {
		[sepolia.id]: http(),
		[mainnet.id]: http(),
	},
});

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
	return (
		<WagmiProvider config={config}>
			<WalletProvider>
				<ToastProvider>
					<ReactQueryProvider>{children}</ReactQueryProvider>
				</ToastProvider>
			</WalletProvider>
		</WagmiProvider>
	);
};
