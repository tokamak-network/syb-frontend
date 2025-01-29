import { randomColor } from './color';

describe('randomColor', () => {
	it('should generate a valid hex color', () => {
		const color = randomColor();

		expect(color).toMatch(/^#[0-9A-F]{6}$/);
	});

	it('should generate different colors on multiple calls', () => {
		const color1 = randomColor();
		const color2 = randomColor();

		expect(color1).not.toEqual(color2);
	});
});
