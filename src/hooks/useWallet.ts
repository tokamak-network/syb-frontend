import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import {
	useAccount,
	useConnect,
	useEnsAvatar,
	useEnsName,
	useDisconnect,
} from 'wagmi';
import { useQuery } from '@tanstack/react-query';

import { config } from '@/config';
import { NETWORKS } from '@/const';

export const useWallet = () => {
	const { address, isConnected, chain, chainId } = useAccount();
	const { disconnect: wagmiDisconnect } = useDisconnect();
	const { connectors, connect } = useConnect();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

	const [currencySymbol, setCurrencySymbol] = useState<string>('ETH');
	const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false); // Add disconnect flag

	const { data: balance, isLoading: isBalanceLoading } = useQuery({
		queryKey: ['balance', address, chain?.id],
		queryFn: async () => {
			if (!address || !chain) return null;

			try {
				const balanceResult = await getBalance(config, {
					address: address,
					unit: 'ether',
				});

				setCurrencySymbol(chain.nativeCurrency?.symbol || 'ETH');

				return ethers.utils.formatEther(balanceResult.value);
			} catch (error) {
				console.error('Error fetching balance:', error);

				return null;
			}
		},
		enabled: !!address && !!chain,
		refetchOnWindowFocus: false,
	});

	const networkIcon =
		NETWORKS.find(
			(network) => network.value === chain?.name.toLocaleLowerCase(),
		)?.icon || null;

	const extendedChain = chain
		? {
				...chain,
				icon: networkIcon,
			}
		: null;

	const disconnect = async () => {
		try {
			// Set disconnect flag to prevent auto-connect modal
			setIsDisconnecting(true);

			// Clear Wagmi's autoConnect data
			localStorage.removeItem('wagmi.connected');

			// Clear wallet connections in Wagmi's state stored under 'wagmi.store'
			const wagmiStore = localStorage.getItem('wagmi.store');

			if (wagmiStore) {
				const parsedState = JSON.parse(wagmiStore);

				if (parsedState?.state?.connections?.value instanceof Array) {
					parsedState.state.connections.value = [];
					parsedState.state.current = null;
					localStorage.setItem('wagmi.store', JSON.stringify(parsedState));
				}
			}

			// Call Wagmi's disconnect function
			await wagmiDisconnect();

			console.log('Wallet disconnected successfully');
		} catch (error) {
			console.error('Error disconnecting wallet:', error);
		} finally {
			setIsDisconnecting(false);
		}
	};

	useEffect(() => {
		if (isDisconnecting) {
			// If disconnecting, disable auto-connect for a brief moment
			const timeoutId = setTimeout(() => {
				// Optionally clear any persistent state here or add more logic
			}, 300);

			return () => clearTimeout(timeoutId);
		}
	}, [isDisconnecting]);

	return {
		address,
		balance,
		isBalanceLoading,
		isConnected,
		chain: extendedChain,
		currencySymbol,
		chainId,
		connectors,
		ensName,
		ensAvatar,
		disconnect,
		connect,
	};
};
