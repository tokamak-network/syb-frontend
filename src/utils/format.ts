// utils/format.ts

import { format, formatDistanceToNow } from 'date-fns';
import { isAddress, getAddress } from 'viem';

/**
 * Shortens an Ethereum address for display.
 * @param address - The Ethereum address to shorten.
 * @param chars - Number of characters to show at the start and end.
 * @param shorten - Position of characters to shorten.
 * @returns {string} - The shortened address.
 */
export const shortenAddress = (
	address: string,
	shorten: string = 'middle',
): string => {
	if (shorten === 'middle') {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	} else if (shorten === 'end') {
		return `${address.slice(0, 10)}...`;
	}

	return address;
};

/**
 * Format Date for UI display.
 * @param Date - Selected Date for Transaction History
 * @returns {string} - The Format Date.
 */
export const formatDate = (date: Date) => {
	const today = new Date();
	const yesterday = new Date(today);

	yesterday.setDate(today.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return 'Today';
	} else if (date.toDateString() === yesterday.toDateString()) {
		return 'Yesterday';
	} else {
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	}
};

/**
 * Format Time for UI display.
 * @param Date - Selected Date for Transaction History
 * @returns {string} - The Format Time.
 */
export const formatTime = (date: Date) => {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${hours}:${minutes}`;
};

export const formatFullTime = (date: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	};

	return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatFirstLetter = (input: string) => {
	if (!input) {
		return input;
	}

	return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Formats a Wei amount to a user-friendly value in ETH, Gwei, or Wei.
 * @param amount - The amount in Wei as a string.
 * @param decimals - Number of decimal places to show (default: 4).
 * @returns {string} - The formatted amount in the most appropriate unit.
 */
export const formatAmount = (amount: string, decimals: number = 4): string => {
	const weiValue = parseFloat(amount);

	const ethValue = weiValue / 1e18;
	const gweiValue = weiValue / 1e9;

	if (ethValue < 0.0001 && ethValue > 0) {
		return `${gweiValue.toFixed(decimals)} Gwei`;
	}
	if (gweiValue < 0.0001 && gweiValue > 0) {
		return `${weiValue} Wei`;
	}

	return `${ethValue.toFixed(decimals)} ETH`;
};

export const formatAddress = (address: string) => {
	if (!address) return '-';
	let cleanAddress = address.replace('ton:', '');

	// Add 0x prefix if missing and address looks like hex (40 chars)
	if (
		!cleanAddress.startsWith('0x') &&
		/^[a-fA-F0-9]{40}$/.test(cleanAddress)
	) {
		cleanAddress = `0x${cleanAddress}`;
	}

	// Apply checksum formatting for Ethereum addresses
	const checksummedAddress = isAddress(cleanAddress)
		? toChecksumAddress(cleanAddress)
		: cleanAddress;

	return `${checksummedAddress.slice(0, 6)}...${checksummedAddress.slice(-4)}`;
};

export const formatTimestamp = (timestamp: string | Date): string => {
	const date = new Date(timestamp);
	const timeAgo = formatDistanceToNow(date, { addSuffix: true });
	const fullDate = format(date, "MMM-dd-yyyy hh:mm:ss a '+UTC'");

	return `${timeAgo} (${fullDate})`;
};

export const validateAddress = (address: string): `0x${string}` => {
	if (!isAddress(address)) {
		throw new Error('Invalid Ethereum address');
	}

	return address as `0x${string}`;
};

export const formatEthAddress = (address: string): string => {
	if (!address) return '-';
	const cleanAddress = address.replace('0x', '');
	const formattedAddress = toChecksumAddress(`0x${cleanAddress}`);

	return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
};

/**
 * Formats an Ethereum address to its full checksummed format.
 * @param address - The Ethereum address to format
 * @returns {`0x${string}`} - The formatted address with 0x prefix
 */
export const formatFullEthAddress = (address: string): `0x${string}` => {
	if (!address)
		return '0x0000000000000000000000000000000000000000' as `0x${string}`;
	const cleanAddress = address.replace('0x', '');

	return toChecksumAddress(`0x${cleanAddress}`) as `0x${string}`;
};

export const convertToUint40Format = (amount: string): bigint => {
	const amountInWei = parseFloat(amount) * 1e18;

	let e = 0;
	let m = amountInWei;

	while (m >= 0x7ffffffff) {
		m = m / 10;
		e += 1;
	}

	const mantissa = BigInt(Math.floor(m)) & BigInt(0x7ffffffff);
	const bigE = BigInt(e);
	const exponent = bigE << 35n;
	const uint40Value = exponent | mantissa;

	return BigInt(uint40Value);
};

export const float2Fix = (floatVal: number): bigint => {
	const m = BigInt(floatVal & 0x7ffffffff);
	const e = BigInt(floatVal >> 35);
	const exp = 10n ** e;

	return m * exp;
};

/**
 * Formats a transaction hash for display.
 * @param hash - The transaction hash to format.
 * @param chars - Number of characters to show at the start and end (default: 6).
 * @param fullFormat - Whether to return the full hash or shortened version (default: false).
 * @returns {string} - The formatted transaction hash.
 */
export const formatTransactionHash = (
	hash: string,
	chars: number = 6,
	fullFormat: boolean = false,
): string => {
	if (!hash) return '-';

	const prefixedHash = hash.startsWith('0x') ? hash : `0x${hash}`;

	if (fullFormat) return prefixedHash;

	const cleanHash = prefixedHash.slice(2);

	if (cleanHash.length <= chars * 2) return prefixedHash;

	return `${prefixedHash.slice(0, chars + 2)}...${prefixedHash.slice(-chars)}`;
};

/**
 * Converts wei value to both gwei and ether.
 * @param wei - The amount in wei to convert.
 * @returns {Object} - Object containing the converted gwei and ether values.
 */
export const convertWeiToGweiAndEther = (
	wei: number,
): { gwei: number; ether: number } => {
	const gwei = wei / 1e9;
	const ether = wei / 1e18;

	return { gwei, ether };
};

/**
 * Converts an Ethereum address to its proper EIP-55 checksummed format.
 * @param address - The Ethereum address (can be lowercase or mixed case).
 * @returns {string} - The checksummed Ethereum address.
 */
export const toChecksumAddress = (address: string): string => {
	if (!address) return address;

	try {
		let cleanAddress = address.replace(/^eth:/, '');

		if (
			!cleanAddress.startsWith('0x') &&
			/^[a-fA-F0-9]{40}$/.test(cleanAddress)
		) {
			cleanAddress = `0x${cleanAddress}`;
		}

		if (isAddress(cleanAddress)) {
			return getAddress(cleanAddress);
		}

		return address;
	} catch (error) {
		console.warn('Failed to checksum address:', address, error);

		return address;
	}
};

/**
 * Formats a value in wei to the most appropriate unit (ETH, Gwei, or Wei)
 * @param value - The value in wei
 * @param decimals - Number of decimal places to show (default: 4)
 * @returns {string} - Formatted value with appropriate unit
 */
export const formatWeiValue = (
	value: string | number,
	decimals: number = 4,
): string => {
	const weiValue = typeof value === 'string' ? parseFloat(value) : value;

	// Convert to ETH
	const ethValue = weiValue / 1e18;
	// Convert to Gwei
	const gweiValue = weiValue / 1e9;

	// If value is less than 0.0001 ETH, show in Gwei
	if (ethValue < 0.0001 && ethValue > 0) {
		return `${gweiValue.toFixed(decimals)} Gwei`;
	}
	// If value is less than 0.0001 Gwei, show in Wei
	if (gweiValue < 0.0001 && gweiValue > 0) {
		return `${weiValue} Wei`;
	}

	// Otherwise show in ETH
	return `${ethValue.toFixed(decimals)} ETH`;
};

/**
 * Formats a balance value specifically for ETH display.
 * @param balance - The balance value (can be BigInt, string, or number) in Wei.
 * @param decimals - Number of decimal places to show (default: 4).
 * @returns {string} - The formatted balance in ETH.
 */
export const formatBalanceToEth = (
	balance: bigint | string | number | null | undefined,
	decimals: number = 4,
): string => {
	if (balance === null || balance === undefined) return '0 ETH';

	// Convert to number for calculation
	let weiValue: number;

	if (typeof balance === 'bigint') {
		weiValue = Number(balance);
	} else if (typeof balance === 'string') {
		weiValue = parseFloat(balance) || 0;
	} else {
		weiValue = balance;
	}

	// Convert Wei to ETH
	const ethValue = weiValue / 1e18;

	return `${ethValue.toFixed(decimals)} ETH`;
};

/**
 * Converts a BigInt value to a regular number for display.
 * @param value - The BigInt value to convert.
 * @returns {number} - The converted number.
 */
export const convertBigIntToNumber = (
	value: bigint | string | number | null | undefined,
): number => {
	if (value === null || value === undefined) return 0;

	if (typeof value === 'number') return value;

	if (typeof value === 'string') {
		// Try to parse as BigInt first, then as number
		try {
			return Number(BigInt(value));
		} catch {
			return Number(value) || 0;
		}
	}

	if (typeof value === 'bigint') {
		return Number(value);
	}

	return 0;
};

/**
 * Formats a score value for display, handling BigInt conversion.
 * @param score - The score value (can be BigInt, string, or number).
 * @returns {string} - The formatted score as a string.
 */
export const formatScore = (
	score: bigint | string | number | null | undefined,
): string => {
	const numericScore = convertBigIntToNumber(score);

	return numericScore.toString();
};
