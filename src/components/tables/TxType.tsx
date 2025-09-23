'use client';

import { ActionType } from '@/types';
import { useTheme } from '@/context';

interface TxTypesProps {
	txType: ActionType;
}

const TxTypes: React.FC<TxTypesProps> = ({ txType }) => {
	const { theme } = useTheme();

	const getBgClass = () => {
		switch (txType) {
			case ActionType.DEPOSIT:
				return theme === 'light'
					? 'bg-[#ff8f00]'
					: theme === 'dark'
						? 'bg-txDeposit'
						: 'bg-txDeposit';
			case ActionType.WITHDRAW:
				return theme === 'light'
					? 'bg-[#2d2820]'
					: theme === 'dark'
						? 'bg-txWithdraw'
						: 'bg-txWithdraw';
			case ActionType.EXPLODE:
				return theme === 'light'
					? 'bg-[#d32f2f]'
					: theme === 'dark'
						? 'bg-txExplode'
						: 'bg-txExplode';
			default:
				return theme === 'light'
					? 'bg-[#2e7d32]'
					: theme === 'dark'
						? 'bg-txDefault'
						: 'bg-txDefault';
		}
	};

	const getTextClass = () => {
		switch (txType) {
			case ActionType.DEPOSIT:
				return theme === 'light'
					? 'text-white font-bold'
					: theme === 'dark'
						? 'text-black font-bold'
						: 'text-black font-bold';
			case ActionType.WITHDRAW:
				return theme === 'light'
					? 'text-amber-200 font-semibold'
					: theme === 'dark'
						? 'text-[#d7bc90] font-medium'
						: 'text-[#cfcfcf] font-medium';
			case ActionType.EXPLODE:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			default:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
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
			className={`flex rounded-md ${getBgClass()} ${getTextClass()} w-fit select-none items-center border ${themeStyles} px-2 py-1 text-center text-xs font-medium outline-none transition-all duration-200 hover:outline-dashed hover:outline-2 hover:outline-offset-2`}
		>
			{txType}
		</div>
	);
};

export default TxTypes;
