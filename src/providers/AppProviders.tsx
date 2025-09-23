'use client';

import React from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { SessionProvider } from 'next-auth/react';

import { ToastProvider, ThemeProvider } from '@/context';
import { mainNetwork, l1TestNetwork, l2TestNetwork } from '@/types';
import { ErrorBoundary } from '@/components';

import { ReactQueryProvider } from './ReactQueryProvider';

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
		<ErrorBoundary
			fallbackMessage="There was an issue loading the main application layout."
			fallbackTitle="Layout Error"
		>
			<SessionProvider>
				<WagmiProvider config={config}>
					<ThemeProvider>
						<ToastProvider>
							<ReactQueryProvider>{children}</ReactQueryProvider>
						</ToastProvider>
					</ThemeProvider>
				</WagmiProvider>
			</SessionProvider>
		</ErrorBoundary>
	);
};
