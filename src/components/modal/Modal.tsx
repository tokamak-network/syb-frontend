import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/utils/cn';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
	title: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	className,
	children,
	title,
}) => {
	return (
		<Dialog.Root modal={true} open={isOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />

				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 z-[51] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-modal-primary p-6 shadow-lg focus:outline-none',
						className,
					)}
				>
					<Dialog.Title className="mb-4 text-lg font-bold text-white">
						{title}
					</Dialog.Title>

					<div className="space-y-4">{children}</div>

					<button
						aria-label="Close"
						className="absolute right-2 top-2 rounded-full p-1 text-white hover:bg-white/10"
						onClick={onClose}
					>
						✕
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
