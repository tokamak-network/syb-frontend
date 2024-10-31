import React from 'react';

// import AccountInfo from "@/components/AccountInfo";
import { SecuritySettings } from '@/components';

const SettingsPage: React.FC = () => {
	return (
		<div className="p-8">
			<h2 className="mb-4 text-2xl font-bold">Settings</h2>
			<div className="space-y-6">
				{/* <AccountInfo /> */}
				<div>
					<SecuritySettings />
					<button className="mt-2 rounded bg-red-500 px-4 py-2 text-white">
						Withdraw ETH to L1
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
