import { renderHook, act } from '@testing-library/react-hooks';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useEnsName,
	useEnsAvatar,
} from 'wagmi';
import { ethers } from 'ethers';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';
import React from 'react';

import { useWallet } from './useWallet';

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

jest.mock('wagmi', () => ({
	useAccount: jest.fn(),
	useConnect: jest.fn(),
	useDisconnect: jest.fn(),
	useEnsName: jest.fn(),
	useEnsAvatar: jest.fn(),
}));

// Mock ethers
jest.mock('ethers', () => ({
	ethers: {
		formatEther: jest.fn(),
		JsonRpcProvider: jest.fn(),
	},
	formatEther: jest.fn(),
	JsonRpcProvider: jest.fn(),
}));

// Mock @tanstack/react-query useQuery only
jest.mock('@tanstack/react-query', () => ({
	...jest.requireActual('@tanstack/react-query'),
	useQuery: jest.fn(),
}));

// Create a test wrapper with QueryClient
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const TestWrapper = ({ children }: { children: React.ReactNode }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children,
		);
	};

	TestWrapper.displayName = 'TestWrapper';

	return TestWrapper;
};

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
		(useQuery as jest.Mock).mockReturnValue({
			data: null,
			isLoading: false,
			error: null,
			refetch: jest.fn(),
		});

		const { result } = renderHook(() => useWallet(), {
			wrapper: createWrapper(),
		});

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
		(useQuery as jest.Mock).mockReturnValue({
			data: '1.23',
			isLoading: false,
			error: null,
			refetch: jest.fn(),
		});

		(ethers.formatEther as jest.Mock).mockReturnValue('1.23');

		const { result } = renderHook(() => useWallet(), {
			wrapper: createWrapper(),
		});

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
		const mockDisconnect = jest.fn().mockResolvedValue(undefined);

		(useAccount as jest.Mock).mockReturnValue({
			address: '0x123',
			isConnected: true,
			chain: { id: 1, name: 'Ethereum', nativeCurrency: { symbol: 'ETH' } },
			chainId: 1,
		});
		(useDisconnect as jest.Mock).mockReturnValue({
			disconnect: mockDisconnect,
		});
		(useQuery as jest.Mock).mockReturnValue({
			data: null,
			isLoading: false,
			error: null,
			refetch: jest.fn(),
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

		const { result } = renderHook(() => useWallet(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.disconnect();
		});

		expect(mockDisconnect).toHaveBeenCalled();
		expect(localStorageMock.removeItem).toHaveBeenCalledWith('wagmi.connected');
	});
});
