import React, { forwardRef } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';
import { useTheme } from '@/context';
import { themeStyles } from '@/const/themeStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	backgroundImage?: string;
	isLoading?: boolean;
	leftIcon?: IconType;
	rightIcon?: IconType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			isLoading = false,
			leftIcon: LeftIcon,
			rightIcon: RightIcon,
			disabled,
			className,
			...props
		},
		ref,
	) => {
		const { theme } = useTheme();
		const currentThemeStyles = themeStyles[theme];

		return (
			<button
				ref={ref}
				className={cn(
					'flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors',
					'disabled:cursor-not-allowed disabled:opacity-50',
					isLoading && 'cursor-wait',
					currentThemeStyles.buttonBg,
					currentThemeStyles.buttonText,
					className,
				)}
				disabled={isLoading || disabled}
				{...props}
			>
				{isLoading ? (
					<ImSpinner2 className="animate-spin text-white" />
				) : (
					<div className="flex w-full items-center justify-center whitespace-nowrap">
						{LeftIcon && <LeftIcon className="mr-2 flex-shrink-0" size={20} />}
						{children}
						{RightIcon && (
							<RightIcon className="ml-2 flex-shrink-0" size={20} />
						)}
					</div>
				)}
			</button>
		);
	},
);

Button.displayName = 'Button';
