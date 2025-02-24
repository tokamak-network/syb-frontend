'use client';

import React from 'react';

import { cn } from '@/utils/cn';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	className?: string;
}

export const Form: React.FC<FormProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<form className={cn('space-y-4', className)} {...props}>
			{children}
		</form>
	);
};
