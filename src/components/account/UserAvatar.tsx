import Image from 'next/image';
import React, { useState } from 'react';

export const UserAvatar: React.FC = () => {
	const [avatar, setAvatar] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				setAvatar(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex flex-col items-center space-y-8">
			<Image
				alt="User Avatar"
				height={300}
				src={avatar || '/images/avatar/default.svg'}
				width={300}
			/>
			<label className="mt-2">
				<input
					accept="image/*"
					className="hidden"
					type="file"
					onChange={handleFileChange}
				/>
				<span className="cursor-pointer rounded border-2 border-white border-opacity-60 px-4 py-2 text-white duration-200 hover:bg-secondary">
					{avatar ? 'Change Image' : 'Upload Image'}
				</span>
			</label>
		</div>
	);
};
