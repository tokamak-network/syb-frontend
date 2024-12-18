'use client';

import React, { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { apiRequest } from '@/utils/api';
import { ChangePasswordModal } from '@/components/account';
import { Button, PageLoader } from '@/components';

const MyAccount: React.FC = () => {
	const { data: session, status } = useSession();
	// const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	// Mock data for vouches and score
	const vouchesReceived = 15;
	const vouchesGiven = 10;
	const score = 85;

	// Mock data for related users
	const relatedUsers = [
		{ id: '0x123', vouchesReceived: 5, vouchesGiven: 3, score: 75 },
		{ id: '0x456', vouchesReceived: 8, vouchesGiven: 2, score: 80 },
		{ id: '0x789', vouchesReceived: 10, vouchesGiven: 5, score: 90 },
	];

	if (status === 'loading') {
		return <PageLoader />;
	}

	if (!session) {
		return <p>You are not logged in.</p>;
	}

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
			<div className="flex w-full justify-center space-x-20">
				<div className="flex flex-col space-y-4">
					<div className="flex flex-col items-center space-y-4">
						<Suspense fallback={<PageLoader />}>
							<div className="relative">
								<Image
									alt="Profile"
									className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
									height={40}
									src={previewImage || '/images/avatar/default-avatar.png'}
									width={40}
								/>
								<input
									accept="image/*"
									className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
									type="file"
									onChange={handleImageUpload}
								/>
							</div>
						</Suspense>
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
							<strong>User Name:</strong> {session.user.name || 'Default User'}
						</div>
						<div className="text-lg">
							<strong>Password:</strong> ********
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center space-y-4">
					<h2 className="text-2xl font-semibold">Security Options</h2>
					<Button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
						Change Email
					</Button>
					<Button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
						Change Username
					</Button>
					<Button
						className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						onClick={() => setIsModalOpen(true)}
					>
						Change Password
					</Button>
					<Button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
						Enable 2FA
					</Button>
				</div>
			</div>
			<div className="flex flex-col items-center space-y-4">
				<h2 className="text-2xl font-semibold">Vouches and Score</h2>
				<div className="flex items-center space-x-10">
					<div className="text-lg">
						<strong>Vouches Received:</strong> {vouchesReceived}
					</div>
					<div className="text-lg">
						<strong>Vouches Given:</strong> {vouchesGiven}
					</div>
					<div className="text-lg">
						<strong>Score:</strong> {score}
					</div>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg shadow-lg">
				<table className="min-w-full table-auto rounded-lg">
					<thead className="bg-tableHeader font-abhaya text-tableTextPrimary">
						<tr>
							<th
								className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
								colSpan={7}
							>
								User ID
							</th>
							<th
								className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
								colSpan={7}
							>
								Vouches Received
							</th>
							<th
								className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
								colSpan={7}
							>
								Vouches Given
							</th>
							<th
								className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
								colSpan={7}
							>
								Score
							</th>
						</tr>
					</thead>
					<tbody className="bg-tableBackground font-abhaya">
						{relatedUsers.map((user) => (
							<tr
								key={user.id}
								className={`border-b-2 border-tableBorder bg-tableBackground font-abhaya text-gray-700 transition-colors duration-300 hover:bg-tableHover`}
							>
								<td
									className="whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary"
									colSpan={7}
								>
									{user.id}
								</td>
								<td
									className="whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary"
									colSpan={7}
								>
									{user.vouchesReceived}
								</td>
								<td
									className="whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary"
									colSpan={7}
								>
									{user.vouchesGiven}
								</td>
								<td
									className="whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary"
									colSpan={7}
								>
									{user.score}
								</td>
							</tr>
						))}
					</tbody>
				</table>
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
