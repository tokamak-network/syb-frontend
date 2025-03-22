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
	const { connectors, connectAsync } = useConnect();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

	const [currencySymbol, setCurrencySymbol] = useState<string>('ETH');
	const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);

	const {
		data: balance,
		isLoading: isBalanceLoading,
		refetch: refetchBalance,
		error: balanceError,
	} = useQuery({
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
			} catch (primaryError) {
				console.error(
					'Error fetching balance with primary method:',
					primaryError,
				);

				try {
					const provider = new ethers.providers.JsonRpcProvider(
						chain.rpcUrls?.default?.http?.[0],
					);
					const rawBalance = await provider.getBalance(address);
					return ethers.utils.formatEther(rawBalance);
				} catch (fallbackError) {
					console.error(
						'Error fetching balance with fallback method:',
						fallbackError,
					);
					throw new Error(
						`Failed to fetch balance: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}`,
					);
				}
			}
		},
		enabled: !!address && !!chain,
		refetchOnWindowFocus: false,
		retry: 2,
		staleTime: 30000,
	});

	const updateBalance = async () => {
		if (address && chain) {
			try {
				await refetchBalance();
				return true;
			} catch (error) {
				console.error('Failed to update balance:', error);
				return false;
			}
		}
		return false;
	};

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
			setIsDisconnecting(true);

			localStorage.removeItem('wagmi.connected');

			const wagmiStore = localStorage.getItem('wagmi.store');

			if (wagmiStore) {
				const parsedState = JSON.parse(wagmiStore);

				if (parsedState?.state?.connections?.value instanceof Array) {
					parsedState.state.connections.value = [];
					parsedState.state.current = null;
					localStorage.setItem('wagmi.store', JSON.stringify(parsedState));
				}
			}

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
			const timeoutId = setTimeout(() => {}, 300);

			return () => clearTimeout(timeoutId);
		}
	}, [isDisconnecting]);

	return {
		address,
		balance,
		isBalanceLoading,
		balanceError,
		isConnected,
		chain: extendedChain,
		currencySymbol,
		chainId,
		connectors,
		ensName,
		ensAvatar,
		disconnect,
		connectAsync,
		updateBalance,
	};
};
