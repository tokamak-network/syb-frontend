'use client';

import {
	ErrorBoundary as ReactErrorBoundary,
	FallbackProps,
} from 'react-error-boundary';
import React, { ErrorInfo } from 'react';

import { ErrorDisplay } from './ErrorDisplay';

interface FunctionalErrorBoundaryProps {
	children: React.ReactNode;
	fallbackTitle?: string;
	fallbackMessage?: string;
	onResetKeys?: unknown[];
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorDisplay
			message={
				error.message || 'This part of the application encountered an error.'
			}
			title="Component Error"
			onReset={resetErrorBoundary}
		/>
	);
}

export function ErrorBoundary({
	children,
	fallbackTitle = 'Component Error',
	fallbackMessage,
	onResetKeys,
}: FunctionalErrorBoundaryProps) {
	const handleOnError = (error: Error, info: ErrorInfo) => {
		console.error(
			'ErrorBoundary (react-error-boundary) caught an error:',
			error,
			info.componentStack,
		);
	};

	return (
		<ReactErrorBoundary
			FallbackComponent={(props) => (
				<ErrorDisplay
					message={
						fallbackMessage ||
						props.error.message ||
						'This part of the application encountered an error.'
					}
					title={fallbackTitle}
					onReset={props.resetErrorBoundary}
				/>
			)}
			resetKeys={onResetKeys}
			onError={handleOnError}
		>
			{children}
		</ReactErrorBoundary>
	);
}
