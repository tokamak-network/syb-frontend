import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/utils/cn';
import { themeStyles } from '@/const';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
	title: string;
	theme?: 'light' | 'dark' | 'dim';
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	className,
	children,
	title,
	theme = 'light',
}) => {
	const styles = themeStyles[theme];

	return (
		<Dialog.Root modal={true} open={isOpen}>
			<Dialog.Portal>
				{/* Overlay with blur effect */}
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

				{/* Content */}
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 z-[51] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-modal-primary p-6 shadow-lg focus:outline-none',
						className,
					)}
				>
					{/* Title */}
					<Dialog.Title className="mb-4 text-lg font-bold text-white">
						{title}
					</Dialog.Title>

					{/* Modal Content */}
					<div className="space-y-4">{children}</div>

					{/* Close Button */}
					<button
						onClick={onClose}
						aria-label="Close"
						className="absolute right-2 top-2 rounded-full p-1 text-white hover:bg-white/10"
					>
						✕
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
