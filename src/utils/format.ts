// utils/format.ts

import { format, formatDistanceToNow } from 'date-fns';
import { isAddress } from 'viem';

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

export const formatAmount = (amount: string) => {
	const ethAmount = parseFloat(amount) / 1e18;

	return `${ethAmount.toFixed(4)} ETH`;
};

export const formatAddress = (address: string) => {
	if (!address) return '-';
	const cleanAddress = address.replace('ton:', '');

	return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`;
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

export const formatEthAddress = (address: string): `0x${string}` => {
	const cleanAddress = address.replace('0x', '');

	return `0x${cleanAddress}` as `0x${string}`;
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
 * Shortens a transaction hash for display.
 * @param hash - The transaction hash to format.
 * @param chars - Number of characters to show at the start and end (default: 6).
 * @returns {string} - The shortened transaction hash.
 */
export const formatTransactionHash = (
	hash: string,
	chars: number = 6,
): string => {
	if (!hash) return '-';

	// Remove '0x' prefix if present for consistent formatting
	const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;

	if (cleanHash.length <= chars * 2) return hash;

	return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
};

/**
 * Remove a ton prefix from address and format it for display.
 * @param address - The ton address to format.
 * @returns {string} - The formatted ton address.
 */
export const formatTonAddress = (
	address?: string,
	shorten: boolean = false,
): string => {
	if (!address) return '-';

	const newAddress = address.replace('ton:', '');

	if (shorten) {
		return `${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`;
	}

	return newAddress;
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
