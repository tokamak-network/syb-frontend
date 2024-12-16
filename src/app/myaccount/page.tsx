'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { apiRequest } from '@/utils/api';
import { ChangePasswordModal } from '@/components/account';

const MyAccount: React.FC = () => {
	const { data: session, status } = useSession();
	// const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (!session) {
		return <p>You are not logged in.</p>;
	}

	console.log(session, 'session');

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			setProfileImage(file);
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const handleSaveProfileImage = async () => {
		if (!profileImage) return;

		const formData = new FormData();

		formData.append('file', profileImage);

		try {
			await apiRequest({
				method: 'POST',
				url: '/api/account/upload-profile-image',
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			alert('Profile image updated successfully!');
		} catch (error) {
			console.error('Error uploading profile image:', error);
			alert('Failed to upload profile image.');
		}
	};

	return (
		<div className="flex flex-col items-center space-y-6 p-6">
			<h1 className="text-3xl font-bold">My Account</h1>
			<div className="flex flex-col items-center space-y-4">
				<div className="relative">
					<Image
						alt="Profile"
						className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
						height={40}
						src={previewImage || '/default-profile.png'}
						width={40}
					/>
					<input
						accept="image/*"
						className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
						type="file"
						onChange={handleImageUpload}
					/>
				</div>
				<button
					className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					onClick={handleSaveProfileImage}
				>
					Save Profile Image
				</button>
			</div>
			<div className="flex flex-col items-center space-y-4">
				<div className="text-lg">
					<strong>Email:</strong> {session?.user?.email}
				</div>
				<div className="text-lg">
					<strong>Password:</strong> ********
				</div>
				<button
					className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
					onClick={() => setIsModalOpen(true)}
				>
					Change Password
				</button>
			</div>
			{isModalOpen && (
				<ChangePasswordModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default MyAccount;
