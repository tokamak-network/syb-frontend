import React, { forwardRef } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { IconType } from 'react-icons';

import { cn } from '@/utils/cn';
import { useTheme } from '@/context';
import { themeStyles } from '@/const';

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
			backgroundImage,
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

		const textColorClass =
			theme === 'dark' || theme === 'dim'
				? 'text-white'
				: currentThemeStyles.buttonText;

		return (
			<button
				ref={ref}
				className={cn(
					'flex items-center justify-center rounded px-4 py-2 font-medium transition-colors duration-200',
					backgroundImage
						? 'bg-cover bg-center bg-no-repeat'
						: theme === 'dark'
							? 'bg-gray-700'
							: theme === 'dim'
								? 'bg-gray-600'
								: currentThemeStyles.buttonBg,
					isLoading && 'cursor-wait',
					disabled
						? 'cursor-not-allowed opacity-60'
						: theme === 'dark'
							? 'hover:bg-gray-600'
							: theme === 'dim'
								? 'hover:bg-gray-500'
								: currentThemeStyles.hoverBg,
					textColorClass,
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
					<ImSpinner2 className={`animate-spin ${currentThemeStyles.text}`} />
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
