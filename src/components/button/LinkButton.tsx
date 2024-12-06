import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';
import { useTheme } from '@/context/ThemeContext';
import { themeStyles } from '@/const';

interface LinkButtonProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	label?: string;
	href: string;
	className?: string;
	icon?: IconType;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
	label,
	href,
	className,
	icon: Icon,
	...props
}) => {
	const { theme } = useTheme();
	const currentThemeStyles = themeStyles[theme];

	return (
		<a
			className={cn(
				'link-button relative flex w-max overflow-hidden px-0 pb-1',
				currentThemeStyles.beforeBg,
				currentThemeStyles.afterBg,
				className,
			)}
			href={href}
			{...props}
		>
			{Icon && <Icon className="flex-shrink-0" size={20} />}
			{label && <span className="text-md font-medium">{label}</span>}
		</a>
	);
};
