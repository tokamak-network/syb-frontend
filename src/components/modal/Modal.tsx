import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '@/utils/cn';
import { Button } from '@/components';

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
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Dialog.Portal>
				{/* Overlay */}
				<Dialog.Overlay
					className={cn(
						'fixed inset-0 bg-black bg-opacity-50 transition-opacity',
					)}
				/>

				{/* Content */}
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg focus:outline-none',
						className,
					)}
				>
					{/* Title */}
					<Dialog.Title className="mb-4 text-lg font-bold">
						{title}
					</Dialog.Title>

					{/* Modal Content */}
					<div className="space-y-4">{children}</div>

					{/* Close Button */}
					<Dialog.Close asChild>
						<Button
							aria-label="Close"
							className={cn(
								'absolute right-2 top-2 text-gray-500 hover:text-gray-700',
							)}
						>
							✕
						</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
