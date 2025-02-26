'use client';

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
	account: string | null;
	balance: string | null;
	network: string | null;
	connectWallet: () => Promise<void>;
	disconnectWallet: () => void;
	updateBalance: () => Promise<void>;
	isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [account, setAccount] = useState<string | null>(null);
	const [balance, setBalance] = useState<string | null>(null);
	const [network, setNetwork] = useState<string | null>(null);

	const [isMetaMaskInstalled, setMetaMaskInstalled] = useState<boolean>(false);

	const connectWallet = async () => {
		if (isMetaMaskInstalled) {
			try {
				const provider = new ethers.providers.Web3Provider(
					window.ethereum as any,
				);

				await provider.send('eth_requestAccounts', []);
				const signer = provider.getSigner();
				const userAddress = await signer.getAddress();
				const userBalance = ethers.utils.formatEther(await signer.getBalance());

				setAccount(userAddress);
				setBalance(userBalance);

				const network = await provider.getNetwork();

				setNetwork(network.name);
			} catch (error) {
				console.error('Error connecting to wallet', error);
			}
		}
	};

	const updateBalance = async () => {
		if (account) {
			try {
				const provider = new ethers.providers.Web3Provider(
					window.ethereum as any,
				);
				const balance = await provider.getBalance(account);

				setBalance(ethers.utils.formatEther(balance));
			} catch (error) {
				console.error('Failed to fetch balance:', error);
			}
		}
	};

	const disconnectWallet = () => {
		setAccount(null);
		setBalance(null);
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setMetaMaskInstalled(typeof window.ethereum !== 'undefined');
		}
	}, []);

	useEffect(() => {
		if (isMetaMaskInstalled) {
			window.ethereum?.on?.('accountsChanged', connectWallet);
			window.ethereum?.on?.('chainChanged', connectWallet);
		}

		return () => {
			if (isMetaMaskInstalled) {
				window.ethereum?.removeListener?.('accountsChanged', connectWallet);
				window.ethereum?.removeListener?.('chainChanged', connectWallet);
			}
		};
	}, [isMetaMaskInstalled]);

	return (
		<WalletContext.Provider
			value={{
				account,
				balance,
				network,
				updateBalance,
				connectWallet,
				isMetaMaskInstalled,
				disconnectWallet,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export const useWallet = (): WalletContextType => {
	const context = useContext(WalletContext);

	if (!context) {
		throw new Error('useWallet must be used within a WalletProvider');
	}

	return context;
};
