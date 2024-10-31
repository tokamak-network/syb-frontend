// utils/color.ts

/**
 * Generates a random hex color.
 * @returns {string} - The random hex color.
 */
export const randomColor = (): string => {
	const letters = '0123456789ABCDEF';
	let color = '#';

	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
};
