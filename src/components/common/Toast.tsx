import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
		success: <AiOutlineCheckCircle className="text-white" size={35} />,
		warning: <AiOutlineWarning className="text-black" size={35} />,
		error: <AiOutlineCloseCircle className="text-white" size={35} />,
		info: <AiOutlineInfoCircle className="text-white" size={35} />,
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
			<motion.div
				animate={{ x: 0, opacity: progress / 100 }}
				className={`relative flex items-center space-x-3 rounded-md p-3 shadow-lg ${typeStyles[type]}`}
				exit={{ x: '100%', opacity: 0 }}
				initial={{ x: '100%', opacity: 1 }}
				transition={{ duration: 0.1 }}
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
						<AiOutlineCloseCircle size={40} />
					</button>
				</ToastPrimitive.Action>
				<div
					className="absolute bottom-0 left-0 h-1 bg-white"
					style={{ width: `${progress}%` }}
				/>
			</motion.div>
			<ToastPrimitive.Viewport />
		</ToastPrimitive.Provider>
	);
};
