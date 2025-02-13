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
		<Dialog.Root
			modal={false}
			open={isOpen}
			onOpenChange={(open) => !open && onClose()}
		>
			<Dialog.Portal>
				{/* Overlay */}
				<Dialog.Overlay
					className={cn('fixed inset-0 bg-opacity-50 transition-opacity')}
				/>

				{/* Content */}
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg p-6 shadow-lg focus:outline-none',
						styles.background,
						styles.text,
						className,
					)}
				>
					{/* Title */}
					<Dialog.Title className={cn('mb-4 text-lg font-bold', styles.text)}>
						{title}
					</Dialog.Title>

					{/* Modal Content */}
					<div className="space-y-4">{children}</div>

					{/* Close Button */}
					<Dialog.Close asChild>
						<button
							aria-label="Close"
							className={cn('absolute right-2 top-2 rounded-full p-1')}
						>
							✕
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
