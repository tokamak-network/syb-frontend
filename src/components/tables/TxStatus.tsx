'use client';

import {
	AiOutlineCloseCircle,
	AiOutlineCheckCircle,
	AiOutlineMinusCircle,
} from 'react-icons/ai';

import { ActionStatus } from '@/types';
import { useTheme } from '@/context';

interface TxStatusProps {
	status: ActionStatus;
}

const TxStatus: React.FC<TxStatusProps> = ({ status }) => {
	const { theme } = useTheme();

	// Get background color based on status
	const getBgClass = () => {
		switch (status) {
			case ActionStatus.FORGED:
				return theme === 'light'
					? 'bg-[#1b4b2f]'
					: theme === 'dark'
						? 'bg-[#29543C]'
						: 'bg-[#1e4d2b]';
			case ActionStatus.PENDING:
				return theme === 'light'
					? 'bg-[#2a251e]'
					: theme === 'dark'
						? 'bg-[#353025]'
						: 'bg-[#2a2620]';
			case ActionStatus.FAILED:
				return theme === 'light'
					? 'bg-[#6b1d1c]'
					: theme === 'dark'
						? 'bg-[#7D2625]'
						: 'bg-[#6a2020]';
			default:
				return theme === 'light'
					? 'bg-[#2a251e]'
					: theme === 'dark'
						? 'bg-[#353025]'
						: 'bg-[#2a2620]';
		}
	};

	const getTextClass = () => {
		switch (status) {
			case ActionStatus.FORGED:
				return theme === 'light'
					? 'text-white font-semibold'
					: theme === 'dark'
						? 'text-green-300'
						: 'text-green-300';
			case ActionStatus.PENDING:
				return theme === 'light'
					? 'text-white font-semibold'
					: theme === 'dark'
						? 'text-yellow-200'
						: 'text-yellow-200';
			case ActionStatus.FAILED:
				return theme === 'light'
					? 'text-white font-semibold'
					: theme === 'dark'
						? 'text-red-200'
						: 'text-red-200';
			default:
				return theme === 'light'
					? 'text-white font-semibold'
					: theme === 'dark'
						? 'text-gray-200'
						: 'text-gray-200';
		}
	};

	const themeStyles =
		theme === 'light'
			? 'border-current hover:outline-gray-600'
			: theme === 'dark'
				? 'border-gray-300 hover:outline-gray-300'
				: 'border-gray-400 hover:outline-gray-300';

	return (
		<div
			className={`flex rounded-md ${getBgClass()} ${getTextClass()} w-fit select-none items-center space-x-1 border ${themeStyles} px-2 py-1 text-center text-xs font-medium outline-none transition-all duration-200 hover:outline-dashed hover:outline-2 hover:outline-offset-2`}
		>
			{status === ActionStatus.FORGED && <AiOutlineCheckCircle size={14} />}
			{status === ActionStatus.FAILED && <AiOutlineCloseCircle size={14} />}
			{status === ActionStatus.PENDING && <AiOutlineMinusCircle size={14} />}
			<p>{status}</p>
		</div>
	);
};

export default TxStatus;
