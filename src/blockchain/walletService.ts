import { ethers } from 'ethers';

export const depositETH = async (amount: number, platformAddress: string) => {
	try {
		if (!window.ethereum) {
			throw new Error('MetaMask is not installed');
		}
		const provider = new ethers.providers.Web3Provider(window.ethereum as any);
		const signer = provider.getSigner();
		const transaction = await signer.sendTransaction({
			to: platformAddress,
			value: ethers.utils.parseEther(amount.toString()),
		});

		await transaction.wait();
		console.log(`Deposited ${amount} ETH to ${platformAddress}`);
	} catch (error) {
		console.error('Deposit failed:', error);
		throw error;
	}
};

export const withdrawETH = async (amount: number, userAddress: string) => {
	try {
		const provider = new ethers.providers.Web3Provider(window.ethereum as any);
		const signer = provider.getSigner();
		const transaction = await signer.sendTransaction({
			to: userAddress,
			value: ethers.utils.parseEther(amount.toString()),
		});

		await transaction.wait();
		console.log(`Withdrew ${amount} ETH to ${userAddress}`);
	} catch (error) {
		console.error('Withdrawal failed:', error);
		throw error;
	}
};
