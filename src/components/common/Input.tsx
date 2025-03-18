'use client';

import React from 'react';

import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	className?: string;
	labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
	label,
	className,
	labelClassName,
	disabled,
	...props
}) => {
	return (
		<div className="flex w-full flex-col space-y-2">
			{label && (
				<label
					className={cn(
						'text-sm font-medium text-gray-200',
						disabled && 'opacity-50',
						labelClassName,
					)}
					htmlFor={props.id}
				>
					{label}
				</label>
			)}
			<input
				className={cn(
					'w-full rounded-md border border-white/20 bg-white/10 p-2 text-sm text-white placeholder-white/50 shadow-sm transition-colors',
					'hover:bg-white/20',
					'focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50',
					disabled && 'cursor-not-allowed opacity-50',
					className,
				)}
				disabled={disabled}
				{...props}
			/>
		</div>
	);
};
