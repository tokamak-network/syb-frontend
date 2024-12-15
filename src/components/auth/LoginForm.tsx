'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginFormInputs {
	email: string;
	password: string;
}

export const LoginForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();
	const router = useRouter();

	const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
		const result = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		});

		if (result?.error) {
			alert('Login failed. Please check your credentials.');
		} else {
			alert('Login successful');
			router.push('/account');
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label className="block text-sm font-medium" htmlFor="email">
					Email
				</label>
				<input
					{...register('email', {
						required: 'Email is required',
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: 'Invalid email address',
						},
					})}
					className="w-full rounded-lg border px-3 py-2"
					id="email"
					type="email"
				/>
				{errors.email && <p className="text-red-500">{errors.email.message}</p>}
			</div>
			<div>
				<label className="block text-sm font-medium" htmlFor="password">
					Password
				</label>
				<input
					{...register('password', {
						required: 'Password is required',
						minLength: {
							value: 6,
							message: 'Password must be at least 6 characters',
						},
					})}
					className="w-full rounded-lg border px-3 py-2"
					id="password"
					type="password"
				/>
				{errors.password && (
					<p className="text-red-500">{errors.password.message}</p>
				)}
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
