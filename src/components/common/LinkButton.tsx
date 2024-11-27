import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';

import { Button } from './Button';

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
	onMouseEnter,
	...props
}) => {
	return (
		<Button
			className={cn(
				'link-button relative flex w-max overflow-hidden px-0 pb-1 before:bg-white after:bg-white hover:bg-inherit',
				className,
			)}
			onClick={() => {
				window.open(href, '_blank');
			}}
			onMouseEnter={onMouseEnter}
			{...props}
		>
			{Icon && <Icon className="flex-shrink-0" size={20} />}
			{label && <span className="text-md font-medium">{label}</span>}
		</Button>
	);
};
