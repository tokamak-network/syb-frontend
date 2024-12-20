'use client';

import React, { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { apiRequest } from '@/utils/api';
import { ChangePasswordModal } from '@/components/account';
import { Button, PageLoader, SearchBarComponent, Tabs } from '@/components';
import { pinata } from '@/config';
import { useToast } from '@/context';

const MyAccount: React.FC = () => {
	const { data: session, status } = useSession();
	const { addToast } = useToast();
	// const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [activeTab, setActiveTab] = useState<
		'all' | 'vouchesDid' | 'vouchesReceived'
	>('all');
	const [fileUploading, setFileUploading] = useState<boolean>(false);

	// const {
	// 	data: user,
	// 	isLoading,
	// 	isError,
	// } = useQuery({
	// 	queryKey: ['userProfile'],
	// 	queryFn: async () => {
	// 		const response: any = await apiRequest({
	// 			method: 'GET',
	// 			url: '/account/user',
	// 		});

	// 		return response.data;
	// 	},
	// });

	// Mock data for vouches and score
	const vouchesReceived = 15;
	const vouchesGiven = 10;
	const score = 85;

	// Mock data for related users
	const connectedUsers = [
		{
			id: '0x123',
			vouchedFor: true,
			vouchedBy: false,
			vouchesReceived: 5,
			vouchesGiven: 3,
			score: 75,
		},
		{
			id: '0x456',
			vouchedFor: false,
			vouchedBy: true,
			vouchesReceived: 8,
			vouchesGiven: 2,
			score: 80,
		},
		{
			id: '0x789',
			vouchedFor: true,
			vouchedBy: true,
			vouchesReceived: 10,
			vouchesGiven: 5,
			score: 90,
		},
		{
			id: '0xabc',
			vouchedFor: false,
			vouchedBy: false,
			vouchesReceived: 2,
			vouchesGiven: 1,
			score: 70,
		},
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

		try {
			setFileUploading(true);

			const keyData: any = await apiRequest({
				method: 'GET',
				url: '/account/update-profile-image',
			});

			const upload = await pinata.upload.file(profileImage).key(keyData.JWT);

			const imageUrl = `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;

			await apiRequest({
				method: 'POST',
				url: '/account/update-profile-image',
				data: { userId: session.user.id, imageUrl },
			});

			setFileUploading(false);
			addToast('success', 'Successful', 'Profile Image Saved Successfully!');
		} catch (error) {
			console.error('Error uploading profile image:', error);
			addToast('error', 'Failed', 'Failed to Upload Profile Image!');
		}
	};

	// Filter users based on the active tab
	const filteredUsers = connectedUsers.filter((user) => {
		if (activeTab === 'vouchesDid') {
			return user.vouchedFor; // Show users vouched for by the current user
		}
		if (activeTab === 'vouchesReceived') {
			return user.vouchedBy; // Show users who vouched for the current user
		}

		return true; // Show all users for the "All" tab
	});

	// Apply search query to the filtered users
	const displayedUsers = filteredUsers.filter((user) =>
		user.id.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col items-center space-y-12 p-6">
			<div className="flex flex-col items-center space-y-4">
				<Suspense fallback={<PageLoader />}>
					<div className="relative">
						<Image
							alt="Profile"
							className="h-64 w-64 rounded-full border-2 border-gray-300 object-cover"
							height={100}
							src={previewImage || '/images/avatar/default-avatar.png'}
							width={100}
						/>
						<input
							accept="image/*"
							className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
							type="file"
							onChange={handleImageUpload}
						/>
					</div>
				</Suspense>
				<Button
					className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					isLoading={fileUploading}
					onClick={handleSaveProfileImage}
				>
					Save Profile Image
				</Button>
			</div>

			<div className="w-full max-w-2xl space-y-6">
				<div className="flex items-center justify-between">
					<div className="text-lg">
						<strong>Email:</strong> {session?.user?.email}
					</div>
					<Button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
						Change Email
					</Button>
				</div>
				<div className="flex items-center justify-between">
					<div className="text-lg">
						<strong>Username:</strong> {session?.user?.name || 'Default User'}
					</div>
					<Button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
						Change Username
					</Button>
				</div>
				<div className="flex items-center justify-between">
					<div className="text-lg">
						<strong>Password:</strong> ********
					</div>
					<Button
						className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						onClick={() => setIsModalOpen(true)}
					>
						Change Password
					</Button>
				</div>
			</div>
			<div className="flex items-center space-x-20">
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
			<div className="flex flex-col items-center space-y-4">
				<h2 className="text-2xl font-semibold">Connected Users</h2>
				<SearchBarComponent
					placeholder="Search users by ID..."
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<Tabs
					activeTab={activeTab}
					tabs={[
						{ label: 'All', value: 'all' },
						{ label: 'Vouches Did', value: 'vouchesDid' },
						{ label: 'Vouches Received', value: 'vouchesReceived' },
					]}
					onTabChange={(tab) =>
						setActiveTab(tab as 'all' | 'vouchesDid' | 'vouchesReceived')
					}
				/>

				<table className="min-w-full table-auto rounded-lg">
					<thead className="bg-tableHeader font-abhaya text-tableTextPrimary">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								User ID
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Connected Status
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Vouches Received
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Vouches Given
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Score
							</th>
						</tr>
					</thead>
					<tbody className="bg-tableBackground font-abhaya">
						{displayedUsers.map((user) => (
							<tr
								key={user.id}
								className={`border-b-2 border-tableBorder bg-tableBackground font-abhaya text-gray-700 transition-colors duration-300 hover:bg-tableHover`}
							>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal">
									{user.id}
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextPrimary">
									{user.vouchedFor && user.vouchedBy
										? 'Vouched Both Ways'
										: user.vouchedFor
											? 'Vouched For'
											: user.vouchedBy
												? 'Vouched By'
												: 'Not Connected'}
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary">
									{user.vouchesReceived}
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary">
									{user.vouchesGiven}
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary">
									{user.score}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Change Password Modal */}
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
