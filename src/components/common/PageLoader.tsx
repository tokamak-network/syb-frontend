'use client';

import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import { useTheme } from '@/context';
import { themeStyles } from '@/const';
import { cn } from '@/utils';

export const PageLoader: React.FC = () => {
	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	return (
		<div
			className={cn(
				'fixed inset-0 flex items-center justify-center',
				currentThemeStyles.background,
			)}
		>
			<ImSpinner2 className="animate-spin text-blue-500" size={40} />
		</div>
	);
};
