import { http, createConfig } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';

import { l2TestNetwork } from '@/types';

export const config = createConfig({
	chains: [mainnet, sepolia, l2TestNetwork],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[l2TestNetwork.id]: http(),
	},
});
