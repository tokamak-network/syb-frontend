// utils/format.ts

import { format, formatDistanceToNow } from 'date-fns';

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
	// Ensure the input is a Date object
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false, // Use 24-hour format
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
