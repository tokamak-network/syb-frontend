'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/errors/ErrorDisplay'; // Assuming this component doesn't rely on context from your main layout

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Global error:', error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<ErrorDisplay
					title="Application Error"
					message="A critical error occurred in the application. We apologize for the inconvenience."
					digest={error.digest}
					onReset={reset}
				/>
			</body>
		</html>
	);
}
