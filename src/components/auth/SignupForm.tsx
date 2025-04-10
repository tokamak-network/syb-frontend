'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { useTheme, useToast } from '@/context';
import { apiRequest } from '@/utils/api';
import { Button } from '@/components';
import { inputThemeStyles } from '@/const';

interface SignupFormInputs {
	email: string;
	password: string;
	confirmPassword: string;
}

export const SignupForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupFormInputs>();
	const router = useRouter();
	const { addToast } = useToast();
	const { theme } = useTheme();

	const [loading, setLoadig] = useState<boolean>(false);

	const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
		if (data.password !== data.confirmPassword) {
			addToast('error', 'Signup Failed', 'Passwords do not match.');

			return;
		}

		try {
			setLoadig(true);
			await apiRequest({
				method: 'POST',
				url: '/auth/register',
				data,
			});
			setLoadig(false);
			addToast(
				'success',
				'Signup Successful',
				'Your account has been created.',
			);
			router.push('/login');
		} catch (error: any) {
			setLoadig(false);
			const errorMessage =
				error.response?.data?.message || 'An unexpected error occurred.';

			addToast('error', 'Signup Error', errorMessage);
		}
	};

	const password = watch('password');

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
							value: /^[^\s@]+@[^\s@]+\.[^\s@]/,
							message: 'Invalid email address',
						},
					})}
					className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring ${inputThemeStyles(theme)}`}
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
					className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring ${inputThemeStyles(theme)}`}
					id="password"
					type="password"
				/>
				{errors.password && (
					<p className="text-red-500">{errors.password.message}</p>
				)}
			</div>
			<div>
				<label className="block text-sm font-medium" htmlFor="confirmPassword">
					Confirm Password
				</label>
				<input
					{...register('confirmPassword', {
						required: 'Please confirm your password',
						validate: (value) => value === password || 'Passwords do not match',
					})}
					className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring ${inputThemeStyles(theme)}`}
					id="confirmPassword"
					type="password"
				/>
				{errors.confirmPassword && (
					<p className="text-red-500">{errors.confirmPassword.message}</p>
				)}
			</div>
			<Button
				className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
				isLoading={loading}
				type="submit"
			>
				Signup
			</Button>
		</form>
	);
};
