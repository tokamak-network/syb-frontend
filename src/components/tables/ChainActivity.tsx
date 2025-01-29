import React, { useState } from 'react';
import { HiOutlineArrowDown } from 'react-icons/hi';

import { Button, SearchBarComponent } from '@/components';
import { explorerData } from '@/const';

import TxTypes from './TxType';
import TxStatus from './TxStatus';
import { UserAddress } from './UserAddress';

export const ChainActivityTable: React.FC = () => {
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
		<div className="flex w-full flex-col space-y-5">
			<SearchBarComponent
				placeholder={'Search User ID/Address/Block Nuber/Transaction Hash'}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="flex justify-between">
				<div className="flex justify-between space-x-3 font-narnoor">
					<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-tableTextPrimary">
						Validated
					</Button>
					<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-tableTextPrimary">
						Pending
					</Button>
				</div>
				<div className="flex space-x-2 font-narnoor">
					<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-center text-paginationButtonText">
						First
					</Button>
					<div className="flex space-x-3">
						<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-paginationButtonText">
							{'<'}
						</Button>
						<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-tableTextSecondary">
							{'1'}
						</Button>
						<Button className="border-2 border-paginationButtonBorder bg-paginationButton text-paginationButtonText">
							{'>'}
						</Button>
					</div>
				</div>
			</div>
			<div className="overflow-x-auto rounded-lg shadow-lg">
				<table className="min-w-full table-auto rounded-lg">
					<thead className="bg-tableHeader font-abhaya text-tableTextPrimary">
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
								className={`border-b-2 border-tableBorder bg-tableBackground font-abhaya text-gray-700 transition-colors duration-300 hover:bg-tableHover`}
							>
								<td className="flex flex-col space-y-4 whitespace-nowrap px-6 py-2 text-left font-normal">
									<UserAddress address={`0x${index}`} type="tx" />
									<span className="text-tableTextSecondary">{'1m ago'}</span>
								</td>
								<td className="space-y-2 whitespace-nowrap px-6 py-2 text-left font-normal">
									<TxTypes txType={transaction.type.txType} />
									<TxStatus status={transaction.type.txStatus} />
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-left font-normal">
									<span className="rounded-lg bg-tableButtonBackground px-2 py-1 font-abhaya text-tableTextPrimary">
										{transaction.method.toLocaleLowerCase()}
									</span>
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-left font-normal text-tableTextSecondary">
									{transaction.blockNumber}
								</td>
								<td className="flex whitespace-nowrap px-6 py-2 text-left font-normal">
									<HiOutlineArrowDown
										className="mt-3 text-gray-500"
										size={16}
									/>
									<div>
										<UserAddress
											address={transaction.txUser.from}
											type="address"
										/>
										<UserAddress
											address={transaction.txUser.to}
											type="address"
										/>
									</div>
								</td>
								<td className="font-norma whitespace-nowrap px-6 py-2 text-right font-acme text-tableTextSecondary">
									{transaction.value}
								</td>
								<td className="whitespace-nowrap px-6 py-2 text-right font-acme font-normal text-tableTextSecondary">
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
