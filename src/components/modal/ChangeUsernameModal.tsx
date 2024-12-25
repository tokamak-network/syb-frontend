'use client';

import React, { useState } from 'react';

import { apiRequest } from '@/utils/api';
import { useToast } from '@/context';

import { Button } from '../button';

interface ChangeUsernameModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentUsername: string;
	onUsernameChange: (newUsername: string) => void;
}

export const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({
	isOpen,
	onClose,
	currentUsername,
	onUsernameChange,
}) => {
	const [newUsername, setNewUsername] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { addToast } = useToast();

	const handleChangeUsername = async () => {
		if (!newUsername) {
			alert('New username cannot be empty.');

			return;
		}

		setIsLoading(true);

		try {
			const response: any = await apiRequest({
				method: 'POST',
				url: '/account/update-profile',
				data: {
					newUsername,
				},
			});

			addToast(
				'success',
				'Username Changed',
				response.message || 'Username changed successfully!',
			);

			onUsernameChange(newUsername);

			onClose();
		} catch (error: any) {
			addToast(
				'error',
				'Error',
				error.response?.data?.error || 'Failed to change username.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="text-xl font-bold">Change Username</h2>
				<div className="mt-4 space-y-4">
					<p>
						<strong>Current Username:</strong> {currentUsername}
					</p>
					<input
						className="w-full rounded-lg border px-3 py-2"
						placeholder="New Username"
						type="text"
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)}
					/>
				</div>
				<div className="mt-6 flex justify-end space-x-4">
					<button
						className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
						disabled={isLoading}
						onClick={onClose}
					>
						Cancel
					</button>
					<Button
						className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						isLoading={isLoading}
						onClick={handleChangeUsername}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};
