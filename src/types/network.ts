import { Chain } from 'wagmi/chains';

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
