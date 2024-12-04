import { http, createConfig } from '@wagmi/core';

import { mainNetwork, l1TestNetwork, l2TestNetwork } from '@/types';

export const config = createConfig({
	chains: [mainNetwork, l1TestNetwork, l2TestNetwork],
	transports: {
		[mainNetwork.id]: http(),
		[l1TestNetwork.id]: http(),
		[l2TestNetwork.id]: http(),
	},
});
