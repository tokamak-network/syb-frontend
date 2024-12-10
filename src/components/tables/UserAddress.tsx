'use client';

import React from 'react';
import { FiUser, FiCopy } from 'react-icons/fi';

import { useToast } from '@/context';

import { Label } from '../common';

interface UserAddressProps {
	address: string;
}

export const UserAddress: React.FC<UserAddressProps> = ({ address }) => {
	const { addToast } = useToast();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address);
		addToast('warning', 'Success!', 'User Address is copied Successfully.');
	};

	return (
		<div className="flex items-center space-x-2">
			<FiUser className="text-blue-500" size={20} />
			<Label explore={true} isTransaction={false} value={address} />
			<button
				className="text-gray-500 hover:text-white"
				onClick={copyToClipboard}
			>
				<FiCopy size={16} />
			</button>
		</div>
	);
};
