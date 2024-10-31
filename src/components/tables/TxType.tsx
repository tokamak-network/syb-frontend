import { ActionType } from '@/types';

interface TxTypesProps {
	txType: ActionType;
}

const TxTypes: React.FC<TxTypesProps> = ({ txType }) => {
	const txTypesStyles =
		txType === ActionType.DEPOSIT
			? 'bg-[#FFA000] text-white'
			: txType === ActionType.WITHDRAW
				? 'bg-[#353025] text-[#E6D7BE]'
				: txType === ActionType.EXPLODE
					? 'bg-[#EF443B] text-[#E6D7BE]'
					: 'bg-[#4CAF50] text-[#E6D7BE]';

	return (
		<div
			className={`flex rounded-md ${txTypesStyles} items-center space-x-2 px-2 py-1 text-center`}
		>
			{txType}
		</div>
	);
};

export default TxTypes;
