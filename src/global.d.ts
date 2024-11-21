import { ExternalProvider } from 'ethers';

interface EthereumProvider extends ExternalProvider {
	on?: (event: string, handler: (...args: any[]) => void) => void;
	removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
	interface Window {
		ethereum?: EthereumProvider;
	}
}
