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
	...props
}) => {
	return (
		<div className="flex w-full flex-col space-y-2">
			{label && (
				<label
					className={cn('text-sm font-medium', labelClassName)}
					htmlFor={props.id}
				>
					{label}
				</label>
			)}
			<input
				className={cn(
					'w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50',
					className,
				)}
				{...props}
			/>
		</div>
	);
};
