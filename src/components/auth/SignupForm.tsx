'use client';

import React, { useState } from 'react';

export const SignupForm: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert('Passwords do not match');

			return;
		}
		console.log('Signup with:', { email, password });
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="email"
				>
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
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="password"
				>
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
			<div>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="confirmPassword"
				>
					Confirm Password
				</label>
				<input
					required
					className="w-full rounded-lg border px-3 py-2"
					id="confirmPassword"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</div>
			<button
				className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
				type="submit"
			>
				Signup
			</button>
		</form>
	);
};
