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
			case ActionType.EXPLODE_MULTIPLE:
				return theme === 'light'
					? 'bg-[#d32f2f]'
					: theme === 'dark'
						? 'bg-txExplode'
						: 'bg-txExplode';
			case ActionType.VOUCH:
				return theme === 'light'
					? 'bg-[#4caf50]'
					: theme === 'dark'
						? 'bg-green-600'
						: 'bg-green-600';
			case ActionType.UNVOUCH:
				return theme === 'light'
					? 'bg-[#f44336]'
					: theme === 'dark'
						? 'bg-red-600'
						: 'bg-red-600';
			case ActionType.FORGE_BATCH:
				return theme === 'light'
					? 'bg-[#9c27b0]'
					: theme === 'dark'
						? 'bg-purple-600'
						: 'bg-purple-600';
			case ActionType.PROVE_SCORE_MERKLE:
				return theme === 'light'
					? 'bg-[#2196f3]'
					: theme === 'dark'
						? 'bg-blue-600'
						: 'bg-blue-600';
			case ActionType.UPDATE_SCORE:
				return theme === 'light'
					? 'bg-[#ff9800]'
					: theme === 'dark'
						? 'bg-orange-600'
						: 'bg-orange-600';
			case ActionType.UPDATE_EXPLODE_AMOUNT:
			case ActionType.UPDATE_SCORING_BALANCE:
				return theme === 'light'
					? 'bg-[#607d8b]'
					: theme === 'dark'
						? 'bg-gray-600'
						: 'bg-gray-600';
			case ActionType.EXIT:
				return theme === 'light'
					? 'bg-[#795548]'
					: theme === 'dark'
						? 'bg-gray-700'
						: 'bg-gray-700';
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
			case ActionType.EXPLODE_MULTIPLE:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.VOUCH:
			case ActionType.UNVOUCH:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.FORGE_BATCH:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.PROVE_SCORE_MERKLE:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.UPDATE_SCORE:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.UPDATE_EXPLODE_AMOUNT:
			case ActionType.UPDATE_SCORING_BALANCE:
				return theme === 'light'
					? 'text-white font-semibold'
					: 'text-white font-medium';
			case ActionType.EXIT:
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
