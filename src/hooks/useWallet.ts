import { config } from '@/config';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useEnsAvatar,
	useEnsName,
} from 'wagmi';

export const useWallet = () => {
	const { address, isConnected, chain, chainId } = useAccount();
	const { disconnect } = useDisconnect();
	const { connectors, connect } = useConnect();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

	const [balance, setBalance] = useState<string | null>(null);

	useEffect(() => {
		const fetchBalance = async () => {
			if (address) {
				try {
					const balanceResult = await getBalance(config, {
						address: address,
						unit: 'ether',
					});
					setBalance(ethers.utils.formatEther(balanceResult.value));
				} catch (error) {
					console.error('Error fetching balance:', error);
					setBalance(null);
				}
			} else {
				setBalance(null);
			}
		};

		fetchBalance();
	}, [address]);

	return {
		address,
		balance,
		isConnected,
		chain,
		chainId,
		connectors,
		ensName,
		ensAvatar,
		disconnect,
		connect,
	};
};
