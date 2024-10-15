// utils/format.ts

/**
 * Shortens an Ethereum address for display.
 * @param address - The Ethereum address to shorten.
 * @param chars - Number of characters to show at the start and end.
 * @returns {string} - The shortened address.
 */
export const shortenAddress = (address: string, chars: number = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
