import React, { useState } from 'react';
import { HiOutlineArrowDown } from 'react-icons/hi';

import { Button, SearchBarComponent } from '@/components';
import { explorerData } from '@/const';

import TxTypes from './TxType';
import TxStatus from './TxStatus';
import UserAddress from './UserAddress';

// interface ChainActivityTableProps {
// }

const ChainActivityTable: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const filteredData = explorerData.filter((transaction) => {
		const query = searchQuery.toLowerCase();

		return (
			transaction.txHash.toLocaleLowerCase().includes(query) ||
			transaction.txUser.from.toLowerCase().includes(query) ||
			transaction.txUser.to.toLowerCase().includes(query) ||
			transaction.blockNumber.toString().includes(query)
		);
	});

	return (
		<div className="flex flex-col space-y-5">
			<SearchBarComponent
				placeholder={'Search User ID/Address/Block Nuber/Transaction Hash'}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="flex justify-between">
				<div className="flex justify-between space-x-3 font-narnoor">
					<Button className="bg-tableBackground text-center">Validated</Button>
					<Button className="bg-tableBackground">Pending</Button>
				</div>
				<div className="flex space-x-2 font-narnoor">
					<Button className="border-tableBorder bg-tableBackground border-2 text-center text-[#6290B6]">
						First
					</Button>
					<div className="flex space-x-3">
						<Button className="border-tableBorder bg-tableBackground border-2 text-[#6290B6]">
							{'<'}
						</Button>
						<Button className="bg-[#4B5569]">{'1'}</Button>
						<Button className="border-tableBorder bg-tableBackground border-2 text-[#6290B6]">
							{'>'}
						</Button>
					</div>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg shadow-lg">
				<table className="min-w-full table-auto rounded-lg">
					<thead className="bg-tableHeader text-tableTextPrimary font-abhaya">
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
					<tbody className="bg-tableBackground font-abhaya">
						<tr>
							<td className="bg-tableRowBackground px-6 py-1" colSpan={7}>
								<span className="text-tableTextInfo">
									9903 more transactions{' '}
								</span>
								<span className="text-tableTextNotice">have come in</span>
							</td>
						</tr>
						{filteredData.map((transaction, index) => (
							<tr
								key={index}
								className={`bg-tableBackground border-tableBorder hover:bg-tableHover border-b-2 font-abhaya text-gray-700 transition-colors duration-300`}
							>
								<td className="flex flex-col space-y-4 whitespace-nowrap px-6 py-2 text-left font-normal">
									<span className="text-tableTextSecondary">{`0xHash${index}`}</span>
									<span className="text-white">{'1m ago'}</span>
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal">
									<TxTypes txType={transaction.type.txType} />
									<TxStatus status={transaction.type.txStatus} />
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
									<span className="bg-tableButtonBackground text-tableButtonText rounded-lg px-2 py-1 font-abhaya">
										{transaction.method.toLocaleLowerCase()}
									</span>
								</td>
								<td className="text-tableTextSecondary whitespace-nowrap px-6 py-2 text-left font-normal">
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
