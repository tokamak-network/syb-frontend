import { ethers } from 'ethers';

// Function to deposit ETH
export const depositETH = async (amount: number, platformAddress: string) => {
	try {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const transaction = await signer.sendTransaction({
			to: platformAddress,
			value: ethers.utils.parseEther(amount.toString()),
		});

		await transaction.wait();
		console.log(`Deposited ${amount} ETH to ${platformAddress}`);
	} catch (error) {
		console.error('Deposit failed:', error);
	}
};

// Function to withdraw ETH
export const withdrawETH = async (amount: number, userAddress: string) => {
	try {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const transaction = await signer.sendTransaction({
			to: userAddress,
			value: ethers.utils.parseEther(amount.toString()),
		});

		await transaction.wait();
		console.log(`Withdrew ${amount} ETH to ${userAddress}`);
	} catch (error) {
		console.error('Withdrawal failed:', error);
	}
};
