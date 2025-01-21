import { ethers } from 'ethers';

import { depositETH, withdrawETH } from './walletService';

// Mock ethers
jest.mock('ethers', () => ({
	ethers: {
		providers: {
			Web3Provider: jest.fn(),
		},
		utils: {
			parseEther: jest.fn(),
		},
	},
}));

describe('walletService', () => {
	let mockSendTransaction: jest.Mock;
	let mockWait: jest.Mock;
	let mockGetSigner: jest.Mock;

	beforeEach(() => {
		// Mock the Web3Provider and its methods
		mockSendTransaction = jest.fn();
		mockWait = jest.fn();
		mockGetSigner = jest.fn(() => ({
			sendTransaction: mockSendTransaction,
		}));

		// Mock ethers behavior
		(ethers.providers.Web3Provider as unknown as jest.Mock).mockImplementation(() => ({
			getSigner: mockGetSigner,
		}));

		(ethers.utils.parseEther as jest.Mock).mockImplementation(
			(value: string) => value,
		);

		// Mock window.ethereum
		(global as any).window.ethereum = {};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('depositETH', () => {
		it('should deposit ETH successfully', async () => {
			const amount = 1;
			const platformAddress = '0x1234567890abcdef1234567890abcdef12345678';

			// Mock sendTransaction to resolve with a wait function
			mockSendTransaction.mockResolvedValueOnce({
				wait: mockWait,
			});

			await depositETH(amount, platformAddress);

			// Assertions
			expect(ethers.providers.Web3Provider).toHaveBeenCalledWith(
				window.ethereum,
			);
			expect(mockGetSigner).toHaveBeenCalled();
			expect(ethers.utils.parseEther).toHaveBeenCalledWith(amount.toString());
			expect(mockSendTransaction).toHaveBeenCalledWith({
				to: platformAddress,
				value: amount.toString(),
			});
			expect(mockWait).toHaveBeenCalled();
		});

		it('should throw an error if MetaMask is not installed', async () => {
			// Remove window.ethereum to simulate MetaMask not being installed
			delete (global as any).window.ethereum;

			// Assert that the function throws the expected error
			await expect(
				depositETH(1, '0x1234567890abcdef1234567890abcdef12345678'),
			).rejects.toThrow('MetaMask is not installed');
		});

		it('should log an error if the transaction fails', async () => {
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			mockSendTransaction.mockRejectedValueOnce(
				new Error('Transaction failed'),
			);

			await expect(
				depositETH(1, '0x1234567890abcdef1234567890abcdef12345678'),
			).rejects.toThrow('Transaction failed');

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Deposit failed:',
				expect.any(Error),
			);
			consoleErrorSpy.mockRestore();
		});
	});

	describe('withdrawETH', () => {
		it('should withdraw ETH successfully', async () => {
			const amount = 1;
			const userAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';

			// Mock sendTransaction to resolve with a wait function
			mockSendTransaction.mockResolvedValueOnce({
				wait: mockWait,
			});

			await withdrawETH(amount, userAddress);

			// Assertions
			expect(ethers.providers.Web3Provider).toHaveBeenCalledWith(
				window.ethereum,
			);
			expect(mockGetSigner).toHaveBeenCalled();
			expect(ethers.utils.parseEther).toHaveBeenCalledWith(amount.toString());
			expect(mockSendTransaction).toHaveBeenCalledWith({
				to: userAddress,
				value: amount.toString(),
			});
			expect(mockWait).toHaveBeenCalled();
		});

		it('should log an error if the transaction fails', async () => {
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			mockSendTransaction.mockRejectedValueOnce(
				new Error('Transaction failed'),
			);

			await expect(
				withdrawETH(1, '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef'),
			).rejects.toThrow('Transaction failed');

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Withdrawal failed:',
				expect.any(Error),
			);
			consoleErrorSpy.mockRestore();
		});
	});
});
