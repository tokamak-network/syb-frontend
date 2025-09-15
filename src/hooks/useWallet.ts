import { getPublicClient } from '@wagmi/core';
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
import { formatBalance } from '@/utils/format';

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
		queryKey: ['balance', address, chain?.id, chain?.name],
		queryFn: async () => {
			if (!address || !chain) return null;

			try {
				console.log('Fetching balance for:', {
					address,
					chainId: chain.id,
					chainName: chain.name,
				});

				// Get balance from the specific chain the wallet is connected to
				const publicClient = getPublicClient(config, { chainId: chain.id });

				if (!publicClient) {
					throw new Error(`No public client available for chain ${chain.id}`);
				}

				console.log('Using public client for chain:', chain.id);

				const balanceResult = await publicClient.getBalance({
					address: address as `0x${string}`,
				});

				console.log('Balance result (wei):', balanceResult);

				// Convert from wei to ether and format to 2 decimal places
				const balanceInEth = ethers.formatEther(balanceResult);
				const formattedBalance = formatBalance(balanceInEth);
				console.log('Formatted balance (ETH):', formattedBalance);

				// Temporary: Manual balance check for debugging
				try {
					const rpcUrl =
						typeof chain.rpcUrls?.default?.http === 'string'
							? chain.rpcUrls.default.http
							: chain.rpcUrls?.default?.http?.[0];

					if (rpcUrl) {
						console.log(
							'Manual check: Using RPC URL for chain',
							chain.id,
							':',
							rpcUrl,
						);
						const provider = new ethers.JsonRpcProvider(rpcUrl);
						const manualBalance = await provider.getBalance(address);
						const manualBalanceEth = ethers.formatEther(manualBalance);
						console.log(
							'Manual balance check (ETH):',
							formatBalance(manualBalanceEth),
						);
					}
				} catch (manualError) {
					console.warn('Manual balance check failed:', manualError);
				}

				setCurrencySymbol(chain.nativeCurrency?.symbol || 'ETH');

				return formattedBalance;
			} catch (primaryError) {
				console.error(
					'Error fetching balance with primary method:',
					primaryError,
				);

				try {
					// Use the correct RPC URL from the chain configuration
					const rpcUrl =
						typeof chain.rpcUrls?.default?.http === 'string'
							? chain.rpcUrls.default.http
							: chain.rpcUrls?.default?.http?.[0];

					if (!rpcUrl) {
						throw new Error('No RPC URL available for fallback');
					}

					console.log(
						'Fallback: Using RPC URL for chain',
						chain.id,
						':',
						rpcUrl,
					);
					const provider = new ethers.JsonRpcProvider(rpcUrl);
					const rawBalance = await provider.getBalance(address);

					console.log('Fallback balance (wei):', rawBalance.toString());
					const balanceInEth = ethers.formatEther(rawBalance);
					return formatBalance(balanceInEth);
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
