import React from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	backgroundImage?: string;
	isLoading?: boolean;
	leftIcon?: IconType;
	rightIcon?: IconType;
}

export const Button: React.FC<ButtonProps> = ({
	backgroundImage,
	children,
	isLoading = false,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	disabled,
	className,
	...props
}) => {
	return (
		<button
			className={cn(
				'flex items-center justify-center rounded px-4 py-2 font-medium shadow-sm transition-colors duration-200 hover:bg-opacity-80',
				backgroundImage
					? 'bg-cover bg-center bg-no-repeat'
					: 'hover:bg-blue-500',
				isLoading && 'cursor-wait',
				className,
			)}
			disabled={isLoading || disabled}
			style={{
				backgroundImage: backgroundImage
					? `url(${backgroundImage})`
					: undefined,
			}}
			{...props}
		>
			{isLoading ? (
				<ImSpinner2 className="animate-spin" />
			) : (
				<div className="flex w-full items-center justify-center whitespace-nowrap">
					{LeftIcon && <LeftIcon className="mr-2 flex-shrink-0" size={20} />}
					<span>{children}</span>
					{RightIcon && <RightIcon className="ml-2 flex-shrink-0" size={20} />}
				</div>
			)}
		</button>
	);
};
