'use client';

import { useEffect } from 'react';

import { ErrorDisplay } from '@/components/errors';

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
			digest={error.digest}
			message={
				error.message ||
				'An unexpected client-side error occurred. Please try again.'
			}
			title="Something Went Wrong"
			onReset={reset}
		/>
	);
}
