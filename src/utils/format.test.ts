import {
	shortenAddress,
	formatDate,
	formatTime,
	formatFullTime,
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
});

describe('formatFullTime', () => {
	it('should format the date and time in full format', () => {
		const date = new Date('2024-09-01T15:30:45');

		expect(formatFullTime(date)).toBe('09/01/2024, 15:30:45');
	});
});
