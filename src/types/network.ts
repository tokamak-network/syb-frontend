import { Chain, mainnet, sepolia } from 'wagmi/chains';

import { NetworkType } from '.';

export const mainNetwork: NetworkType = {
	id: mainnet.id,
	name: mainnet.name,
	nativeCurrency: mainnet.nativeCurrency,
	rpcUrls: {
		default: {
			http: mainnet.rpcUrls.default.http,
		},
	},
	blockExplorers: mainnet.blockExplorers,
};

export const l1TestNetwork: NetworkType = {
	id: sepolia.id,
	name: sepolia.name,
	nativeCurrency: sepolia.nativeCurrency,
	rpcUrls: {
		default: {
			http: sepolia.rpcUrls.default.http,
		},
	},
	blockExplorers: sepolia.blockExplorers,
};

export const l2TestNetwork: Chain = {
	id: Number(process.env.NEXT_PUBLIC_TESTNET_ID || 111551119090),
	name: process.env.NEXT_PUBLIC_TESTNET_NAME || 'Thanos Sepolia',
	nativeCurrency: {
		name:
			process.env.NEXT_PUBLIC_TESTNET_NATIVE_CURRENCY_NAME ||
			'Thanos Sepolia TON',
		symbol: process.env.NEXT_PUBLIC_TESTNET_NATIVE_CURRENCY_SYMBOL || 'TON',
		decimals: Number(
			process.env.NEXT_PUBLIC_TESTNET_NATIVE_CURRENCY_DECIMALS || '18',
		),
	},
	rpcUrls: {
		default: {
			http: [
				process.env.NEXT_PUBLIC_TESTNET_RPC_HTTP_URL ||
					'https://rpc.thanos-sepolia.tokamak.network',
			],
			webSocket: [
				process.env.NEXT_PUBLIC_TESTNET_RPC_WSS_URL ||
					'wss://rpc.thanos-sepolia.tokamak.network',
			],
		},
	},
	blockExplorers: {
		default: {
			name:
				process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER_NAME || 'Thanos Sepolia',
			url:
				process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER_URL ||
				'https://explorer.thanos-sepolia.tokamak.network',
		},
	},
};
