import React from 'react';

import { TransactionType } from '@/types';
import { formatDate, formatTime, statusStyles, typeStyles } from '@/utils';

export const TransactionListDetailsCard: React.FC<TransactionType> = ({
	time,
	amount,
	type,
	status,
}) => {
	return (
		<div className="flex justify-between rounded-lg border-2 border-gray-200 border-opacity-40 p-2">
			{/* Transaction Information */}
			<div className="flex flex-col">
				<p className={`font-poppins font-medium ${typeStyles[type]}`}>{type}</p>
				<p className={`font-poppins font-normal ${statusStyles[status]}`}>
					{status}
				</p>
			</div>
			<div className="flex flex-col text-right">
				<p className="font-roboto font-medium text-[#24A959]">{amount} ETH</p>
				<div className="flex flex-row justify-between font-poppins text-[#818E9E]">
					<p>{formatDate(time)}</p>
					&nbsp;{'|'}&nbsp;
					<p>{formatTime(time)}</p>
				</div>
			</div>
		</div>
	);
};
