'use client';

import {
	ErrorBoundary as ReactErrorBoundary,
	FallbackProps,
} from 'react-error-boundary';
import { ErrorDisplay } from './ErrorDisplay';
import React, { ErrorInfo } from 'react';

interface FunctionalErrorBoundaryProps {
	children: React.ReactNode;
	fallbackTitle?: string;
	fallbackMessage?: string;
	onResetKeys?: unknown[];
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<ErrorDisplay
			title="Component Error"
			message={
				error.message || 'This part of the application encountered an error.'
			}
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
					title={fallbackTitle}
					message={
						fallbackMessage ||
						props.error.message ||
						'This part of the application encountered an error.'
					}
					onReset={props.resetErrorBoundary}
				/>
			)}
			onError={handleOnError}
			resetKeys={onResetKeys}
		>
			{children}
		</ReactErrorBoundary>
	);
}
