import React, { useState, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useRouter } from 'next/navigation';

import { shortenAddress, formatTransactionHash } from '@/utils';

interface LabelProps {
	value: string;
	shorten?: 'middle' | 'end' | 'full';
	explore?: boolean;
	isTransaction: boolean;
	navigateToAccount?: boolean;
	className?: string;
}

export const Label: React.FC<LabelProps> = ({
	value,
	shorten = 'middle',
	explore = false,
	isTransaction = false,
	navigateToAccount = false,
	className = '',
}) => {
	const router = useRouter();
	const [explorerUrl, setExplorerUrl] = useState<string>('');
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setExplorerUrl(process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER_URL || '');
		setIsClient(true);
	}, []);
	const explorerPath = isTransaction ? `tx/${value}` : `accounts/${value}`;

	// Use appropriate formatting function based on whether it's a transaction or address
	const displayValue = isTransaction
		? formatTransactionHash(
				value,
				shorten === 'end' ? 4 : shorten === 'full' ? 64 : 6,
			)
		: shortenAddress(value, shorten);

	const formattedDisplayValue = isTransaction
		? displayValue // formatTransactionHash already handles proper formatting
		: displayValue.startsWith('0x')
			? `0x${displayValue.slice(2).toUpperCase()}`
			: displayValue.toUpperCase();

	const handleClick = () => {
		if (navigateToAccount) {
			const relativePath = `explorer/${explorerPath}`;

			router.push(relativePath);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					{explore && isClient ? (
						<a
							className={`inline-block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 hover:underline ${className}`}
							href={`${explorerUrl}/${explorerPath}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							{formattedDisplayValue}
						</a>
					) : navigateToAccount ? (
						<span
							className={`inline-block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 hover:underline ${className}`}
							role="button"
							tabIndex={0}
							onClick={handleClick}
							onKeyDown={handleKeyDown}
						>
							{formattedDisplayValue}
						</span>
					) : (
						<span
							className={`inline-block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-gray-700 ${className}`}
						>
							{formattedDisplayValue}
						</span>
					)}
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						align="center"
						className="w-[300px] break-words rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg"
						side="top"
					>
						{isTransaction
							? value.startsWith('0x')
								? value
								: `0x${value}`
							: value.startsWith('0x')
								? `0x${value.slice(2).toUpperCase()}`
								: value.toUpperCase()}
						<Tooltip.Arrow className="fill-gray-800" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};
