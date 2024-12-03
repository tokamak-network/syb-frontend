import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useEnsAvatar,
	useEnsName,
} from 'wagmi';
import { useQuery } from '@tanstack/react-query';

import { config } from '@/config';

export const useWallet = () => {
	const { address, isConnected, chain, chainId } = useAccount();
	const { disconnect } = useDisconnect();
	const { connectors, connect } = useConnect();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

	const [currencySymbol, setCurrencySymbol] = useState<string>('ETH');

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

	return {
		address,
		balance,
		isBalanceLoading,
		isConnected,
		chain,
		currencySymbol,
		chainId,
		connectors,
		ensName,
		ensAvatar,
		disconnect,
		connect,
	};
};
