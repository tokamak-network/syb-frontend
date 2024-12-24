'use client';

import React, { useState } from 'react';

import { apiRequest } from '@/utils/api';
import { useToast } from '@/context';

interface ChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [currentPassword, setCurrentPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { addToast } = useToast();

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			addToast(
				'error',
				'Validation Error',
				'New password and confirm password do not match.',
			);

			return;
		}

		setIsLoading(true);

		try {
			const response: any = await apiRequest({
				method: 'POST',
				url: '/account/update-profile',
				data: {
					currentPassword,
					newPassword,
				},
			});

			addToast(
				'success',
				'Password Changed',
				response.message || 'Password changed successfully!',
			);
			onClose();
		} catch (error: any) {
			addToast(
				'error',
				'Error',
				error.response?.data?.error || 'Failed to change password.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="text-xl font-bold">Change Password</h2>
				<div className="mt-4 space-y-4">
					<input
						className="w-full rounded-lg border px-3 py-2"
						placeholder="Current Password"
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
					<input
						className="w-full rounded-lg border px-3 py-2"
						placeholder="New Password"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<input
						className="w-full rounded-lg border px-3 py-2"
						placeholder="Confirm New Password"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
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
						onClick={handleChangePassword}
					>
						{isLoading ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	);
};
