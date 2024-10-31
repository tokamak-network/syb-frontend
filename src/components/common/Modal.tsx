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
	content: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	className,
	children,
	title,
	content,
}) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Overlay className={cn('fixed inset-0 bg-black bg-opacity-0')} />
			<Dialog.Content
				className={cn(
					'fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded bg-black p-6 shadow-lg',
					className,
				)}
			>
				<Dialog.Title className="mb-4 text-lg font-bold">{title}</Dialog.Title>
				<p className="mb-4">{content}</p>
				<div className="flex space-x-4">{children}</div>
				<Dialog.Close asChild>
					<Button
						aria-label="Close"
						className={cn('absolute right-2 top-2')}
						onClick={onClose}
					>
						✕
					</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
};
