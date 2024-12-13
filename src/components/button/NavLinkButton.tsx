import React from 'react';
import Link from 'next/link';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import { themeStyles } from '@/const/themeStyles';

interface NavLinkButtonProps {
	href: string;
	label: string;
	className?: string;
}

export const NavLinkButton: React.FC<NavLinkButtonProps> = ({
	href,
	label,
	className,
}) => {
	const { theme } = useTheme();

	const currentThemeStyles = themeStyles[theme];

	return (
		<Link
			className={cn(
				`flex items-center rounded px-8 py-1 transition-colors duration-200`,
				currentThemeStyles.text,
				currentThemeStyles.hoverText,
				className,
			)}
			href={href}
		>
			{label}
		</Link>
	);
};
