import {
	AiOutlineCloseCircle,
	AiOutlineCheckCircle,
	AiOutlineMinusCircle,
} from 'react-icons/ai';

import { ActionStatus } from '@/types';

interface TxStatusProps {
	status: ActionStatus;
}

const TxStatus: React.FC<TxStatusProps> = ({ status }) => {
	const statusStyles =
		status === ActionStatus.FORGED
			? 'bg-[#29543C]'
			: status === ActionStatus.PENDING
				? 'bg-[#353025]'
				: 'bg-[#7D2625]';

	return (
		<div
			className={`flex rounded-md ${statusStyles} w-fit items-center space-x-2 px-2 py-1 text-center text-tableTextInfo`}
		>
			{status === ActionStatus.FORGED && <AiOutlineCheckCircle />}
			{status === ActionStatus.FAILED && <AiOutlineCloseCircle />}
			{status === ActionStatus.PENDING && <AiOutlineMinusCircle />}
			<p>{status}</p>
		</div>
	);
};

export default TxStatus;
