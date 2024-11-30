import React from 'react';

import { WalletProvider, ToastProvider } from '@/context';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

interface AppProvidersProps {
	children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
	return (
		<WalletProvider>
			<ToastProvider>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</ToastProvider>
		</WalletProvider>
	);
};
