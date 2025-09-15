import { http, createConfig, fallback } from '@wagmi/core';

import { mainNetwork, l1TestNetwork, l2TestNetwork } from '@/types';

export const config = createConfig({
	chains: [mainNetwork, l1TestNetwork, l2TestNetwork],
	transports: {
		[mainNetwork.id]: fallback([
			http('https://eth.llamarpc.com'),
			http('https://rpc.ankr.com/eth'),
			http('https://ethereum.publicnode.com'),
			http(),
		]),
		[l1TestNetwork.id]: fallback([
			http('https://rpc.ankr.com/eth_sepolia'),
			http('https://sepolia.gateway.tenderly.co'),
			http('https://ethereum-sepolia.publicnode.com'),
			http(),
		]),
		[l2TestNetwork.id]: http(),
	},
});
