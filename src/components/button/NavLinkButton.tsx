import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import { themeStyles } from '@/const/themeStyles';

export const navButtonStyles = (
	currentThemeStyles: { text: string; hoverText: string },
	className?: string,
) =>
	cn(
		`relative flex flex-col items-center rounded px-8 py-1 transition-colors duration-200`,
		currentThemeStyles.text,
		currentThemeStyles.hoverText,
		className,
	);

interface NavLinkButtonProps {
	href: string;
	label: string;
	className?: string;
}

export const NavLinkButton: React.FC<NavLinkButtonProps> = ({
	href,
	label,
	className,
	...props
}) => {
	const { theme } = useTheme();
	const pathname = usePathname();

	const currentThemeStyles = themeStyles[theme];
	const isActive = pathname === href || pathname.startsWith(href);

	return (
		<Link
			{...props}
			className={navButtonStyles(currentThemeStyles, className)}
			href={href}
		>
			<span>{label}</span>
			{isActive && (
				<span
					className={`absolute bottom-0 left-0 h-[2px] w-full bg-indigo-500 transition-all duration-300 ease-in-out`}
				/>
			)}
		</Link>
	);
};
