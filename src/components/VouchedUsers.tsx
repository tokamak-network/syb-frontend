import { useState, useEffect } from 'react';

import { useVouchData } from '@/hooks/useVouchData';
import { useWallet } from '@/hooks/useWallet';

interface VouchedUsersProps {
	possibleUsers?: string[];
	className?: string;
}

const VouchedUsers: React.FC<VouchedUsersProps> = ({
	possibleUsers = [],
	className = '',
}) => {
	const { address } = useWallet();
	const { useAddressesVouchedFor } = useVouchData();
	const [vouchedAddresses, setVouchedAddresses] = useState<string[]>([]);

	// Only check for vouched users if we have an address and possible users
	const {
		vouchedAddresses: fetchedAddresses,
		isLoading,
		error,
	} = useAddressesVouchedFor(address || '', possibleUsers);

	useEffect(() => {
		if (fetchedAddresses) {
			setVouchedAddresses(fetchedAddresses);
		}
	}, [fetchedAddresses]);

	if (isLoading) {
		return (
			<div className={`animate-pulse ${className}`}>
				Loading vouched users...
			</div>
		);
	}

	if (error) {
		return (
			<div className={`text-red-500 ${className}`}>Error: {error.message}</div>
		);
	}

	if (vouchedAddresses.length === 0) {
		return (
			<div className={className}>
				You haven&apos;t vouched for any users yet.
			</div>
		);
	}

	return (
		<div className={className}>
			<h3 className="mb-2 text-lg font-semibold">
				Users You&apos;ve Vouched For
			</h3>
			<ul className="space-y-2">
				{vouchedAddresses.map((address) => (
					<li key={address} className="rounded-md border p-2">
						<span className="font-mono">{address}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

// Similar component to show users who have vouched for the current user
export const UsersWhoVouched: React.FC<VouchedUsersProps> = ({
	possibleUsers = [],
	className = '',
}) => {
	const { address } = useWallet();
	const { useVouchersFor } = useVouchData();
	const [vouchers, setVouchers] = useState<string[]>([]);

	const {
		vouchers: fetchedVouchers,
		isLoading,
		error,
	} = useVouchersFor(address || '', possibleUsers);

	useEffect(() => {
		if (fetchedVouchers) {
			setVouchers(fetchedVouchers);
		}
	}, [fetchedVouchers]);

	if (isLoading) {
		return (
			<div className={`animate-pulse ${className}`}>
				Loading users who vouched for you...
			</div>
		);
	}

	if (error) {
		return (
			<div className={`text-red-500 ${className}`}>Error: {error.message}</div>
		);
	}

	if (vouchers.length === 0) {
		return <div className={className}>No users have vouched for you yet.</div>;
	}

	return (
		<div className={className}>
			<h3 className="mb-2 text-lg font-semibold">Users Who Vouched For You</h3>
			<ul className="space-y-2">
				{vouchers.map((address) => (
					<li key={address} className="rounded-md border p-2">
						<span className="font-mono">{address}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default VouchedUsers;
