'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/errors/ErrorDisplay';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Client-side error:', error);
	}, [error]);

	return (
		<ErrorDisplay
			title="Something Went Wrong"
			message={
				error.message ||
				'An unexpected client-side error occurred. Please try again.'
			}
			digest={error.digest}
			onReset={reset}
		/>
	);
}
