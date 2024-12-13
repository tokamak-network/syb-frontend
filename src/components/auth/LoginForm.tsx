'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export const LoginForm: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn('email', { email });
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div>
				<label className="block text-sm font-medium" htmlFor="email">
					Email
				</label>
				<input
					required
					className="w-full rounded-lg border px-3 py-2"
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div>
				<label className="block text-sm font-medium" htmlFor="password">
					Password
				</label>
				<input
					required
					className="w-full rounded-lg border px-3 py-2"
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button
				className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
				type="submit"
			>
				Login
			</button>
		</form>
	);
};
