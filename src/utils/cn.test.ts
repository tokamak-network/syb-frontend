import { cn } from './cn';

describe('cn', () => {
	it('should merge class names correctly', () => {
		const result = cn('class1', 'class2');

		expect(result).toBe('class1 class2');
	});

	it('should handle conditional class names', () => {
		const result = cn('class1', false && 'class2', 'class3');

		expect(result).toBe('class1 class3');
	});

	it('should handle empty inputs', () => {
		const result = cn();

		expect(result).toBe('');
	});
});
