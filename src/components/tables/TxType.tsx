import { ActionType } from '@/types';

interface TxTypesProps {
	txType: ActionType;
}

const TxTypes: React.FC<TxTypesProps> = ({ txType }) => {
	const txTypesStyles =
		txType === ActionType.DEPOSIT
			? 'bg-txDeposit text-txDepositText'
			: txType === ActionType.WITHDRAW
				? 'bg-txWithdraw text-txWithdrawText'
				: txType === ActionType.EXPLODE
					? 'bg-txExplode text-txExplodeText'
					: 'bg-txDefault text-txDefaultText';

	return (
		<div
			className={`flex rounded-md ${txTypesStyles} items-center space-x-2 px-2 py-1 text-center`}
		>
			{txType}
		</div>
	);
};

export default TxTypes;
