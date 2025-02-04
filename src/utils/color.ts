// utils/color.ts

import { ActionType, ActionStatus } from '@/types';

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

export const typeStyles = {
	[ActionType.DEPOSIT]: 'text-green-500',
	[ActionType.WITHDRAW]: 'text-sky-500',
	[ActionType.EXPLODE]: 'text-gray-500',
	[ActionType.VOUCH]: 'text-blue-500',
};

export const statusStyles = {
	[ActionStatus.SUCCESS]: 'text-green-700',
	[ActionStatus.PENDING]: 'text-yellow-700',
	[ActionStatus.FAILED]: 'text-red-700',
};
