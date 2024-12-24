'use client';

import React, { useState } from 'react';

import { apiRequest } from '@/utils/api';

interface ChangeUsernameModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentUsername: string;
}

export const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({
	isOpen,
	onClose,
	currentUsername,
}) => {
	const [newUsername, setNewUsername] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleChangeUsername = async () => {
		if (!newUsername) {
			alert('New username cannot be empty.');

			return;
		}

		setIsLoading(true);

		try {
			await apiRequest({
				method: 'POST',
				url: '/api/account/update-profile',
				data: {
					newUsername,
				},
			});
			alert('Username changed successfully!');
			onClose();
		} catch (error) {
			console.error('Error changing username:', error);
			alert('Failed to change username.');
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
					<button
						className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						disabled={isLoading}
						onClick={handleChangeUsername}
					>
						{isLoading ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	);
};
