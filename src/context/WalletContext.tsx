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
	connectWallet: () => Promise<void>;
	disconnectWallet: () => void;
	isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [account, setAccount] = useState<string | null>(null);
	const [balance, setBalance] = useState<string | null>(null);
	const [isMetaMaskInstalled, setMetaMaskInstalled] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setMetaMaskInstalled(typeof window.ethereum !== 'undefined');
		}
	}, []);

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
			} catch (error) {
				console.error('Error connecting to wallet', error);
			}
		}
	};

	const disconnectWallet = () => {
		setAccount(null);
		setBalance(null);
	};

	return (
		<WalletContext.Provider
			value={{
				account,
				balance,
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
