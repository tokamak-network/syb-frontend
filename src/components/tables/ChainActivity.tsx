import React from 'react';
import { HiOutlineArrowDown } from 'react-icons/hi';

import { Button } from '@/components';
import { explorerData } from '@/data';

import TxTypes from './TxType';
import TxStatus from './TxStatus';
import UserAddress from './UserAddress';

// interface ChainActivityTableProps {
// }

const ChainActivityTable: React.FC = () => {
	return (
		<div className="flex flex-col space-y-5">
			<div className="flex justify-between">
				<div className="flex justify-between space-x-3 font-narnoor">
					<Button className="bg-[#1B202C] text-center">Validated</Button>
					<Button className="bg-[#101112]">Pending</Button>
				</div>
				<div className="flex space-x-2 font-narnoor">
					<Button className="border-2 border-[#23323E] bg-[#1B202C] text-center text-[#6290B6]">
						First
					</Button>
					<div className="flex space-x-3">
						<Button className="border-2 border-[#23323E] bg-[#101112] text-[#6290B6]">
							{'<'}
						</Button>
						<Button className="bg-[#4B5569]">{'1'}</Button>
						<Button className="border-2 border-[#23323E] bg-[#101112] text-[#6290B6]">
							{'>'}
						</Button>
					</div>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg shadow-lg">
				<table className="min-w-full table-auto rounded-lg">
					<thead className="bg-[#232425] font-abhaya text-[#B0B0B0]">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Transaction Hash
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Method
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								Block
							</th>
							<th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
								From/To
							</th>
							<th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
								Value ETH
							</th>
							<th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
								Fee ETh
							</th>
						</tr>
					</thead>
					<tbody className="bg-[#101112] font-abhaya">
						<tr>
							<td className="bg-[#353025] px-6 py-1" colSpan={7}>
								<span className="text-[#4897EF]">9903 more transactions </span>
								<span className="text-[#D7BC90]">have come in</span>
							</td>
						</tr>
						{explorerData.map((transaction, index) => (
							<tr
								key={index}
								className={`border-b-2 border-[#232425] bg-[#101112] font-abhaya text-gray-700 transition-colors duration-300 hover:bg-[#26292c]`}
							>
								<td className="flex flex-col space-y-4 whitespace-nowrap px-6 py-2 text-left font-normal">
									<span className="text-[#70B4E8]">{`0xHash${index}`}</span>
									<span className="text-[#FFFFFF]">{'1m ago'}</span>
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal">
									<TxTypes txType={transaction.type.txType} />
									<TxStatus status={transaction.type.txStatus} />
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
									<span className="rounded-lg bg-[#1E1F20] px-2 py-1 font-abhaya text-[#E6D7BE]">
										{transaction.method.toLocaleLowerCase()}
									</span>
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-left font-normal text-[#70B4E8]">
									{transaction.blockNumber}
								</td>
								<td className="flex whitespace-nowrap px-6 py-2 text-left font-normal">
									<HiOutlineArrowDown
										className="mt-3 text-gray-500"
										size={16}
									/>
									<div>
										<UserAddress address={transaction.txUser.from} />
										<UserAddress address={transaction.txUser.to} />
									</div>
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-right font-acme font-normal text-white">
									{transaction.value}
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-right font-acme font-normal text-white">
									{transaction.fee}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ChainActivityTable;
