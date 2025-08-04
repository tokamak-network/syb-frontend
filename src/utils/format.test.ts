jest.mock('viem', () => ({
	isAddress: (address: string) => {
		return /^0x[0-9a-fA-F]{40}$/.test(address);
	},
}));

import {
	shortenAddress,
	formatDate,
	formatTime,
	formatFullTime,
	formatFirstLetter,
	formatAmount,
	formatAddress,
	formatTimestamp,
	validateAddress,
	formatEthAddress,
	convertToUint40Format,
	float2Fix,
	formatTransactionHash,
} from './format';

describe('shortenAddress', () => {
	it('should shorten the address in the middle by default', () => {
		const address = '0x1234567890abcdef1234567890abcdef12345678';
		const result = shortenAddress(address);

		expect(result).toBe('0x1234...5678');
	});

	it('should shorten the address at the end if specified', () => {
		const address = '0x1234567890abcdef1234567890abcdef12345678';
		const result = shortenAddress(address, 'end');

		expect(result).toBe('0x12345678...');
	});

	it('should return the full address if no shortening is specified', () => {
		const address = '0x1234567890abcdef1234567890abcdef12345678';
		const result = shortenAddress(address, 'none');

		expect(result).toBe(address);
	});
});

describe('formatDate', () => {
	it('should return "Today" for today\'s date', () => {
		const today = new Date();

		expect(formatDate(today)).toBe('Today');
	});

	it('should return "Yesterday" for yesterday\'s date', () => {
		const yesterday = new Date();

		yesterday.setDate(yesterday.getDate() - 1);
		expect(formatDate(yesterday)).toBe('Yesterday');
	});

	it('should return a formatted date for other dates', () => {
		const date = new Date('2024-12-13');

		expect(formatDate(date)).toBe('13/12/2024');
	});
});

describe('formatTime', () => {
	it('should format the time in HH:mm format', () => {
		const date = new Date('2025-01-14T15:30:00');

		expect(formatTime(date)).toBe('15:30');
	});

	it('should pad single digit hours and minutes with zeros', () => {
		const date = new Date('2025-01-14T09:05:00');

		expect(formatTime(date)).toBe('09:05');
	});
});

describe('formatFullTime', () => {
	it('should format the date and time in full format', () => {
		const date = new Date('2024-09-01T15:30:45');

		expect(formatFullTime(date)).toMatch(/09\/01\/2024, 15:30:45/);
	});
});

describe('formatFirstLetter', () => {
	it('should capitalize the first letter of a string', () => {
		expect(formatFirstLetter('hello')).toBe('Hello');
	});

	it('should handle empty string', () => {
		expect(formatFirstLetter('')).toBe('');
	});

	it('should handle null or undefined', () => {
		expect(formatFirstLetter(undefined as unknown as string)).toBe(undefined);
	});
});

describe('formatAmount', () => {
	it('should format Wei to ETH with 4 decimal places', () => {
		expect(formatAmount('1000000000000000000')).toBe('1.0000 ETH');
		expect(formatAmount('500000000000000000')).toBe('0.5000 ETH');
	});

	it('should handle small amounts', () => {
		expect(formatAmount('1000000000000000')).toBe('0.0010 ETH');
	});
});

describe('formatAddress', () => {
	it('should format regular address', () => {
		const address = '0x1234567890abcdef1234567890abcdef12345678';

		expect(formatAddress(address)).toBe('0x1234...5678');
	});

	it('should handle ton: prefix', () => {
		const address = 'ton:0x1234567890abcdef1234567890abcdef12345678';

		expect(formatAddress(address)).toBe('0x1234...5678');
	});

	it('should return dash for empty address', () => {
		expect(formatAddress('')).toBe('-');
	});
});

describe('formatTimestamp', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2025-02-18T21:00:23'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('should format timestamp with time ago and full date', () => {
		const timestamp = new Date('2025-02-18T20:44:23'); // 16 minutes ago
		const result = formatTimestamp(timestamp);

		expect(result).toMatch(/16 minutes ago \(Feb-18-2025 08:44:23 PM \+UTC\)/);
	});

	it('should handle string timestamp input', () => {
		const timestamp = '2025-02-18T20:44:23';
		const result = formatTimestamp(timestamp);

		expect(result).toMatch(/16 minutes ago \(Feb-18-2025 08:44:23 PM \+UTC\)/);
	});
});

describe('validateAddress', () => {
	it('should validate correct Ethereum address', () => {
		const address = '0x1234567890123456789012345678901234567890';

		expect(validateAddress(address)).toBe(address);
	});

	it('should throw error for invalid address', () => {
		const address = '0xinvalid';

		expect(() => validateAddress(address)).toThrow('Invalid Ethereum address');
	});
});

describe('formatEthAddress', () => {
	it('should format address with 0x prefix and shorten it', () => {
		const address = '1234567890123456789012345678901234567890';

		expect(formatEthAddress(address)).toBe('0x1234...7890');
	});

	it('should handle address that already has 0x prefix and shorten it', () => {
		const address = '0x1234567890123456789012345678901234567890';

		expect(formatEthAddress(address)).toBe('0x1234...7890');
	});

	it('should return dash for empty address', () => {
		expect(formatEthAddress('')).toBe('-');
	});
});

describe('convertToUint40Format', () => {
	it('should convert amount to uint40 format', () => {
		expect(convertToUint40Format('1.0')).toBeTruthy();
		expect(typeof convertToUint40Format('1.0')).toBe('bigint');
	});

	it('should handle small amounts', () => {
		expect(convertToUint40Format('0.001')).toBeTruthy();
	});
});

describe('float2Fix', () => {
	it('should convert float value to fixed point', () => {
		expect(float2Fix(1000000)).toBeTruthy();
		expect(typeof float2Fix(1000000)).toBe('bigint');
	});

	it('should handle zero', () => {
		expect(float2Fix(0)).toBe(0n);
	});
});

describe('formatTransactionHash', () => {
	it('should format a standard transaction hash', () => {
		const hash =
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

		expect(formatTransactionHash(hash)).toBe('0x123456...abcdef');
	});

	it('should return the original hash if it is too short to shorten', () => {
		const hash = '0x12345';

		expect(formatTransactionHash(hash)).toBe('0x12345');
	});

	it('should return the original hash if it is short (<= 12 chars for default of 6)', () => {
		const hash = '0x1234567890ab'; // 14 chars including 0x, cleanHash is 12

		expect(formatTransactionHash(hash)).toBe('0x1234567890ab');
	});

	it('should return "-" for an empty hash string', () => {
		expect(formatTransactionHash('')).toBe('-');
	});

	it('should format a hash without the 0x prefix and add the prefix', () => {
		const hash =
			'1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

		// The function should add '0x' prefix and then format properly
		expect(formatTransactionHash(hash)).toBe('0x123456...abcdef');
	});

	it('should format a hash with a custom number of characters', () => {
		const hash =
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

		expect(formatTransactionHash(hash, 4)).toBe('0x1234...cdef');
	});

	it('should handle a hash that is shorter than custom chars * 2 but has 0x', () => {
		const hash = '0xabcdef1234'; // 12 chars, cleanHash is 10

		expect(formatTransactionHash(hash, 6)).toBe('0xabcdef1234');
	});

	it('should handle a hash without 0x that is shorter than custom chars * 2', () => {
		const hash = 'abcdef1234'; // 10 chars

		expect(formatTransactionHash(hash, 6)).toBe('0xabcdef1234');
	});
});
