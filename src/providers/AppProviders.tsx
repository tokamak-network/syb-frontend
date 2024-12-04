'use client';

import React from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

import { WalletProvider, ToastProvider } from '@/context';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { mainNetwork, l1TestNetwork, l2TestNetwork } from '@/types';

interface AppProvidersProps {
	children: React.ReactNode;
}

export const config = createConfig({
	chains: [mainNetwork, l1TestNetwork, l2TestNetwork],
	connectors: [metaMask()],
	transports: {
		[mainNetwork.id]: http(),
		[l1TestNetwork.id]: http(),
		[l2TestNetwork.id]: http(),
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
