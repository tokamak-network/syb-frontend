import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { FaChevronDown } from 'react-icons/fa';

import { cn } from '@/utils/cn';

interface SelectProps {
	label?: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
	labelClassName?: string;
	triggerClassName?: string;
	contentClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
	label,
	options,
	value,
	onChange,
	className,
	labelClassName,
	triggerClassName,
	contentClassName,
}) => {
	return (
		<div className={cn('flex flex-col space-y-2', className)}>
			{label && (
				<label
					className={cn('text-sm font-medium text-gray-200', labelClassName)}
				>
					{label}
				</label>
			)}
			<RadixSelect.Root value={value} onValueChange={onChange}>
				<RadixSelect.Trigger
					className={cn(
						'flex w-full items-center justify-between rounded-md border border-white/20 bg-white/10 p-2 text-sm text-white shadow-sm transition-colors hover:bg-white/20 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50',
						triggerClassName,
					)}
				>
					<RadixSelect.Value />
					<RadixSelect.Icon>
						<FaChevronDown className="text-white" />
					</RadixSelect.Icon>
				</RadixSelect.Trigger>
				<RadixSelect.Portal>
					<RadixSelect.Content
						className={cn(
							'z-[52] mt-1 w-full rounded-md border border-white/20 bg-modal-primary shadow-lg',
							contentClassName,
						)}
					>
						<RadixSelect.Viewport>
							{options.map((option) => (
								<RadixSelect.Item
									key={option.value}
									className="cursor-pointer p-2 text-sm text-white transition-colors hover:bg-white/10"
									value={option.value}
								>
									<RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
								</RadixSelect.Item>
							))}
						</RadixSelect.Viewport>
					</RadixSelect.Content>
				</RadixSelect.Portal>
			</RadixSelect.Root>
		</div>
	);
};
