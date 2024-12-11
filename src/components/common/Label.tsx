import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useRouter } from 'next/navigation';

import { shortenAddress } from '@/utils';

interface LabelProps {
	value: string;
	shorten?: 'middle' | 'end';
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

	const explorerUrl = process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER_URL || '';
	const explorerPath = isTransaction ? `tx/${value}` : `address/${value}`;
	const displayValue = shortenAddress(value, shorten);

	const handleClick = () => {
		if (navigateToAccount) {
			router.push(`/account/${value}`);
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
					{explore ? (
						<a
							className={`inline-block w-fit cursor-pointer text-blue-500 hover:underline ${className}`}
							href={`${explorerUrl}/${explorerPath}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							{displayValue.toLocaleUpperCase()}
						</a>
					) : navigateToAccount ? (
						<span
							className={`inline-block w-fit cursor-pointer text-blue-500 hover:underline ${className}`}
							role="button"
							tabIndex={0}
							onClick={handleClick}
							onKeyDown={handleKeyDown}
						>
							{displayValue.toLocaleUpperCase()}
						</span>
					) : (
						<span
							className={`inline-block w-fit cursor-pointer text-gray-700 ${className}`}
						>
							{displayValue.toLocaleUpperCase()}
						</span>
					)}
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						align="center"
						className="rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-md"
						side="top"
					>
						{value.toLocaleUpperCase()}
						<Tooltip.Arrow className="fill-gray-800" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};
