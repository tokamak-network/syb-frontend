import React from 'react';
import { signIn } from 'next-auth/react';

export const SocialAuth: React.FC = () => {
	return (
		<div className="space-y-4">
			<button
				className="w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
				onClick={() => signIn('google')}
			>
				Continue with Google
			</button>
			<button
				className="w-full rounded-lg bg-gray-800 py-2 text-white hover:bg-gray-900"
				onClick={() => signIn('github')}
			>
				Continue with GitHub
			</button>
		</div>
	);
};
