import Image from 'next/image';
import React from 'react';

import { cn } from '@/utils';

interface AvatarProps {
	address: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
	fallbackIcon?: React.ReactNode;
}

const sizeClasses = {
	sm: 'h-6 w-6',
	md: 'h-8 w-8',
	lg: 'h-10 w-10',
	xl: 'h-12 w-12',
};

const sizeValues = {
	sm: 24,
	md: 32,
	lg: 40,
	xl: 48,
};

const textSizeClasses = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-lg',
	xl: 'text-xl',
};

export const Avatar: React.FC<AvatarProps> = ({
	address,
	size = 'md',
	className,
	fallbackIcon,
}) => {
	// Use Effigy.im for Ethereum avatars - generates unique identicons for each address
	const effigyUrl = `https://effigy.im/a/${address}.svg`;

	const getInitials = (addr: string) => {
		// Get first 2 characters of the address (after 0x)
		const cleanAddr = addr.replace('0x', '');

		return cleanAddr.substring(0, 2).toUpperCase();
	};

	const getBackgroundColor = (addr: string) => {
		// Generate a consistent color based on address
		let hash = 0;

		for (let i = 0; i < addr.length; i++) {
			hash = addr.charCodeAt(i) + ((hash << 5) - hash);
		}

		const hue = Math.abs(hash) % 360;

		return `hsl(${hue}, 70%, 50%)`;
	};

	// Always use Effigy.im for Ethereum avatars
	const avatarUrl = effigyUrl;

	const sizeValue = sizeValues[size];

	return (
		<div
			className={cn(
				'relative flex items-center justify-center overflow-hidden rounded-full',
				sizeClasses[size],
				className,
			)}
		>
			<Image
				alt={`Avatar for ${address}`}
				className="object-cover"
				height={sizeValue}
				src={avatarUrl}
				width={sizeValue}
				onError={(e) => {
					// If Effigy.im fails to load, show fallback
					const target = e.target as HTMLImageElement;

					target.style.display = 'none';
					const fallback = target.nextElementSibling as HTMLElement;

					if (fallback) {
						fallback.style.display = 'flex';
					}
				}}
			/>
			<div
				className="absolute inset-0 hidden items-center justify-center font-semibold text-white"
				style={{ backgroundColor: getBackgroundColor(address) }}
			>
				{fallbackIcon || (
					<span className={textSizeClasses[size]}>{getInitials(address)}</span>
				)}
			</div>
		</div>
	);
};
