import { renderHook, act } from '@testing-library/react-hooks';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useEnsName,
	useEnsAvatar,
} from 'wagmi';
import { ethers } from 'ethers';

import { useWallet } from './useWallet';

jest.mock('wagmi', () => ({
	useAccount: jest.fn(),
	useConnect: jest.fn(),
	useDisconnect: jest.fn(),
	useEnsName: jest.fn(),
	useEnsAvatar: jest.fn(),
}));

// Mock React Query with conditional behavior based on enabled state
jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(({ enabled, queryKey }) => ({
		data: enabled ? '1.23' : null,
		isLoading: false,
		refetch: jest.fn().mockResolvedValue(true),
		error: null,
	})),
}));

jest.mock('ethers', () => ({
	ethers: {
		utils: {
			formatEther: jest.fn((value) => value),
		},
		providers: {
			JsonRpcProvider: jest.fn(() => ({
				getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
			})),
		},
	},
}));

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: jest.fn((key: string) => store[key] || null),
		setItem: jest.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: jest.fn((key: string) => {
			delete store[key];
		}),
		clear: jest.fn(() => {
			store = {};
		}),
	};
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useWallet', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.clear();
	});

	it('should return default values when not connected', () => {
		(useAccount as jest.Mock).mockReturnValue({
			address: null,
			isConnected: false,
			chain: null,
			chainId: null,
		});
		(useConnect as jest.Mock).mockReturnValue({
			connectors: [],
			connect: jest.fn(),
		});
		(useDisconnect as jest.Mock).mockReturnValue({
			disconnect: jest.fn(),
		});
		(useEnsName as jest.Mock).mockReturnValue({ data: null });
		(useEnsAvatar as jest.Mock).mockReturnValue({ data: null });

		const { result } = renderHook(() => useWallet());

		expect(result.current.address).toBeNull();
		expect(result.current.isConnected).toBe(false);
		expect(result.current.chain).toBeNull();
		expect(result.current.chainId).toBeNull();
		expect(result.current.balance).toBeNull();
		expect(result.current.isBalanceLoading).toBe(false);
		expect(result.current.currencySymbol).toBe('ETH');
		expect(result.current.ensName).toBeNull();
		expect(result.current.ensAvatar).toBeNull();
		expect(result.current.connectors).toEqual([]);
	});

	it('should return wallet data when connected', () => {
		const mockChain = {
			id: 1,
			name: 'Ethereum',
			nativeCurrency: { symbol: 'ETH' },
			rpcUrls: { default: { http: ['https://example.com'] } },
		};

		(useAccount as jest.Mock).mockReturnValue({
			address: '0x123',
			isConnected: true,
			chain: mockChain,
			chainId: 1,
		});
		(useConnect as jest.Mock).mockReturnValue({
			connectors: [{ id: 'injected', name: 'MetaMask' }],
			connect: jest.fn(),
		});
		(useDisconnect as jest.Mock).mockReturnValue({
			disconnect: jest.fn(),
		});
		(useEnsName as jest.Mock).mockReturnValue({ data: 'example.eth' });
		(useEnsAvatar as jest.Mock).mockReturnValue({ data: 'avatar_url' });

		(ethers.utils.formatEther as jest.Mock).mockReturnValue('1.23');

		const { result } = renderHook(() => useWallet());

		// No need to wait, test synchronously
		expect(result.current.address).toBe('0x123');
		expect(result.current.isConnected).toBe(true);
		expect(result.current.chain).toEqual({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: { symbol: 'ETH' },
			rpcUrls: { default: { http: ['https://example.com'] } },
			icon: '/images/networks/ethereum-eth-logo.svg',
		});
		expect(result.current.chainId).toBe(1);
		expect(result.current.balance).toBe('1.23');
		expect(result.current.isBalanceLoading).toBe(false);
		expect(result.current.currencySymbol).toBe('ETH');
		expect(result.current.ensName).toBe('example.eth');
		expect(result.current.ensAvatar).toBe('avatar_url');
		expect(result.current.connectors).toEqual([
			{ id: 'injected', name: 'MetaMask' },
		]);
	});

	it('should handle disconnect correctly', async () => {
		const mockDisconnect = jest.fn();

		(useAccount as jest.Mock).mockReturnValue({
			address: '0x123',
			isConnected: true,
			chain: { id: 1, name: 'Ethereum', nativeCurrency: { symbol: 'ETH' } },
			chainId: 1,
		});
		(useDisconnect as jest.Mock).mockReturnValue({
			disconnect: mockDisconnect,
		});

		// Set up localStorage for testing
		localStorageMock.setItem(
			'wagmi.store',
			JSON.stringify({
				state: {
					connections: { value: [{ id: 'test' }] },
					current: { some: 'data' },
				},
			}),
		);

		const { result } = renderHook(() => useWallet());

		await act(async () => {
			await result.current.disconnect();
		});

		expect(mockDisconnect).toHaveBeenCalled();
		expect(localStorageMock.removeItem).toHaveBeenCalledWith('wagmi.connected');
		expect(localStorageMock.setItem).toHaveBeenCalledWith(
			'wagmi.store',
			JSON.stringify({
				state: {
					connections: { value: [] },
					current: null,
				},
			}),
		);
	});
});
