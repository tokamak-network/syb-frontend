import React, { useEffect, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import {
	AiOutlineCheckCircle,
	AiOutlineWarning,
	AiOutlineCloseCircle,
	AiOutlineInfoCircle,
} from 'react-icons/ai';

interface ToastProps {
	id: string;
	type: 'success' | 'warning' | 'error' | 'info';
	title: string;
	description: string;
	onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
	id,
	type,
	title,
	description,
	onRemove,
}) => {
	const [progress, setProgress] = useState<number>(100);

	const typeStyles = {
		success: 'bg-green-500 text-white',
		warning: 'bg-yellow-500 text-black',
		error: 'bg-red-500 text-white',
		info: 'bg-blue-500 text-white',
	};

	const icons = {
		success: <AiOutlineCheckCircle className="text-white" />,
		warning: <AiOutlineWarning className="text-black" />,
		error: <AiOutlineCloseCircle className="text-white" />,
		info: <AiOutlineInfoCircle className="text-white" />,
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => (prev > 0 ? prev - 1 : 0));
		}, 50);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (progress === 0) {
			onRemove(id);
		}
	}, [progress, id, onRemove]);

	return (
		<ToastPrimitive.Provider>
			<ToastPrimitive.Root
				className={`fixed bottom-0 right-0 m-4 flex items-center space-x-3 rounded-md p-3 shadow-lg ${typeStyles[type]}`}
				onMouseEnter={() => setProgress(100)}
			>
				{icons[type]}
				<div>
					<ToastPrimitive.Title className="font-bold">
						{title}
					</ToastPrimitive.Title>
					<ToastPrimitive.Description>{description}</ToastPrimitive.Description>
				</div>
				<ToastPrimitive.Action asChild altText="Close">
					<button
						className="ml-2 text-sm font-medium"
						onClick={() => onRemove(id)}
					>
						Close
					</button>
				</ToastPrimitive.Action>
				<div
					className="absolute bottom-0 left-0 h-1 bg-white"
					style={{ width: `${progress}%` }}
				/>
			</ToastPrimitive.Root>
			<ToastPrimitive.Viewport />
		</ToastPrimitive.Provider>
	);
};
