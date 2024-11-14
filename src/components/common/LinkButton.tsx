import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';

interface LinkButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
}) => {
	return (
		<a
			className={cn(
				'link-button relative flex w-max overflow-hidden pb-1 before:bg-white after:bg-white',
				className,
			)}
			href={href}
		>
			{Icon && <Icon className="flex-shrink-0" size={20} />}
			{label && <span>{label}</span>}
		</a>
	);
};
