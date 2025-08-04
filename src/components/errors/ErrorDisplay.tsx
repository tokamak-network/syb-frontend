'use client';

import Link from 'next/link';

import { Button } from '../button';

interface ErrorDisplayProps {
	title: string;
	message?: string;
	digest?: string;
	onReset?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
	title,
	message,
	digest,
	onReset,
}) => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 text-gray-800 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
			<div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-2xl md:p-12 dark:bg-gray-700">
				<svg
					className="mx-auto mb-6 h-20 w-20 text-red-500 dark:text-red-400"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<h1 className="mb-4 text-3xl font-bold text-red-600 md:text-4xl dark:text-red-500">
					{title}
				</h1>
				{message && (
					<p className="text-md mb-6 text-gray-600 md:text-lg dark:text-gray-300">
						{message}
					</p>
				)}
				{digest && (
					<div className="mb-6 overflow-x-auto rounded-md bg-gray-100 p-3 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400">
						<p className="font-mono">Error Digest: {digest}</p>
					</div>
				)}
				<div className="flex flex-col justify-center gap-4 sm:flex-row">
					{onReset && (
						<Button className="w-full sm:w-auto" color="red" onClick={onReset}>
							Try Again
						</Button>
					)}
					<Link passHref href="/">
						<Button
							className="w-full border-gray-500 text-gray-700 sm:w-auto dark:border-gray-400 dark:text-gray-300"
							color="gray"
						>
							Go to Homepage
						</Button>
					</Link>
				</div>
			</div>
			<footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
				<p>
					&copy; {new Date().getFullYear()} Your Application. If the issue
					persists, please contact support.
				</p>
			</footer>
		</div>
	);
};
