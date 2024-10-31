import React from 'react';
import * as CheckBox from '@radix-ui/react-checkbox';

export const SecuritySettings: React.FC = () => {
	return (
		<div className="p-8">
			<h3 className="text-xl font-semibold">Security Settings</h3>
			<div className="flex items-center">
				<CheckBox.Root className="mr-2" id="two-factor">
					<CheckBox.Indicator className="h-4 w-4 bg-blue-500" />
				</CheckBox.Root>
				<label htmlFor="two-factor">Enable Two-Factor Authentication</label>
			</div>
		</div>
	);
};
